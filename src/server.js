// @flow

'use strict'

import Server from 'peranta/server'
import Router from 'peranta/router'
import Scheduler from './scheduler'
import uuid from 'uuid'

function Transport(app: { on: Function }, ipcMain: { on: Function })
{
    if (app === undefined) throw new TypeError('Transport.constructor() expects to receive Electron\'s app as the first argument')
    if (typeof app.on !== 'function') throw new TypeError('Transport.constructor() expects Electron\'s app to implement .on()')

    if (ipcMain === undefined) throw new TypeError('Transport.constructor() expects to receive Electron\'s ipcMain as the second argument')
    if (typeof ipcMain.on !== 'function') throw new TypeError('Transport.constructor() expects Electron\'s ipcMain to implement .on()')

    this.app = app
    this.ipcMain = ipcMain

    this.broadcastScheduler = new Scheduler()
    this.webContents = {}

    this.app.on('web-contents-created', (event, webContent) =>
    {
		const webContentId = uuid.v4()

        webContent.on('did-finish-load', () =>
        {
            this.webContents[webContentId] = webContent
            this.broadcastScheduler.start()
        })

		webContent.on('destroyed', () =>
		{
			delete this.webContents[webContentId]
		})
    })
}

Transport.prototype.on = function on(channel: string, callback: Function)
{
    this.ipcMain.on(channel, (event, req) => callback(event, req))
}

Transport.prototype.broadcast = function broadcast(channel: string, res)
{
    this.broadcastScheduler.push(() =>
    {
        Object.keys(this.webContents).forEach(webContentId =>
        {
            this.webContents[webContentId].send(channel, res)
        })

        return Promise.resolve()
    })
}

function create(app: { on: Function }, ipcMain: { on: Function })
{
    return new Server(new Transport(app, ipcMain), new Router())
}

export default { create }
