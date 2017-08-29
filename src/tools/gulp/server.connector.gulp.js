process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

const path = require( 'upath' );

const ROOT = '../../../';
const PUBLIC_FOLDER = path.resolve( __dirname, ROOT, 'src/main/public' );

const gulp = require( 'gulp' );
const connect = require( 'gulp-connect' );

const packageJson = require( path.resolve( __dirname, ROOT, 'package.json' ) );

gulp.task( 'connector:server', ['connector'], () => {
    return connect.server( {
        port: packageJson.port,
        root: PUBLIC_FOLDER,
    } );
} );