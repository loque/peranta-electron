'use strict'

const Server = require('peranta/server')
const Router = require('peranta/router')
const Scheduler = require('./scheduler')

function Transport(app, ipcMain)
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
        webContents.on('did-finish-load', () =>
        {
            this.webContents.push(webContents)
            this.broadcastScheduler.start()
        })
    })
}

Transport.prototype.on = function on(channel, callback)
{
    this.ipcMain.on(channel, (event, req) => callback(event, req))
}

Transport.prototype.broadcast = function broadcast(channel, res)
{
    this.broadcastScheduler.push(() =>
    {
        this.webContents.forEach(webcontent =>
        {
            webcontent.send(channel, res)
        })

        return Promise.resolve()
    })
}

function create(app, ipcMain)
{
    return new Server(new Transport(app, ipcMain), new Router())
}

module.exports = { create }
