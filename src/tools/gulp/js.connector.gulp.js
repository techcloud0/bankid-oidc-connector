const TAG = 'OIDC-Connector';

const webpack = require( 'webpack' );

const gulp = require( 'gulp' );
const gutil = require( 'gulp-util' );
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

gulp.task( 'connector:js:watch', () => {
    const compiler = webpack( jsBuilderHelper.getDevConfig() );
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

gulp.task( 'connector:js:dist', jsBuilderHelper.buildJS );

gulp.task( 'connector:js:dist:release', jsBuilderHelper.buildJS.bind( null, 'SYSTEMTEST' ) );

gulp.task( 'connector:clean:dist', () => del( path.resolve( DIST_FOLDER, '**' ), { force: true } ) );