process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

const path = require( 'upath' );

const ROOT = '../../../';
const PUBLIC_FOLDER = path.resolve( __dirname, ROOT, 'src/main/public' );

const gulp = require( 'gulp' );
const connect = require( 'gulp-connect' );
const bodyParser = require( 'body-parser' );
const url = require( 'url' );

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

    // Handle OIDC /callback
    middlewareList.push( generateMiddleware( /callback/, ( req, res, next ) => {
        // const queryObject = url.parse( req.url,true ).query;

        res.statusCode = 200;
        res.end( 'OK' );

        next();
    } ) );

    middlewareList.push( bodyParser.json() );

    return connect.server( {
        port: packageJson.port,
        root: PUBLIC_FOLDER,
        middleware: () => {
            return middlewareList;
        }
    } );
} );