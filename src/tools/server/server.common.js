const fs = require( 'fs' );
const path = require( 'upath' );
const extend = require( 'extend' );

const ROOT = '../../../';
const DATA_FILE = path.resolve( __dirname, ROOT, 'config.json' );
const DATA_CUSTOM_FILE = path.resolve( __dirname, ROOT, 'config.custom.json' );


module.exports.getConfigJson = function () {
    const defaultData = JSON.parse( fs.readFileSync( DATA_FILE, 'UTF-8' ) );

    try {
        fs.statSync( DATA_CUSTOM_FILE );
        extend( defaultData, JSON.parse( fs.readFileSync( DATA_CUSTOM_FILE, 'UTF-8' ) ) );
    }
    catch ( e ) {
        // ignore
    }
    return defaultData;
};