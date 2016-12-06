const webpack = require('webpack')

module.exports = {
     entry: {
         server: './src/server.js',
         client: './src/client.js',
     },
     output: {
         path: './',
         filename: '[name].js',
         libraryTarget: 'umd',
     },
     module: {
         loaders: [{
             test: /\.js$/,
             exclude: /node_modules/,
             loader: 'babel-loader',
         }]
     },
     externals: {
         'peranta/server': 'peranta/server',
         'peranta/router': 'peranta/router',
         'peranta/client': 'peranta/client',
     },
 }
