import CONNECTOR_CONSTANTS from '../constants/connector.constants';

export default class DomHelper {

    /**
     * @return {Number} IE version, 0 if not IE browser
     */
    static getIEVersion() {
        const ua = window.navigator.userAgent;
        const msie = ua.indexOf( 'MSIE ' );

        if ( msie > 0 || !!window.navigator.userAgent.match( /Trident.*rv:11\./ ) ) {
            return parseInt( ua.substring( msie + 5, ua.indexOf( '.', msie ) ) );
        }
        else {
            return 0;
        }
    }


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
            .filter( key => { return config[key] !== '' && CONNECTOR_CONSTANTS.ALLOWED_PARAMS.indexOf( key ) > -1; } )
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

        if ( window.XDomainRequest && DomHelper.getIEVersion() === 9 ) {
            const xdr = new window.XDomainRequest();
            xdr.open( 'POST', url );

            xdr.ontimeout = function () {
                callback( { timeout: true } );
            };

            xdr.onerror = function () {
                callback( { error: `Unexpected error connecting to ${url}` } );
            };

            xdr.onload = function() {
                try {
                    callback( null, JSON.parse( xdr.responseText ) || {} );
                }
                catch ( e ) {
                    console.trace( e );
                    callback( { error: 'Invalid JSON in response' } );
                }
            };

            // To prevent an issue with the interface where some requests are lost if multiple XDomainRequests are being sent at the same time
            setTimeout( () => {
                xdr.send( dataForm );
            }, 0 );
        } else {
            const xhr = new ( window.XMLHttpRequest || window.ActiveXObject )( 'MSXML2.XMLHTTP.3.0' );
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
            console.log( 'Going to send: ' + dataForm );
            xhr.send( dataForm );
        }


    }

    static doGet( url, callback ) {
        if ( window.XDomainRequest && DomHelper.getIEVersion() === 9 ) {
            const xdr = new window.XDomainRequest();
            xdr.open( 'GET', url );

            xdr.ontimeout = function () {
                callback( { timeout: true } );
            };

            xdr.onerror = function () {
                callback( { error: `Unexpected error connecting to ${url}` } );
            };

            xdr.onload = function() {
                try {
                    callback( null, JSON.parse( xdr.responseText ) || {} );
                }
                catch ( e ) {
                    console.trace( e );
                    callback( { error: 'Invalid JSON in response' } );
                }
            };

            // To prevent an issue with the interface where some requests are lost if multiple XDomainRequests are being sent at the same time
            setTimeout( () => {
                xdr.send();
            }, 0 );
        } else {
            const xhr = new ( window.XMLHttpRequest || window.ActiveXObject )( 'MSXML2.XMLHTTP.3.0' );
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
                    callback( { error: `Unexpected error connecting to ${url}`, status: xhr.status, message: xhr.responseText } );
                }
            } );

            xhr.addEventListener( 'error', ( e ) => callback( e ) );
            xhr.addEventListener( 'timeout', () => callback( { timeout: true } ) );
            xhr.addEventListener( 'abort', () => callback( { abort: true } ) );

            xhr.send();
        }
    }
}