/**
 * @interface OIDCConnect
 */

/**
 * @typedef {Object} OIDCConnect.ConnectConfiguration
 * @property {String} client_id
 * @property {String} login_hint
 * @property {String} scope
 * @property {String} response_mode
 * @property {String} response_type
 * @property {String} grant_type
 * @property {String} redirect_uri
 * @property {String} ui_locales
 * @property {String} acr_values
 * @property {String} state
 * @property {String} nonce
 * @property {String} userinfo_url
 * @property {String} token_url
 * @property {String} id_token_hint
 * @property {String} prompt
 * @memberOf OIDCConnect
 */

/**
 * @typedef {Object} OIDCConnect.InitConfiguration
 * @property {String} grant_type
 * @property {String} token_url
 * @property {String} userinfo_url
 * @property {String} oidc_url
 * @property {String} oauth_url
 * @property {String} method
 * @property {String} client_id
 * @property {String} login_hint
 * @property {String} scope
 * @property {String} response_mode
 * @property {String} response_type
 * @property {String} grant_type
 * @property {String} redirect_uri
 * @property {String} ui_locales
 * @property {String} acr_values
 * @property {String} state
 * @property {String} nonce
 * @property {String} id_token_hint
 * @property {String} prompt
 * @memberOf OIDCConnect
 */

/**
 * @typedef {Object} OIDCConnect.TokenResult
 * @property {String} access_token
 * @property {String} token_type
 * @property {Number} expires_in
 * @property {String} scope
 * @property {String} id_token
 * @memberOf OIDCConnect
 */


/**
 * @typedef {Object} OIDCConnect.doConnectParameters
 * @property {Function} [callback]
 * @property {OIDCConnect.ConnectConfiguration} [config]
 * @property {Function} [inlineOnLoadCallback]
 * @property {HTMLElement} [inlineElementID]
 * @memberOf OIDCConnect
 */

import EVENT_CONSTANTS from './constants/event.constants';
import XDM_CONSTANTS from './constants/xdm.constants';

import CLIENT_CONFIG from './config/oidc.config';
import CONFIG from './config/connector.config';

import DomHelper from './helper/dom-helper';

