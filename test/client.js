'use strict'

const expect = require('chai').expect
const Client = require('../client')

describe('Client', function()
{
    it('should throw if no ipcRenderer was sent', function()
    {
        expect(function(){ const client = Client.create() }).to.throw(`Transport.constructor() expects to receive ipcRenderer`)
    })

    it('should throw if ipcRenderer does not implement .on()', function()
    {
        const ipcRenderer = { send: (a,b) => {} }
        expect(function(){ const client = Client.create(ipcRenderer) }).to.throw(`Transport.constructor() expects ipcRenderer.on() to be a function`)
    })

    it('should throw if ipcRenderer does not implement .send()', function()
    {
        const ipcRenderer = { on: (a,b) => {} }
        expect(function(){ const client = Client.create(ipcRenderer) }).to.throw(`Transport.constructor() expects ipcRenderer.send() to be a function`)
    })
})
