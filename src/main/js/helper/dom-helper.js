import CONNECTOR_CONSTANTS from '../constants/connector.constants';

export default class DomHelper {

    /**
     * Returns a random hex as string.
     * @return {string}
     */
    static createRandomHexString() {
        return Math.floor( ( 1 + Math.random() ) * 0x10000 )
            .toString( 16 )
            .substring( 1 );
    }

    /**
     * Return an URL encoded query string from given object.
     * @param {OIDCConnect.Configuration} config
     * @return {string}
     */
    static serializeConfigToURL( config ) {
        return Object.keys( config )
            .filter( key => { return CONNECTOR_CONSTANTS.ALLOWED_PARAMS.indexOf( key ) > -1; } )
            .map( key => `${key}=${encodeURIComponent( config[key] )}` ).join( '&' );
    }

    /**
     * @typedef {Object} DomHelper.AjaxError
     * @typedef {Object} error
     * @typedef {Number} [code]
     * @typedef {String} [message]
     * @memberOf DomHelper
     */

    /**
     * @callback DomHelper.AjaxCallback
     * @param {DomHelper.AjaxError|null} error
     * @param {String} [result]
     * @memberOf DomHelper
     */

    /**
     * @param {String} url
     * @param {Object} data
     * @param {DomHelper.AjaxCallback} callback
     * @param {Object} headers (optional)
     */
    static doPost( url, data, callback, headers = {} ) {
        const dataForm = DomHelper.serializeConfigToURL( data );

        let xhr;
        if ( window.XDomainRequest ) xhr = new window.XDomainRequest();
        else if ( window.XMLHttpRequest ) xhr = new window.XMLHttpRequest();
        else xhr = new window.ActiveXObject( 'MSXML2.XMLHTTP.3.0' );

        xhr.open( 'POST', url );
        xhr.withCredentials = true;
        xhr.addEventListener( 'load', () => {
            if ( xhr.readyState === xhr.DONE && xhr.status === 200 ) {
                try {
                    callback( null, JSON.parse( xhr.responseText ) || {} );
                }
                catch ( e ) {
                    console.trace( e );
                    callback( { error: 'Invalid JSON in response' } );
                }
            }
            else {
                callback( { error: 'Unexpected error', status: xhr.status, message: xhr.responseText } );
            }
        } );

        xhr.addEventListener( 'error', ( e ) => callback( e ) );
        xhr.addEventListener( 'timeout', () => callback( { timeout: true } ) );
        xhr.addEventListener( 'abort', () => callback( { abort: true } ) );

        for ( const header in headers ) {
            if ( headers.hasOwnProperty( header ) ) {
                xhr.setRequestHeader( header, headers[header] );
            }
        }
        xhr.setRequestHeader( 'Content-Type', 'application/x-www-form-urlencoded' );
        xhr.send( dataForm );
    }

    static doGet( url, callback ) {
        let xhr;

        if ( window.XDomainRequest ) xhr = new window.XDomainRequest();
        else if ( window.XMLHttpRequest ) xhr = new window.XMLHttpRequest();
        else xhr = new window.ActiveXObject( 'MSXML2.XMLHTTP.3.0' );

        xhr.open( 'GET', url, true );
        xhr.setRequestHeader( 'Accept', 'application/json' );
        xhr.addEventListener( 'load', () => {
            if ( xhr.readyState === xhr.DONE && xhr.status === 200 ) {
                try {
                    callback( null, JSON.parse( xhr.responseText ) || {} );
                }
                catch ( e ) {
                    console.trace( e );
                    callback( { error: 'Invalid JSON in response' } );
                }
            }
            else {
                callback( { error: 'Unexpected error', status: xhr.status, message: xhr.responseText } );
            }
        } );

        xhr.addEventListener( 'error', ( e ) => callback( e ) );
        xhr.addEventListener( 'timeout', () => callback( { timeout: true } ) );
        xhr.addEventListener( 'abort', () => callback( { abort: true } ) );

        xhr.send();
    }
}