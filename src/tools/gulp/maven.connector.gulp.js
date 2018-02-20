const gulp = require( 'gulp' );
const path = require( 'upath' );

const ROOT = path.resolve( __dirname, '../../../' );

const maven = require( 'maven-deploy' );

/**
 * Deploys a snapshot version of the next release (that is version in package.json + 1) in the
 * nexus repo defined in maven.config.json.
 * <br>
 * Uses this plugin: https://github.com/finn-no/maven-deploy
 */
gulp.task( 'connector:dist:deploy', ['connector:dist:package:preprod'], () => {
    const maven_config = require( path.resolve( ROOT, './maven-config.json' ) );
    maven.config( maven_config );
    maven.deploy( 'bankid-public-snapshot', true );
} );

/**
 * Deploy a release version of bankid-oidc-connector with the version given in package.json
 */
gulp.task( 'connector:dist:release', ['connector:dist:package'], () => {
    const maven_config = require( path.resolve( ROOT, './maven-config.json' ) );
    maven.config( maven_config );
    maven.deploy( 'bankid-public' );
} );