const webpack = require('webpack')
const PROD = JSON.parse(process.env.PROD_ENV || '0')

module.exports = {
     entry: {
         client: './src/client.js',
     },
     output: {
         path: './dist',
         filename: '[name].js',
		 library: 'PerantaElectron',
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
     plugins: PROD ? [
         new webpack.optimize.UglifyJsPlugin({
             compress: {
                 warnings: false,
             },
             output: {
                 comments: false,
             },
         }),
     ] : [],
 }
