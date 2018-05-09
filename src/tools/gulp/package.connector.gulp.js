const fs = require( 'fs' );
const del = require( 'del' );
const path = require( 'path' );
const gulp = require( 'gulp' );

const runSequence = require( 'run-sequence' );
const maven = require( 'maven-deploy' );
const serverCommon = require( '../server/server.common' );
const jsBuilderHelper = require( '../helpers/js.builder-helper' );

const CONFIG = serverCommon.getConfigJson();

const ROOT = path.resolve( __dirname, '../../../' );
const MAVEN_CONFIG = path.resolve( ROOT, './maven-config.json' );


gulp.task( 'connector:dist:package', ( cb ) => {
    runSequence( 'connector:clean:dist', ['connector:js:dist', 'connector:docs:dist'], cb );
} );

gulp.task( 'connector:dist:package:release', ( cb ) => {
    runSequence( 'connector:clean:dist', ['connector:js:dist:release', 'connector:docs:dist'], cb );
} );

if ( CONFIG && CONFIG.environments && fs.existsSync( MAVEN_CONFIG ) ) {
    Object.keys( CONFIG.environments ).forEach( ( environment ) => {
        const maven_config = require( MAVEN_CONFIG );
        const originalPackageName = maven_config.finalName;

        gulp.task( `connector:dist:package:${environment}`, ( cb ) => {
            jsBuilderHelper.buildJS( environment, () => {
                maven_config.finalName = `${originalPackageName}-${environment}`;
                maven.config( maven_config );
                maven.package();
                gulp.src( path.resolve( ROOT, './dist/*.jar' ) )
                    .pipe( gulp.dest( ROOT ) );
                del( path.resolve( ROOT, './dist/*.jar' ) );
                return cb();
            } );
        } );
    } );

    gulp.task( 'connector:dist:package:all', ['connector:clean:dist'], ( cb ) => {
        runSequence( 'connector:docs:dist', ...Object.keys( CONFIG.environments ).map( ( environment ) => {
            return `connector:dist:package:${environment}`;
        } ), cb );
    } );
}