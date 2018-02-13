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

const devConfig = Object.create( WEBPACK_CONFIG );
devConfig.plugins = devConfig.plugins.concat(
    new webpack.DefinePlugin( {
        VERSION: JSON.stringify( PACKAGE_JSON.version ),
        OAUTH_URL: JSON.stringify( '' )
    } )
);

// register tasks
gulp.task( 'connector:js', callback => {
    const compiler = webpack( devConfig );
    // Run webpack
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
} );

gulp.task( 'connector:js:watch', callback => {
    const compiler = webpack( devConfig );
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
    const config = Object.create( WEBPACK_CONFIG );

    config.output.filename = '[name].bundle.min.js';
    config.output.path = DIST_OUTPUT_FOLDER;

    let uglifyConfig = {
        compress: {
            drop_console: true
        }
    };

    config.plugins = config.plugins.concat(
        new UglifyJsPlugin( { uglifyOptions: uglifyConfig } ),
        new webpack.DefinePlugin( {
            VERSION: JSON.stringify( PACKAGE_JSON.version ),
            OAUTH_URL: JSON.stringify( '' )
        } )
    );
    webpack( config, ( err, stats ) => {
        if ( err ) {
            throw new gutil.PluginError( `[${TAG}]`, err );
        }

        gutil.log( `[${TAG}~webpack]`, stats.toString( 'minimal' ) );

        callback();
    } );
} );

gulp.task( 'connector:clean:dist', () => del( path.resolve( DIST_FOLDER, '**' ), { force: true } ) );