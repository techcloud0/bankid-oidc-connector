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
        rules: [
            {
                test: /\.js$/,
                exclude: /(bower_components|\.polyfill)/,
                loader: 'babel-loader',
                query: {
                    presets: ['@babel/preset-env'],
                    plugins: ['transform-object-assign']
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
    },
    mode: 'development'
};