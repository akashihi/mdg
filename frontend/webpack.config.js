const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const TerserPlugin = require('terser-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const ArchivePlugin = require('webpack-archive-plugin');
const { merge } = require('webpack-merge');

const build = {
    context: path.resolve(__dirname, 'src'), // `__dirname` is root of project and `src` is source
    entry: {
        app: ['./js/app.js']
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: 'index.html'
        }),
        new CopyWebpackPlugin({
            patterns: [
                {from: 'css', to: 'css'}
            ]
        })
    ],
    output: {
        path: path.resolve(__dirname, 'dist'), // `dist` is the destination
        filename: 'bundle.[contenthash].js',
        clean: true
    },
    module: {
        rules: [
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
    }
};

const development = {
    mode: 'development',
    devtool: 'eval-source-map',
    devServer: {
        static: path.resolve(__dirname, 'src'), // `__dirname` is root of the project
        historyApiFallback: true,
        proxy: {
            '/api': {
                target: 'http://127.0.0.1/api',
                pathRewrite: {'^/api' : ''}
            }
        }
    },
};

const production = {
    mode: 'production',
    devtool: 'none',
    plugins: [
        new TerserPlugin(),
        new ArchivePlugin()
    ]
};
let config;
if (process.env.NODE_ENV === 'production') {
    config = merge(build, production);
} else {
    config = merge(build, development);
}

module.exports = config;
