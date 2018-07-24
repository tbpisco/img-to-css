const path = require('path');
const babiliPlugin = require('babili-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const extractTextPlugin = require('extract-text-webpack-plugin');
const optimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const webpack = require('webpack');
const HtmlWepackPlugin = require('html-webpack-plugin');
const ImageminPlugin = require('imagemin-webpack-plugin').default;
const CopyWebpackPlugin = require('copy-webpack-plugin');

let plugins = [];

plugins.push(new HtmlWepackPlugin({

    hash: true,
    minify: {
        html5: true, 
        collapseWhitespace: true, 
        removeComments: true
    },
    filename: 'index.html',
    template: __dirname + '/src/main.html'

}));
plugins.push(new extractTextPlugin('css/styles.css'));

plugins.push(new CopyWebpackPlugin([{
    from: 'src/imgs/', to: 'imgs/'
}]));

plugins.push(new webpack.optimize.CommonsChunkPlugin({

    name: 'vendor', 
    filename: 'js/vendor.bundle.js'

}));

//let SERVICE_URL = JSON.stringify('http://localhost:3000');

if(process.env.NODE_ENV == 'production') {

    //SERVICE_URL = JSON.stringify('/img-to-css.herokuapp.com');

    plugins.push(new CleanWebpackPlugin([
        './build/**/*.*'
    ]));

    plugins.push(new webpack.optimize.ModuleConcatenationPlugin());

    plugins.push(new babiliPlugin());

    plugins.push(new optimizeCSSAssetsPlugin({
        cssProcessor: require('cssnano'),
        cssProcessorOptions: {
            discardComments: {
                removeAll: true
            }
        },
        canPrint: true
    }));
    
    plugins.push(new ImageminPlugin({ test: /\.(jpe?g|png|gif|svg)$/i }));
}

//plugins.push(new webpack.DefinePlugin({ SERVICE_URL }));

module.exports = {
    entry: {
        app: './src/app/app.js',
        vendor: ['babel-polyfill', 'reflect-metadata']
    },
    output: {
        filename: 'js/[name].js',
        path: path.resolve(__dirname, 'build')
    },
    module: {
        rules: [
            {
                test: /\.js$/,
                exclude: /node_modules/,
                use : { 
                    loader: 'babel-loader'
                }
            },
            {
                test: /\.css$/,
                use: extractTextPlugin.extract({
                    fallback: 'style-loader', 
                    use: 'css-loader'
                })

            },
            {
                test: /\.scss$/,
                use: [
                    "style-loader", 
                    "css-loader", 
                    "sass-loader"
                ]
            },
            { 
                test: /\.(woff|woff2)(\?v=\d+\.\d+\.\d+)?$/, 
                loader: 'url-loader?limit=10000&mimetype=application/font-woff&name=/fonts/[name].[ext]' 
            },
            { 
                test: /\.ttf(\?v=\d+\.\d+\.\d+)?$/, 
                loader: 'url-loader?limit=10000&mimetype=application/octet-stream&name=/fonts/[name].[ext]'
            },
            { 
                test: /\.eot(\?v=\d+\.\d+\.\d+)?$/, 
                loader: 'file-loader?outputPath=/fonts/' 
            },
            { 
                test: /\.svg(\?v=\d+\.\d+\.\d+)?$/, 
                loader: 'url-loader?limit=10000&mimetype=image/svg+xml&name=/fonts/[name].[ext]' 
            }             
        ]
    }, 
    plugins
}