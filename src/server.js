// @flow

'use strict'

import Server from 'peranta/server'
import Router from 'peranta/router'
import Scheduler from './scheduler'
import isPlainObject from 'lodash.isplainobject'

function Transport(app: { on: Function }, ipcMain: { on: Function })
{
    if (app === undefined) throw new TypeError('Transport.constructor() expects to receive Electron\'s app as the first argument')
    if (typeof app.on !== 'function') throw new TypeError('Transport.constructor() expects Electron\'s app to implement .on()')

    if (ipcMain === undefined) throw new TypeError('Transport.constructor() expects to receive Electron\'s ipcMain as the second argument')
    if (typeof ipcMain.on !== 'function') throw new TypeError('Transport.constructor() expects Electron\'s ipcMain to implement .on()')

    this.app = app
    this.ipcMain = ipcMain

    this.broadcastScheduler = new Scheduler()
    this.webContents = []

    this.app.on('web-contents-created', (event, webContents) =>
    {
		const webContentsIdx = this.webContents.length

        webContents.on('did-finish-load', () =>
        {
            this.webContents.push(webContents)
            this.broadcastScheduler.start()
        })

		webContents.on('destroyed', () =>
		{
			delete this.webContents[webContentsIdx]
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
        this.webContents.forEach(webcontent =>
        {
			if (
				webcontent === undefined
				|| !isPlainObject(webcontent)
				|| !webcontent.hasOwnProperty('send')
			) return

            webcontent.send(channel, res)
        })

        return Promise.resolve()
    })
}

function create(app: { on: Function }, ipcMain: { on: Function })
{
    return new Server(new Transport(app, ipcMain), new Router())
}

export default { create }
