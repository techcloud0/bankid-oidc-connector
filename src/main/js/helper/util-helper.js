export default class UtilHelper {
    static parseJSON( str ) {
        const fixedJSON = str
            .replace( /:\s*"([^"]*)"/g, function ( match, p1 ) {
                return ': "' + p1.replace( /:/g, '@colon@' ) + '"';
            } )
            .replace( /:\s*'([^']*)'/g, function ( match, p1 ) {
                return ': "' + p1.replace( /:/g, '@colon@' ) + '"';
            } )
            .replace( /(['"])?([!a-z0-9A-Z_\-]+)(['"])?\s*:/g, '"$2": ' )
            .replace( /@colon@/g, ':' )
            .replace( /(\r\n|\n|\r)/gm, '' );
        return JSON.parse( fixedJSON );
    }

    static objDiff( obj, objCompare ) {
        const objDiff = {};

        if ( !obj ) {
            return objDiff;
        }

        Object.keys( obj ).forEach( key => {
            if ( JSON.stringify( obj[key] ) !== JSON.stringify( objCompare[key] ) ) {
                objDiff[key] = obj[key];
            }
        } );

        return objDiff;
    }

    /**
     * @param {String} search
     * @returns {Object}
     */
    static urlSearchToObj( search ) {
        const pairs = search.substring( 1 ).split( '&' ),
            obj = {};
        let pair,
            i;

        for ( i in pairs ) {
            if ( pairs[i] === '' ) {
                continue;
            }

            pair = pairs[i].split( '=' );
            obj[decodeURIComponent( pair[0] )] = decodeURIComponent( pair[1] );
        }

        return obj;
    }

    /**
     * @param {Object} obj
     * @returns {Boolean} True if all values in obj are false ish
     */
    static isObjectEmpty( obj ) {
        for ( let key in obj ) {
            if ( obj.hasOwnProperty( key ) && ( obj[key] || obj[key] === false ) ) {
                return false;
            }
        }

        return true;
    }
}