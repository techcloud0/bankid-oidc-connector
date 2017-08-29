const webpack = require( 'webpack' );
const path = require( 'path' );

const ROOT = path.resolve( __dirname, '../../../' );
const SRC_FOLDER = path.resolve( ROOT, 'src/main/js/' );
const DEV_OUTPUT_FOLDER = path.resolve( ROOT, 'src/main/public/js/' );

module.exports = {
    entry: {
        'connector': path.resolve( SRC_FOLDER, 'oidc-connector.js' ),
    },
    output: {
        path: DEV_OUTPUT_FOLDER,
        filename: '[name].bundle.js',
    },
    module: {
        loaders: [
            {
                test: /\.js$/,
                exclude: /(bower_components|\.polyfill)/,
                loader: 'babel-loader',
                query: {
                    presets: ['es2015'],
                    plugins: ['transform-object-assign']
                }
            },
            {
                test: /\.js$/,
                include: /(\.polyfill\.js)/,
                loader: 'babel-loader',
                query: {
                    presets: ['es2015']
                }
            },
            {
                test: /\.html$/,
                loader: 'html-loader',
                options: {
                    minimize: true,
                    removeComments: true,
                    exportAsEs6Default: true
                }
            }
        ]
    },
    resolveLoader: {
        alias: {}
    },
    plugins: [
        new webpack.IgnorePlugin( /vertx/ ),
    ],
    devtool: 'source-map',
    context: __dirname,
    node: {
        __filename: true
    }
};