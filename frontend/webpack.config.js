var webpack = require('webpack');

var config = {
    context: __dirname + '/src', // `__dirname` is root of project and `src` is source
    entry: {
        app: ['babel-polyfill', './js/app.js']
    },
    output: {
        path: __dirname + '/dist', // `dist` is the destination
        filename: 'bundle.js'
    },
    devServer: {
        contentBase: __dirname + '/src', // `__dirname` is root of the project
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
                loader: 'style-loader!css-loader?modules',
                include: /flexboxgrid/
            }
        ]
    },
    devtool: "eval-source-map"
};

if (process.env.NODE_ENV === "production") {
    config.devtool = "";
}

module.exports = config;
