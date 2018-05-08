const TAG = 'OIDC-Connector';

const webpack = require( 'webpack' );

const gulp = require( 'gulp' );
const gutil = require( 'gulp-util' );
const path = require( 'path' );
const del = require( 'del' );
const UglifyJsPlugin = require( 'uglifyjs-webpack-plugin' );

const WEBPACK_CONFIG = require( '../config/webpack.config' );
const ROOT = path.resolve( __dirname, '../../../' );

const DIST_FOLDER = path.resolve( ROOT, 'dist' );
const DIST_OUTPUT_FOLDER = path.resolve( DIST_FOLDER, 'js' );
const PACKAGE_JSON = require( path.resolve( ROOT, 'package.json' ) );

const serverCommon = require( '../server/server.common' );

function getDevConfig() {
    const devConfig = Object.create( WEBPACK_CONFIG );
    devConfig.plugins = devConfig.plugins.concat(
        new webpack.DefinePlugin( {
            VERSION: JSON.stringify( PACKAGE_JSON.version ),
            OIDC_URL: JSON.stringify( '' )
        } )
    );
    return devConfig;
}


function getDistConfig( type ) {
    const distConfig = Object.create( WEBPACK_CONFIG );

    distConfig.output.filename = '[name].bundle.min.js';
    distConfig.output.path = DIST_OUTPUT_FOLDER;

    let uglifyConfig = {
        compress: {
            drop_console: true
        }
    };

    const jsonConfig = serverCommon.getConfigJson();

    let oauthUrl = '';
    if ( jsonConfig[type] ) {
        oauthUrl = jsonConfig[type];
    }

    distConfig.plugins = distConfig.plugins.concat(
        new UglifyJsPlugin( { uglifyOptions: uglifyConfig } ),
        new webpack.DefinePlugin( {
            VERSION: JSON.stringify( PACKAGE_JSON.version ),
            OIDC_URL: JSON.stringify( oauthUrl )
        } )
    );
    return distConfig;
}

function runWebPack( compiler, callback ) {
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
}

// register tasks
gulp.task( 'connector:js', callback => {
    const compiler = webpack( getDevConfig() );
    runWebPack( compiler, callback );
} );

gulp.task( 'connector:js:watch', () => {
    const compiler = webpack( getDevConfig() );
    compiler.watch( {
        aggregateTimeout: 300
    }, ( err, stats ) => {
        if ( err ) {
            gutil.log( `[${TAG}~error]`, new gutil.PluginError( `[${TAG}]`, err ) );
            return;
        }

        gutil.log( `[${TAG}~webpack]`, stats.toString( 'minimal' ) );
    } );
} );

gulp.task( 'connector:js:dist', callback => {
    const compiler = webpack( getDistConfig() );
    runWebPack( compiler, callback );
} );

gulp.task( 'connector:js:dist:prod', callback => {
    const compiler = webpack( getDistConfig( 'prod-oidc-url' ) );
    runWebPack( compiler, callback );
} );

gulp.task( 'connector:js:dist:preprod', callback => {
    const compiler = webpack( getDistConfig( 'preprod-oidc-url' ) );
    runWebPack( compiler, callback );
} );

gulp.task( 'connector:clean:dist', () => del( path.resolve( DIST_FOLDER, '**' ), { force: true } ) );