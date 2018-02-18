const gulp = require( 'gulp' );
const runSequence = require( 'run-sequence' );

gulp.task( 'connector:dist:package', ( cb ) => {
    runSequence( 'connector:clean:dist', ['connector:js:dist:prod', 'connector:docs:dist'], cb );
} );

gulp.task( 'connector:dist:package:preprod', ( cb ) => {
    runSequence( 'connector:clean:dist', ['connector:js:dist:preprod', 'connector:docs:dist'], cb );
} );