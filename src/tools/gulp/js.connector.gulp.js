const TAG = 'OIDC-Connector';

const webpack = require( 'webpack' );

const gulp = require( 'gulp' );
const log = require('fancy-log');
const PluginError = require('plugin-error');
const path = require( 'path' );
const del = require( 'del' );

const ROOT = path.resolve( __dirname, '../../../' );

const DIST_FOLDER = path.resolve( ROOT, 'dist' );

const jsBuilderHelper = require( '../helpers/js.builder-helper' );

// register tasks
gulp.task( 'connector:js', callback => {
    const compiler = webpack( jsBuilderHelper.getDevConfig() );
    jsBuilderHelper.runWebPack( compiler, callback );
} );

gulp.task( 'connector:js:watch', callback => {
    const compiler = webpack( jsBuilderHelper.getDevConfig() );
    compiler.watch( {
        aggregateTimeout: 300
    }, ( err, stats ) => {
        if ( err ) {
            log.error( `[${TAG}~error]`, new PluginError( `[${TAG}]`, err ) );
            callback();
            return;
        }

        log( `[${TAG}~webpack]`, stats.toString( 'minimal' ) );
        callback();
    } );
} );

gulp.task( 'connector:js:dist', ( callback ) => { jsBuilderHelper.buildJS( null, callback ); } );
gulp.task( 'connector:js:dist:release', ( callback ) => { jsBuilderHelper.buildJS( 'SYSTEMTEST', callback ); } );
gulp.task( 'connector:clean:dist', () => del( path.resolve( DIST_FOLDER, '**' ), { force: true } ) );