const url = require( 'url' );
const formidable = require( 'formidable' );

module.exports = function responseFormPost( req, res, next ) {
    const urlParsed = url.parse( req.url, true );
    if ( !res.locals ) {
        res['locals'] = {};
    }
    if ( req.method === 'POST' && urlParsed.pathname === '/callback' ) {
        const form = new formidable.IncomingForm();
        form.parse( req, function( err, fields ) {
            if ( err ) {
                console.warn( err );
            } else {
                console.log( fields );
                res['locals'].form_data = fields;
            }
            next();
        } );
    } else {
        next();
    }
};