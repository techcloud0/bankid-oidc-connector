const TAG = 'OIDC-Connector';

const webpack = require( 'webpack' );

const gulp = require( 'gulp' );
const gutil = require( 'gulp-util' );

const WEBPACK_CONFIG = require( '../config/webpack.config' );

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