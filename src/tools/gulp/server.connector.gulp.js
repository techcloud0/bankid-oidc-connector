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
        // const queryObject = url.parse( req.url,true ).query;

        // 1 authorization_flow   response_type=code
        // https://openid.net/specs/openid-connect-core-1_0.html#CodeFlowAuth
        //
        // HTTP/1.1 302 Found
        // Location: https://client.example.org/cb?
        //     code=SplxlOBeZQQYbYS6WxSbIA
        //     &state=af0ifjsldkj


        // 2 Implicit flow   response_type=id_token token
        // https://openid.net/specs/openid-connect-core-1_0.html#ImplicitFlowAuth
        //
        // HTTP/1.1 302 Found
        // Location: https://client.example.org/cb#
        //     access_token=SlAV32hkKG
        //     &token_type=bearer
        //     &id_token=eyJ0 ... NiJ9.eyJ1c ... I6IjIifX0.DeWt4Qu ... ZXso
        // &expires_in=3600
        // &state=af0ifjsldkj

        // 3 Hybrid flow  response_type=code id_token
        // https://openid.net/specs/openid-connect-core-1_0.html#HybridFlowAuth
        //
        // HTTP/1.1 302 Found
        // Location: https://client.example.org/cb#
        //     code=SplxlOBeZQQYbYS6WxSbIA
        //     &id_token=eyJ0 ... NiJ9.eyJ1c ... I6IjIifX0.DeWt4Qu ... ZXso
        // &state=af0ifjsldkj

        // Could actually just return the examples/result.html
        const filePath = path.resolve( PUBLIC_FOLDER, 'examples/example_callback_page.html' );
        fs.readFile( filePath, 'UTF-8', ( err, result ) => {
            if ( err ) {
                console.error( 'File \'%s\' does not exist', filePath );
                res.statusCode = 400;
                res.end( `File '${path.relative( PUBLIC_FOLDER, filePath )}' does not exist` );
            }
            else {
                const mimeType = mime.getType( filePath );

                if (res.locals && res.locals.form_data) {
                    result = result.replace(/{\w+}/g, JSON.stringify( res.locals.form_data ) );
                }

                res.writeHead( 200, { 'Content-Type': mimeType } );
                if ( /^image\//.test( mimeType || '' ) ) {
                    fs.createReadStream( filePath ).pipe( res );
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
        middleware: () => {
            return middlewareList;
        }
    } );
} );