const TAG = 'OIDC-Connector';

const webpack = require( 'webpack' );

const gutil = require( 'gulp-util' );
const path = require( 'path' );
const UglifyJsPlugin = require( 'uglifyjs-webpack-plugin' );

const WEBPACK_CONFIG = require( '../config/webpack.config' );
const ROOT = path.resolve( __dirname, '../../../' );

const DIST_FOLDER = path.resolve( ROOT, 'dist' );
const DIST_OUTPUT_FOLDER = path.resolve( DIST_FOLDER, 'js' );
const PACKAGE_JSON = require( path.resolve( ROOT, 'package.json' ) );

const serverCommon = require( '../server/server.common' );

const self = this;


module.exports.getDevConfig = function() {
    const devConfig = Object.create( WEBPACK_CONFIG );
    devConfig.plugins = devConfig.plugins.concat(
        new webpack.DefinePlugin( {
            VERSION: JSON.stringify( PACKAGE_JSON.version ),
            OIDC_URL: JSON.stringify( '' )
        } )
    );
    return devConfig;
};

module.exports.getDistConfig = function( environment ) {
    const distConfig = Object.create( WEBPACK_CONFIG );
    const env = process.env.NODE_ENV || 'dev';

    distConfig.output.filename = '[name].bundle.min.js';
    distConfig.output.path = DIST_OUTPUT_FOLDER;

    let uglifyConfig = {
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
        new UglifyJsPlugin( { uglifyOptions: uglifyConfig } ),
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
            gutil.log( `[${TAG}~error]`, new gutil.PluginError( `[${TAG}]`, err ) );
            return;
        }

        gutil.log( `[${TAG}~webpack]`, stats.toString( 'minimal' ) );

        if ( callback ) {
            callback();
        }
    } );
};

module.exports.buildJS = function( environment, callback ) {
    const compiler = webpack( self.getDistConfig( environment ) );
    self.runWebPack( compiler, callback );
};