const webpack = require('webpack');
const path = require('path');

module.exports = {
    mode: process.env.NODE_ENV || 'none',
    entry: [
        '@babel/polyfill',
        './src/index.js'
    ],
    output: {
        path: path.join(__dirname, './dist'),
        filename: 'bundle.js',
        publicPath: path.join(__dirname, './public'),
    },
    resolve: {
        extensions: ['.js', '.jsx', '.yaml', '.md']
    },
    resolveLoader: {
        alias: { }
    },
    optimization: {
        minimize: false
    },
    module: {
        rules: [{
            test: /\.(js|jsx)?$/,
            include: /src/,
            exclude: /node_modules/,
            use: [{
                loader: 'babel-loader',
                options: {
                    presets: ['@babel/preset-react', '@babel/preset-env', ['minify', {
                        mangle: false
                    }]],
                    plugins: [
                        '@babel/plugin-proposal-class-properties',
                        '@babel/plugin-proposal-object-rest-spread'
                    ],
                    rootMode: 'upward',
                }
            }, {
                loader: 'eslint-loader',
                options: {
                    babelPath: require.resolve('eslint'),
                    configFile: '.eslintrc.yml'
                }
            }]
        }, {
            test: /\.md?$/,
            use: [{
                loader: 'raw-loader'
            }]
        }, {
            test: /\.yaml?$/,
            use: [{
                loader: 'yml-loader'
            }]
        }, {
            test: /\.css$/,
            use: [
                'style-loader',
                'css-loader',
            ]
        }, {
            test: /\.scss$/,
            use: [
                'style-loader',
                'css-loader',
                'sass-loader'
            ]
        }]
    },
    plugins: [
        new webpack.DefinePlugin({
            'process.env': {
                NODE_ENV: `"${process.env.NODE_ENV}"`
            }
        })
    ]
};
