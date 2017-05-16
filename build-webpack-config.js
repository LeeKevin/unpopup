const path = require('path')
const url = require('url')
const webpack = require('webpack')
const autoprefixer = require('autoprefixer')

module.exports = function (options) {
    const entry = {
        unpopup: ['./src/index.js'],
    }

    const output = {
        path: path.join(__dirname, 'dist'),
        publicPath: '/',
        filename: '[name].js',
    }

    const loaders = []

    const postcss = function () {
        return [autoprefixer]
    }

    const plugins = []

    const babelLoader = {
        test: /\.js$/,
        exclude: [/node_modules/],
        loader: 'babel',
        query: {
            cacheDirectory: true,
            presets: ['es2015', 'stage-2'],
            plugins: [
                'add-module-exports',
            ],
        },
    }

    const environment = {}


    if (options.minimize) {
        plugins.push(
            new webpack.optimize.UglifyJsPlugin({
                compressor: {
                    warnings: false,
                    dead_code: true, // big one--strip code that will never execute
                    unused: true,
                    drop_debugger: true,
                    conditionals: true,
                    evaluate: true,
                    drop_console: true, // strips console statements
                    sequences: true,
                    booleans: true,
                },
            }),
            new webpack.optimize.DedupePlugin(),
            new webpack.NoErrorsPlugin()
        )

        environment.NODE_ENV = JSON.stringify('production')
    } else {
        if (options.sourcemap) {
            plugins.push(new webpack.SourceMapDevToolPlugin({
                // asset matching
                filename: '[file].map',
                exclude: [/node_modules/],

                // quality/performance
                module: true,
                columns: true,
            }))
        }
    }

    // scss modules
    loaders.push({
        test: /\.scss$/,
        exclude: /[\/\\](node_modules\/)[\/\\]/,
        loaders: [
            `style`,
            `css?importLoaders=1${options.sourcemap ?
                '&sourceMap' :
                ''}&localIdentName=[name]__[local]___[hash:base64:5]`,
            'postcss',
            `sass?${options.sourcemap ? 'sourceMap' : ''}`,
        ],
    })

    loaders.push(babelLoader)
    plugins.push(new webpack.DefinePlugin({
        'process.env': environment,
    }))

    return {
        cache: true,
        entry,
        output,
        debug: options.debug,
        module: {
            loaders,
        },
        postcss,
        plugins,
    }
}
