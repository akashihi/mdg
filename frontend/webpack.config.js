const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const TerserPlugin = require('terser-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const ArchivePlugin = require('webpack-archive-plugin');
const merge = require('webpack-merge');

const build = {
    context: path.resolve(__dirname, 'src'), // `__dirname` is root of project and `src` is source
    entry: {
        app: ['./js/app.js']
    },
    plugins: [
        new CleanWebpackPlugin(),
        new HtmlWebpackPlugin({
            template: 'index.html'
        }),
        new CopyWebpackPlugin([{from: 'css', to: 'css'}], {})
    ],
    output: {
        path: path.resolve(__dirname, 'dist'), // `dist` is the destination
        filename: 'bundle.[hash].js'
    },
    module: {
        rules: [
            {
                enforce: 'pre',
                test: /\.js$/,
                exclude: /node_modules/,
                loader: 'eslint-loader',
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
                loaders: ['style-loader', 'css-loader'],
            }
        ]
    }
};

const development = {
    mode: 'development',
    devtool: 'eval-source-map',
    devServer: {
        contentBase: path.resolve(__dirname, 'src'), // `__dirname` is root of the project
        watchContentBase: true,
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
    config = merge(build, production)
} else {
    config = merge(build, development)
}

module.exports = config;
