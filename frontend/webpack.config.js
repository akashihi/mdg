const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const TerserPlugin = require('terser-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const WebpackFilesArchivePlugin = require('webpack-files-archive-plugin');
const { merge } = require('webpack-merge');
const webpackDashboard = require('webpack-dashboard/plugin');

const build = {
    context: path.resolve(__dirname, 'src'), // `__dirname` is root of project and `src` is source
    entry: {
        app: ['./js/app.tsx']
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: 'index.html'
        }),
        new CopyWebpackPlugin({
            patterns: [
                {from: 'css', to: 'css'}
            ]
        }),
        new webpackDashboard()
    ],
    output: {
        path: path.resolve(__dirname, 'dist'), // `dist` is the destination
        filename: 'bundle.[contenthash].js',
        clean: true
    },
    module: {
        rules: [
            {
                test: /\.ts(x*)$/, // Check for all js files
                exclude: /node_modules/,
                use: [{
                    loader: 'ts-loader'
                }]
            },
            {
                test: /\.js$/, // Check for all js files
                exclude: /node_modules/,
                use: [{
                    loader: 'babel-loader'
                }]
            },
            {
                test: /\.css$/,
                include: /node_modules/,
                use: [
                    {loader: 'style-loader'},
                    {loader: 'css-loader'}
                ]
            }
        ]
    },
    resolve: {
        extensions: ['.tsx', '.ts', '.js'],
    },
};

const development = {
    mode: 'development',
    devtool: 'inline-source-map',
    devServer: {
        static: path.resolve(__dirname, 'src'), // `__dirname` is root of the project
        historyApiFallback: true,
        proxy: {
            '/api/categories': {
                target: 'http://127.0.0.1:8080/',
                pathRewrite: {'^/api' : ''}
            },
            '/api/currencies': {
                target: 'http://127.0.0.1:8080/',
                pathRewrite: {'^/api' : ''}
            },
            '/api/settings': {
                target: 'http://127.0.0.1:8080/',
                pathRewrite: {'^/api' : ''}
            },
            '/api/**': {
                target: 'http://127.0.0.1/api',
                pathRewrite: {'^/api' : ''}
            }
        }
    },
};

const production = {
    mode: 'production',
    plugins: [
        new WebpackFilesArchivePlugin()
    ],
    optimization: {
        minimize: true,
        minimizer: [new TerserPlugin()],
    },
};
let config;
if (process.env.NODE_ENV === 'production') {
    config = merge(build, production);
} else {
    config = merge(build, development);
}

module.exports = config;
