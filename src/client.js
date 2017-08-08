// @flow

'use strict'

import Client from 'peranta/client'

function Transport(ipcRenderer: { on: Function, send: Function })
{
    if (
        ipcRenderer === undefined
        || typeof ipcRenderer !== 'object'
    ) throw new TypeError('Transport.constructor() expects to receive ipcRenderer')

    if (typeof ipcRenderer.on !== 'function') throw new TypeError('Transport.constructor() expects ipcRenderer.on() to be a function')

    if (typeof ipcRenderer.send !== 'function') throw new TypeError('Transport.constructor() expects ipcRenderer.send() to be a function')

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

function create(ipcRenderer: { on: Function, send: Function })
{
    return new Client(new Transport(ipcRenderer))
}

export default { create }
