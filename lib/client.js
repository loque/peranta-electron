'use strict'

const Client = require('peranta/lib/client')

function Transport(ipcRenderer)
{
    if (
        ipcRenderer === undefined
        || typeof ipcRenderer !== 'object'
    ) throw new TypeError(`Transport.constructor() expects to receive ipcRenderer`)

    if (typeof ipcRenderer.on !== 'function') throw new TypeError(`Transport.constructor() expects ipcRenderer.on() to be a function`)

    if (typeof ipcRenderer.send !== 'function') throw new TypeError(`Transport.constructor() expects ipcRenderer.send() to be a function`)

    this.ipcRenderer = ipcRenderer
}

Transport.prototype.on = function on(channel, callback)
{
    this.ipcRenderer.on(channel, callback)
}

Transport.prototype.emit = function emit(channel, req)
{
    this.ipcRenderer.send(channel, req)
}

function create(ipcRenderer)
{
    return new Client(new Transport(ipcRenderer))
}

module.exports = { create }
