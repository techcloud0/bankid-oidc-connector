/**
 * Write value associated with key to sessionStorage, if available.
 *
 * Supports any Object, String or primitive.
 *
 * @param {String} key
 * @param value
 * @return {boolean} true if write was successful, false otherwise
 */
export function writeSessionStorage( key, value ) {
    try {
        if ( typeof window.sessionStorage === 'object' && window.sessionStorage !== null && window.sessionStorage.setItem !== undefined ) {
            let result = '';
            try {
                result = JSON.stringify( value );
                if ( /^[{[]/.test( result ) ) {
                    value = result;
                }
            } catch ( e ) {
                // ignore
            }
            window.sessionStorage.setItem( key, value );
            return true;
        }
        return false;
    } catch ( err ) {
        return false;
    }
}

/**
 * Read value associated with key from sessionStorage, if found. Objects are parsed automatically.
 *
 * @param {String} key
 * @param {*} [def=null] Default value
 * @return {Object|null} Value if found, otherwise null
 */
export function readSessionStorage( key, def = null ) {
    try {
        if ( typeof window.sessionStorage === 'object' && window.sessionStorage !== null && window.sessionStorage.getItem !== undefined ) {
            let value = window.sessionStorage.getItem( key );

            try {
                value = JSON.parse( value );
            } catch ( e ) {
                // ignore
            }

            return value !== null ? value : def;
        }

        return def;
    } catch ( err ) {
        return def;
    }
}