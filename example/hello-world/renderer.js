const { ipcRenderer } = require('electron')
const client = require('peranta-electron/client').create(ipcRenderer)

client.get('/hello/Jake')
.then(res =>
{
    console.log(`[GET] /hello/Jake =>`, res.body)
})
.catch(error =>
{
    console.error(`[GET] /hello/Jake =>`, error)
})

client.post('/users', { name: 'Jake' })
.then(res =>
{
    console.log(`[POST] /users =>`, res.body)
})
.catch(error =>
{
    console.error(`[POST] /users =>`, error)
})

client.on('users-updated', res =>
{
    console.log(`[EVENT] users-updated`, res.body)
})
