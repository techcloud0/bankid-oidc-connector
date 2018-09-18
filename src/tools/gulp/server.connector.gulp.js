process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

const path = require( 'upath' );

const ROOT = '../../../';
const PUBLIC_FOLDER = path.resolve( __dirname, ROOT, 'src/main/public' );

const gulp = require( 'gulp' );
const connect = require( 'gulp-connect' );

const serverCommon = require( '../server/server.common' );

const packageJson = require( path.resolve( __dirname, ROOT, 'package.json' ) );

gulp.task( 'connector:server', () => {
    return connect.server( {
        port: packageJson.port,
        root: PUBLIC_FOLDER,
        host: '0.0.0.0',
        // https can also be on object. See https://nodejs.org/api/https.html#https_https_createserver_options_requestlistener
        https: serverCommon.getConfigJson()['https'],
    } );
} );