const TAG = 'OIDC-Connector';

const webpack = require( 'webpack' );

const log = require('fancy-log');
const PluginError = require('plugin-error');
const path = require( 'path' );
const TerserPlugin = require( 'terser-webpack-plugin' );

const WEBPACK_CONFIG = require( '../config/webpack.config.js' );
const ROOT = path.resolve( __dirname, '../../../' );

const DIST_FOLDER = path.resolve( ROOT, 'dist' );
const DIST_OUTPUT_FOLDER = path.resolve( DIST_FOLDER, 'js' );
const PACKAGE_JSON = require( path.resolve( ROOT, 'package.json' ) );

const serverCommon = require( '../server/server.common' );

const self = this;


module.exports.getDevConfig = function() {
    const devConfig = WEBPACK_CONFIG;
    devConfig.plugins = devConfig.plugins.concat(
        new webpack.DefinePlugin( {
            VERSION: JSON.stringify( PACKAGE_JSON.version ),
            OIDC_URL: JSON.stringify( '' )
        } )
    );

    return devConfig;
};

module.exports.getDistConfig = function( environment ) {
    const distConfig = Object.assign({}, WEBPACK_CONFIG);
    const env = process.env.NODE_ENV || 'dev';

    distConfig.output.filename = '[name].bundle.min.js';
    distConfig.output.path = DIST_OUTPUT_FOLDER;
    distConfig.mode = 'production';

    let terserConfig = {
        compress: {
            drop_console: env !== 'dev'
        }
    };

    const jsonConfig = serverCommon.getConfigJson();

    let oidcUrl = '';
    if ( jsonConfig.environments && jsonConfig.environments[environment] ) {
        oidcUrl = jsonConfig.environments[environment];
        console.log( 'Building Package for', environment, oidcUrl );
    }

    distConfig.plugins = distConfig.plugins.concat(
        new TerserPlugin( { terserOptions: terserConfig } ),
        new webpack.DefinePlugin( {
            VERSION: JSON.stringify( PACKAGE_JSON.version ),
            OIDC_URL: JSON.stringify( oidcUrl )
        } )
    );
    return distConfig;
};

module.exports.runWebPack = function( compiler, callback ) {
    compiler.run( ( err, stats ) => {
        if ( err ) {
            log.error(`[${TAG}~error]`, new PluginError(`[${TAG}]`, err));
            return;
        }

        log(`[${TAG}~webpack]`, stats.toString( 'minimal' ));

        if ( callback ) {
            callback();
        }
    } );
};

module.exports.buildJS = function( environment, callback ) {
    const config = self.getDistConfig( environment );
    const compiler = webpack( config );
    self.runWebPack( compiler, callback );
};