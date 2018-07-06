const gulp = require( 'gulp' );
const path = require( 'upath' );

const ROOT = path.resolve( __dirname, '../../../' );
const DIST_FOLDER = path.resolve( ROOT, 'dist' );

gulp.task( 'connector:docs:dist', ( cb ) => {
    gulp.src( [
        path.resolve( ROOT, 'README.md' ),
        path.resolve( ROOT, 'RELEASE-NOTES.md' ),
        path.resolve( ROOT, 'CHANGELOG.md' )
    ] ).pipe( gulp.dest( DIST_FOLDER ) );
    cb();
} );