( function ( context ) {
    const TAG = 'OIDC-Connector';

    let loginWindow;

    /**
     * Return the merged configuration object with given overrides.
     *
     * @param {OIDCConnect.ConnectConfiguration} override_config
     * @return {OIDCConnect.ConnectConfiguration} configuration object
     * @private
     */
    function getUpdatedClientConfig( override_config = {} ) {
        return Object.assign( CLIENT_CONFIG, override_config );
    }

    /**
     * Makes a GET request to the provided OpenID Configuration. Calls callback function when completed.
     *
     * @param url
     * @param callback
     * @private
     */
    function doGetOIDCConfig( url, callback ) {
        if ( url ) {
            DomHelper.doGet( url, ( err, data ) => {
                if ( err ) {
                    console.error( err );
                }

                if ( data && data.authorization_endpoint ) {
                    CONFIG.oauth_url = data.authorization_endpoint;
                }

                callback();
            } );
        } else {
            callback();
        }
    }

    /**
     * Generate the URL to the OAUTH2 Authorize endpoint from oauth_url and configuration parameters
     *
     * @param {OIDCConnect.ConnectConfiguration} clientConfig
     * @return {string} url to OAUTH2 Authorize Endpoint
     * @private
     */
    function createAuthorizeClientUrl( clientConfig ) {
        if ( !CONFIG.oauth_url ) {
            throw Error( `[${TAG}] doConnect - URL to authorization_endpoint missing. Pass oidc_url in OIDC.doInit() to a valid openid-configuration or pass oauth_url (authorization_endpoint) directly to OIDC.doInit().` );
        }
        const objectUrl = DomHelper.serializeConfigToURL( clientConfig );
        return `${CONFIG.oauth_url}?${objectUrl}`;
    }

    /**
     * OIDC Connector onLoad handler.
     */
    function onLoad() {
        try {
            doPolyfill( doGetOIDCConfig.bind( null, CONFIG.oidc_url, doSendLoadedEvent ) );
        } catch ( e ) {
            doSendLoadedEvent();
        }
    }

    /**
     * Apply polyfills for cross-browser functionality.
     * @private
     */
    function doPolyfill( callback ) {
        // custom event polyfill
        if ( typeof window.CustomEvent === 'function' ) {
            callback();
            return;
        }

        function CustomEvent( event, params ) {
            params = params || { bubbles: false, cancelable: false, detail: undefined };
            const evt = document.createEvent( 'CustomEvent' );
            evt.initCustomEvent( event, params.bubbles, params.cancelable, params.detail );
            return evt;
        }

        CustomEvent.prototype = window.Event.prototype;
        window.CustomEvent = CustomEvent;
        callback();
    }

    /**
     * Dispatch event that the connector is loaded.
     * @private
     */
    function doSendLoadedEvent() {
        document.body.dispatchEvent( new window.CustomEvent( EVENT_CONSTANTS.LOADED_EVENT ) );
    }

    /**
     * Handle potential XDM communication from a callback page.
     *
     * @param element
     * @param loginWindow
     * @param callback
     * @param once
     * @param inlineElement
     * @private
     */
    function doHandlePostMessage( { element, loginWindow, callback, once, inlineElement = null } ) {

        function actionCallback( event ) {
            let data = {};
            try {
                data = JSON.parse( event.data ) || {};
            }
            catch ( e ) {
                // ignore
            }
            switch ( data.type ) {
                case XDM_CONSTANTS.BID_ERROR_RECEIVED_XDM_EVENT:
                case XDM_CONSTANTS.BID_RESPONSE_DATA_RECEIVED_XDM_EVENT: {
                    if ( loginWindow ) {
                        loginWindow.close();
                    }

                    if ( inlineElement ) {
                        // Reset inline element
                        inlineElement.innerHTML = '';
                    }

                    if ( data.error ) {
                        if ( callback ) {
                            callback( { error: data.error } );
                        }
                    }
                    else {
                        if ( CONFIG.token_url && CLIENT_CONFIG.response_type === 'code' && data.data.code !== undefined ) {
                            doAuthenticateCode( data.data.code, callback );
                        } else if ( callback ) {
                            callback( null, data.data );
                        }
                    }
                    if ( once ) {
                        element.removeEventListener( 'message', actionCallback );
                    }
                    break;
                }
            }
        }
        element.addEventListener( 'message', actionCallback );
    }

    /**
     * Perform request to token_url with code/grant_type/client_id/redirect_uri meant for auth code token exchange.
     * @param code
     * @param callback
     * @private
     */
    function doAuthenticateCode( code, callback ) {
        DomHelper.doPost( CONFIG.token_url, {
            'client_id': CLIENT_CONFIG.client_id,
            'grant_type': CONFIG.grant_type,
            'code': code,
            'redirect_uri': CLIENT_CONFIG.redirect_uri
        }, ( err, result ) => {
            if ( callback ) {
                if ( err ) {
                    callback( err );
                }
                else if ( result['error'] ) {
                    callback( { error: result['error'] } );
                } else {
                    callback( null, result );
                }
            }
        } );
    }

    /**
     * Start a login session.
     * @param {OIDCConnect.doConnectParameters}
     * @returns {Window|Element} returns the new window object if method is window, or iframe element if inline.
     * @memberOf OIDCConnect
     */
    function doConnect(  { callback=null, config={}, inlineOnLoadCallback=null, inlineElementID=null } ) {
        const clientConfig = getUpdatedClientConfig( config );
        const authorizeUrl = createAuthorizeClientUrl( clientConfig );

        const method = ( config && config.method ) ? config.method : CONFIG.method;
        switch ( method ) {
            case 'window': {
                const windowWidth = 500;
                const windowHeight = 500;
                const windowLeft = window.top.outerWidth / 2 + window.top.screenX - ( windowWidth / 2 );
                const windowTop = window.top.outerHeight / 2 + window.top.screenY - ( windowHeight / 2 );

                // We need to close the window before reopening to trigger focus in a cross-device compatible way
                if ( loginWindow ) {
                    loginWindow.close();
                }

                loginWindow = window.open( authorizeUrl, 'login',
                    [
                        'toolbar=no',
                        'location=no',
                        'status=no',
                        'menubar=no',
                        'scrollbars=yes',
                        'resizable=yes',
                        `width=${windowWidth}px`,
                        `height=${windowHeight}px`,
                        `left=${windowLeft}`,
                        `top=${windowTop}`
                    ].join( ',' ) );

                doHandlePostMessage( {
                    element: context,
                    loginWindow: loginWindow,
                    once: true,
                    callback: callback
                } );

                loginWindow.focus();
                return loginWindow;
            }
            case 'redirect': {
                window.location.assign( authorizeUrl );
                return null;
            }
            case 'inline': {
                let iframeElement = document.createElement( 'iframe' );
                iframeElement.setAttribute( 'src', authorizeUrl );
                iframeElement.setAttribute( 'frameborder', '0' );
                iframeElement.setAttribute( 'width', '100%' );
                iframeElement.setAttribute( 'height', '100%' );
                iframeElement.onload = () => {
                    if ( inlineOnLoadCallback ) {
                        inlineOnLoadCallback();
                    }
                };

                const inlineElement = document.getElementById( inlineElementID );
                if ( !inlineElement ) {
                    throw Error( `[${TAG}] doConnect - inlineElement ${inlineElementID} not found.` );
                }
                inlineElement.appendChild( iframeElement );

                doHandlePostMessage( {
                    element: context,
                    loginWindow: null,
                    callback: callback,
                    once: true,
                    inlineElement: inlineElement
                } );

                return iframeElement;
            }
        }

    }

    /**
     * @callback OIDCConnect.GetUserInfoCallback
     * @param callback
     * @param accessToken
     * @param tokenType
     * @param responseType
     * @memberOf OIDCConnect
     */
    function doGetUserInfo( callback, accessToken = null, tokenType = null, responseType = 'code' ) {
        console.warn( `[${TAG}] doGetUserInfo is an experimental feature` );

        if ( !callback ) {
            throw Error( `[${TAG}] doGetUserInfo - missing callback!.` );
        }
        if ( !accessToken ) {
            throw Error( `[${TAG}] doGetUserInfo - missing accessToken!.` );
        }
        if ( !tokenType ) {
            throw Error( `[${TAG}] doGetUserInfo - missing tokenType!.` );
        }

        let headers = {};
        let data = {};

        if ( responseType === 'code' ) {
            data.access_token = accessToken;
            data.token_type = tokenType;
        } else if ( responseType === 'token' ) {
            headers.Authorization = `${tokenType} ${accessToken}`;
        }

        DomHelper.doPost( CONFIG.userinfo_url, data, ( err, result ) => {
            if ( err ) {
                callback( err );
            }
            else {
                if ( result['error'] ) {
                    callback( { error: result['error'] } );
                }
                else {
                    callback( null, result );
                }
            }
        }, headers );
    }

    /**
     * Set parameters used in doConnect calls.
     * @param {OIDCConnect.InitConfiguration} config
     * @return void
     * @memberOf OIDCConnect
     */
    function doInit( config ) {
        if ( !config ) {
            throw Error( `[${TAG}] doInit - missing configuration. You need to pass a configuration object.` );
        }
        if ( !config.oauth_url && config.oidc_url ) {
            doGetOIDCConfig( config.oidc_url, updateConfig.bind( null, config ) );
        } else {
            updateConfig( config );
        }
    }

    /**
     * Update configuration objects with given parameter object
     * @param config
     * @private
     */
    function updateConfig( config ) {
        if ( !config.hasOwnProperty( 'client_id' ) ) {
            throw Error( `[${TAG}] doInit - missing required parameter client_id.` );
        }

        CONFIG.update( config );
        CLIENT_CONFIG.update( config );

        const allowedMethods = ['window', 'redirect', 'inline'];
        if ( allowedMethods.indexOf( CONFIG.method ) === -1 ) {
            throw Error( `[${TAG}] doInit - bad UI method. Use one of ${allowedMethods.toString()}.` );
        }
    }

    /**
     * Trigger a cross-browser onload event when DOM is loaded.
     */
    function load() {
        context[ context.addEventListener ? 'addEventListener' : 'attachEvent' ]( context.addEventListener ? 'load' : 'onload', onLoad, false );
    }

    context.OIDC = {
        /**
         * Set parameters used in doConnect calls.
         * @param {OIDCConnect.InitConfiguration} config
         */
        doInit: doInit,

        /**
         * Start a login session.
         * @param {OIDCConnect.doConnectParameters}
         * @returns {Window|Element} returns the new window object if method is window, or iframe element if inline.
         */
        doConnect: doConnect,

        /**
         * Fetch userinfo from userinfo endpoint (Experimental feature).
         * @callback OIDCConnect.GetUserInfoCallback
         * @param {Function|OIDCConnect.GetUserInfoCallback} callback
         * @param {String} accessToken
         * @param {String} tokenType
         * @param {String} responseType
         */
        doGetUserInfo: doGetUserInfo,
        // eslint-disable-next-line no-undef
        VERSION: VERSION
    };

    load();
} )( window );