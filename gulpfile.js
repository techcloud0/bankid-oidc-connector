const gulp = require( 'gulp' );

const path = require( 'upath' );
const requireDir = require( 'require-dir-all' );
const FwdRef = require( 'undertaker-forward-reference' );

// To allow forward referencing
gulp.registry( FwdRef() );

requireDir( path.resolve( __dirname, 'src/tools/gulp' ), {
    recurse: true,
    includeFiles: /\.gulp\.js$/
} );

const devTasks = gulp.series( 'connector:js:watch', 'connector:server' );

gulp.task( 'default', devTasks );
gulp.task( 'connector', gulp.series( 'connector:js' ) );
gulp.task( 'connector:dist', gulp.series( 'connector:clean:dist', gulp.parallel( 'connector:js:dist', 'connector:docs:dist' ) ) );
gulp.task( 'connector:dev', devTasks );
