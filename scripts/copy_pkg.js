const PACKAGE = require('../package.json')
const fs = require('fs')
const path = require('path')

delete PACKAGE.scripts

// dir ../dist should already exist!

fs.writeFileSync(getRelative('../dist/package.json'), JSON.stringify(PACKAGE, null, 2))
fs.writeFileSync(getRelative('../dist/LICENSE'), fs.readFileSync(getRelative('../LICENSE')).toString())
fs.writeFileSync(getRelative('../dist/README.md'), fs.readFileSync(getRelative('../README.md')).toString())
fs.writeFileSync(getRelative('../dist/.gitignore'), fs.readFileSync(getRelative('../.gitignore')).toString())

function getRelative(relativePath)
{
    return path.join(__dirname, relativePath)
}
