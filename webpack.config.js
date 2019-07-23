const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
    entry: ['babel-polyfill', './src/js/index.js'], // that is our entry point
    output: {
        path: path.resolve(__dirname, 'dist'), // where to save the bundle file, dirname = forkify-app folder
        filename: 'js/bundle.js'
    },
    devServer: {
        contentBase: './dist'
    },
    plugins: [
        new HtmlWebpackPlugin({
            filename: 'index.html',
            template: './src/index.html' // template is basically our starting html file
        })
    ],
    module: {
        rules: [
            {
                test: /\.js$/, // that regex look for all of the files ans test if they end in .js
                exclude: /node_modules/, // exclude this entire folder beacuse we dont want Babel to apply to all of the thousands of js files.
                use: {
                    loader: 'babel-loader'
                }
            }
        ]
    }
};
