'use strict'

const expect = require('chai').expect
// const Server = require('../src/server')
const Server = require('../dist/server')
const { app, ipcMain } = require('electron')

describe('Server', () =>
{
    it('should throw if app was not sent', () =>
{
        expect(() => { Server.create(undefined, ipcMain) }).to.throw(`Transport.constructor() expects to receive Electron's app as the first argument`)
    })

    it('should throw if app does not implement .on()', () =>
{
        expect(() => { Server.create({}, ipcMain) }).to.throw(`Transport.constructor() expects Electron's app to implement .on()`)
    })

    it('should throw if ipcMain was not sent', () =>
{
        expect(() => { Server.create(app) }).to.throw(`Transport.constructor() expects to receive Electron's ipcMain as the second argument`)
    })

    it('should throw if ipcMain does not implement .on()', () =>
{
        expect(() => { Server.create(app, {}) }).to.throw(`Transport.constructor() expects Electron's ipcMain to implement .on()`)
    })
})
