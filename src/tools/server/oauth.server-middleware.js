const url = require( 'url' );
const formidable = require( 'formidable' );
const rp = require( 'request-promise' );

const serverCommon = require( './server.common' );

module.exports = function oauthMiddleware( req, res, next ) {
    const CONFIG = serverCommon.getConfigJson();
    const urlParsed = url.parse( req.url, true );
    const clientSecret = CONFIG['clientSecret'];

    if ( !clientSecret ) {
        res.statusCode = 400;
        res.end( JSON.stringify( { error: 'Unknown client, no client secret' } ) );
        return;
    }
    // OAUTH token
    if ( urlParsed.pathname === '/oauth/token' ) {
        const form = new formidable.IncomingForm();
        form.parse( req, function ( err, fields ) {
            const options = {
                method: 'POST',
                uri: CONFIG['tokenUrl'],
                form: {
                    client_id: fields['client_id'],
                    client_secret: clientSecret,
                    grant_type: fields['grant_type'],
                    code: fields['code'],
                    redirect_uri: fields['redirect_uri']
                },
                json: true
            };

            rp( options )
                .then( function ( response ) {
                    console.log( 'token response', response );
                    res.end( JSON.stringify( response ) );
                } )
                .catch( function ( err ) {
                    console.log( 'token response err');
                    res.statusCode = err.statusCode;
                    res.end( JSON.stringify( err.error ) );
                } );
        } );
    }

    // OAUTH user info
    else if ( urlParsed.pathname === '/oauth/userinfo' ) {
        const form = new formidable.IncomingForm();
        form.parse( req, function ( err, fields ) {
            const options = {
                uri: CONFIG['userInfoUrl'],
                headers: {
                    Authorization: `${fields['token_type']} ${fields['access_token']}`,
                },
                json: true
            };

            rp( options )
                .then( function ( response ) {
                    // FIXME: Sometimes the userinfo response includes errounous newlines
                    try {
                        response = JSON.parse( response.replace( /(\r\n|\n|\r)/gm, '' ) );
                    } catch ( error ) {
                    }

                    console.log( 'token response', response );
                    res.end( JSON.stringify( response ) );
                } )
                .catch( function ( err ) {
                    res.statusCode = err.statusCode;
                    res.end( JSON.stringify( err.error ) );
                } );
        } );
    }
    else {
        next();
    }
};