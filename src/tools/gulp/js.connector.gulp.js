const TAG = 'OIDC-Connector';

const webpack = require( 'webpack' );

const gulp = require( 'gulp' );
const gutil = require( 'gulp-util' );
const path = require( 'path' );
const del = require( 'del' );

const WEBPACK_CONFIG = require( '../config/webpack.config' );

const ROOT = path.resolve( __dirname, '../../../' );
const DIST_FOLDER = path.resolve( ROOT, 'dist' );
const DIST_OUTPUT_FOLDER = path.resolve( DIST_FOLDER, 'js' );

// init webpack compiler
const compiler = webpack( WEBPACK_CONFIG );

// register tasks
gulp.task( 'connector:js', callback => {
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
        mangle: false,
        // beautify: true,
        comments: false,
        compress: true,
        sourceMap: false
    };

    config.plugins = config.plugins.concat(
        new webpack.optimize.UglifyJsPlugin( uglifyConfig )
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