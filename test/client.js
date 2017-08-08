'use strict'

const expect = require('chai').expect
// const Client = require('../src/client')
const Client = require('../dist/client')

describe('Client', () =>
{
    it('should throw if no ipcRenderer was sent', () =>
    {
        expect(() => { Client.create() }).to.throw(`Transport.constructor() expects to receive ipcRenderer`)
    })

    it('should throw if ipcRenderer does not implement .on()', () =>
    {
        const ipcRenderer = { send: (a, b) => {} }
        expect(() => { Client.create(ipcRenderer) }).to.throw(`Transport.constructor() expects ipcRenderer.on() to be a function`)
    })

    it('should throw if ipcRenderer does not implement .send()', () =>
    {
        const ipcRenderer = { on: (a, b) => {} }
        expect(() => { Client.create(ipcRenderer) }).to.throw(`Transport.constructor() expects ipcRenderer.send() to be a function`)
    })
})
