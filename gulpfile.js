const gulp = require( 'gulp' );

const path = require( 'upath' );
const requireDir = require( 'require-dir-all' );
const runSequence = require( 'run-sequence' );

requireDir( path.resolve( __dirname, 'src/tools/gulp' ), {
    recurse: true,
    includeFiles: /\.gulp\.js$/
} );

gulp.task( 'connector', ['connector:js:watch'] );

gulp.task( 'connector:dist', ( cb ) => {
    runSequence( 'connector:clean:dist', ['connector:js:dist'], cb );
} );

gulp.task( 'connector:test', ['connector:test:unit'] );

gulp.task( 'connector:dev', ['connector', 'connector:server'] );
