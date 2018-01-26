process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

const path = require( 'upath' );

const ROOT = '../../../';
const PUBLIC_FOLDER = path.resolve( __dirname, ROOT, 'src/main/public' );

const gulp = require( 'gulp' );
const connect = require( 'gulp-connect' );
const bodyParser = require( 'body-parser' );
const url = require( 'url' );
const fs = require( 'fs' );
const mime = require( 'mime' );
const responseFormPostMiddleware = require( '../server/response-form-post.server-middleware' );
const oauthServerMiddleware = require( '../server/oauth.server-middleware' );

const callbackPageFile = path.resolve( PUBLIC_FOLDER, 'example_callback_page.html' );
const packageJson = require( path.resolve( __dirname, ROOT, 'package.json' ) );


/**
 * @param {RegExp} pathRegExp
 * @param {ServerRouterMiddlewareCallback} callback
 * @return {Function}
 */
function generateMiddleware( pathRegExp, callback ) {
    return ( req, res, next ) => {
        const urlParsed = url.parse( req.url );
        if ( pathRegExp.test( urlParsed.pathname ) ) {
            const match = ( urlParsed.pathname.match( pathRegExp ) || [null] ).slice( 1 );
            callback.apply( null, [req, res, next].concat( match ) );
        }
        else {
            next();
        }
    };
}

gulp.task( 'connector:server', () => {
    let middlewareList = [];

    middlewareList.push( responseFormPostMiddleware );

    // Handle OIDC /callback
    middlewareList.push( generateMiddleware( /callback/, ( req, res, next ) => {
        fs.readFile( callbackPageFile, 'UTF-8', ( err, result ) => {
            if ( err ) {
                console.error( 'File \'%s\' does not exist', callbackPageFile );
                res.statusCode = 400;
                res.end( `File '${path.relative( PUBLIC_FOLDER, callbackPageFile )}' does not exist` );
            }
            else {
                const mimeType = mime.getType( callbackPageFile );

                if ( res.locals && res.locals.form_data ) {
                    result = result.replace( /{\w+}/g, JSON.stringify( res.locals.form_data ) );
                }

                res.writeHead( 200, { 'Content-Type': mimeType } );
                if ( /^image\//.test( mimeType || '' ) ) {
                    fs.createReadStream( callbackPageFile ).pipe( res );
                }
                else {
                    res.end( result );
                }
            }
        } );
    } ) );

    middlewareList.push( oauthServerMiddleware );
    middlewareList.push( bodyParser.json() );

    return connect.server( {
        port: packageJson.port,
        root: PUBLIC_FOLDER,
        https: true,  // can also be on object. See https://nodejs.org/api/https.html#https_https_createserver_options_requestlistener
        middleware: () => {
            return middlewareList;
        }
    } );
} );