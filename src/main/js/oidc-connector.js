/**
 * @interface OIDCConnect
 */

/**
 * @typedef {Object} OIDCConnect.Configuration
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
 * @property {String} userinfo_url
 * @property {String} token_url
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

import EVENT_CONSTANTS from './constants/event.constants';
import XDM_CONSTANTS from './constants/xdm.constants';

import OIDCConfig from './config/oidc.config';
import ConnectorConfig from './config/connector.config';

import DomHelper from './helper/dom-helper';

( function ( context ) {

    const TAG = 'OIDC-Connector';
    const VERSION = '1.2.0';
    const CLIENT_CONFIG = new OIDCConfig( {
        scope: 'openid',
        response_mode: 'query',
        response_type: 'code',
        redirect_uri: '',
        ui_locales: 'nb',
        acr_values: '4',
        nonce: DomHelper.createRandomHexString(),
        state: 'untouched',
        login_hint: '',
        id_token_hint: '',
        prompt: ''
    } );
    const CONFIG = new ConnectorConfig( {
        method: 'redirect',
        oauth_url: '',
        grant_type: 'authorization_code',
        userinfo_url: '',
        token_url: ''
    } );

    /**
     * Return the merged configuration object with given overrides.
     *
     * @param override_config
     * @return {OIDCConnect.Configuration} configuration object
     * @private
     */
    function _getUpdatedClientConfig( override_config = {} ) {
        return Object.assign( CLIENT_CONFIG, override_config );
    }

    /**
     * Generate the URL to the OAUTH2 Authorize endpoint from oauth_url and configuration parameters
     *
     * @param {OIDCConnect.Configuration} clientConfig
     * @return {string} url to OAUTH2 Authorize Endpoint
     * @private
     */
    function _createAuthorizeClientUrl( clientConfig ) {
        const objectUrl = DomHelper.serializeConfigToURL( clientConfig );
        return `${CONFIG.oauth_url}?${objectUrl}`;
    }

    /**
     * OIDC Connector onLoad handler.
     */
    function onLoad() {
        _doPolyfill();
        _doSendLoadedEvent();
        console.log( 'Loaded OIDC Connector v' + VERSION );
    }

    /**
     * Apply polyfills for cross-browser functionality.
     * @private
     */
    function _doPolyfill() {
        // custom event polyfill
        if ( typeof window.CustomEvent === 'function' ) {
            return false;
        }

        function CustomEvent( event, params ) {
            params = params || { bubbles: false, cancelable: false, detail: undefined };
            const evt = document.createEvent( 'CustomEvent' );
            evt.initCustomEvent( event, params.bubbles, params.cancelable, params.detail );
            return evt;
        }

        CustomEvent.prototype = window.Event.prototype;
        window.CustomEvent = CustomEvent;
    }

    /**
     * Dispatch event that the connector is loaded.
     * @private
     */
    function _doSendLoadedEvent() {
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
    function _doHandlePostMessage( { element, loginWindow, callback, once, inlineElement = null } ) {

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
                            _doAuthenticateCode( data.data.code, callback );
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
    function _doAuthenticateCode( code, callback ) {
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
     * Public doConnect API function for starting a login session.
     *
     * @param {Function} [callback]
     * @param {OIDCConnect.Configuration} [config]
     * @param {Function} [inlineOnLoadCallback]
     * @param {HTMLElement} [inlineElementID]
     *
     * @returns {Window|Element} returns the new window object if method is window, or iframe element if inline.
     */
    function doConnect(  { callback=null, config={}, inlineOnLoadCallback=null, inlineElementID=null } ) {
        return _doConnect( {
            callback: callback,
            config: config,
            inlineElementID: inlineElementID,
            inlineOnLoadCallback: inlineOnLoadCallback
        } );
    }

    /**
     * Perform doConnect to OIDC with configuration.
     *
     * @param {Function} [callback]
     * @param {OIDCConnect.Configuration} [config]
     * @param {Function} [inlineOnLoadCallback]
     * @param {String} inlineElementID
     * @param {Boolean} [isIgnoreWindow]
     *
     * @returns {Window|Element} returns the new window object if method is window, or iframe element if inline.
     *
     * @private
     */
    function _doConnect( { callback, config = {}, inlineElementID, inlineOnLoadCallback, isIgnoreWindow } ) {
        if ( CONFIG.method !== 'redirect' && !callback ) {
            throw Error( `[${TAG}] doConnect - missing callback method. You need to provide a callback when using inline or window method.` );
        }

        const clientConfig = _getUpdatedClientConfig( config );
        const authorizeUrl = _createAuthorizeClientUrl( clientConfig );

        const method = ( config && config.method ) ? config.method : CONFIG.method;
        switch ( method ) {
            case 'window': {
                let loginWindow;
                if ( !isIgnoreWindow ) {
                    const windowWidth = 500;
                    const windowHeight = 500;
                    const windowLeft = window.top.outerWidth / 2 + window.top.screenX - ( windowWidth / 2 );
                    const windowTop = window.top.outerHeight / 2 + window.top.screenY - ( windowHeight / 2 );
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

                    _doHandlePostMessage( {
                        element: context,
                        loginWindow: loginWindow,
                        once: true,
                        callback: callback
                    } );
                }
                loginWindow.focus();
                return loginWindow;
            }
            case 'redirect': {
                window.location.assign( authorizeUrl );
                return;
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

                _doHandlePostMessage( {
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
        console.warning( 'doGetUserInfo is an experimental feature' );

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
     * @param {OIDCConnect.Configuration} config
     */
    function doInit( config ) {
        if ( !config ) {
            throw Error( `[${TAG}] doInit - missing configuration. You need to pass a configuration object.` );
        }

        CONFIG.oauth_url = config.oauth_url || CONFIG.oauth_url;
        CONFIG.grant_type = config.grant_type || CONFIG.grant_type;
        CONFIG.method = config.method || CONFIG.method;
        CONFIG.token_url = config.token_url || CONFIG.token_url;
        CONFIG.userinfo_url = config.userinfo_url || CONFIG.userinfo_url;
        CONFIG.storage_key_access += '-' + config.client_id;

        const allowedMethods = ['window', 'redirect', 'inline'];

        if ( allowedMethods.indexOf( CONFIG.method ) === -1 ) {
            throw Error( `[${TAG}] doInit - bad method. Use one of ${allowedMethods.toString()}.` );
        }

        if ( !config.hasOwnProperty( 'client_id' ) ) {
            throw Error( `[${TAG}] doInit - missing required parameter client_id.` );
        }

        CLIENT_CONFIG.login_hint = config.login_hint || CLIENT_CONFIG.login_hint;
        CLIENT_CONFIG.id_token_hint = config.id_token_hint || CLIENT_CONFIG.id_token_hint;
        CLIENT_CONFIG.prompt = config.prompt || CLIENT_CONFIG.prompt;
        CLIENT_CONFIG.client_id = config.client_id;
        CLIENT_CONFIG.scope = config.scope || CLIENT_CONFIG.scope;
        CLIENT_CONFIG.response_mode = config.response_mode || CLIENT_CONFIG.response_mode;
        CLIENT_CONFIG.response_type = config.response_type || CLIENT_CONFIG.response_type;
        CLIENT_CONFIG.redirect_uri = config.redirect_uri || CLIENT_CONFIG.redirect_uri;
        CLIENT_CONFIG.state = config.state || CLIENT_CONFIG.state;
        CLIENT_CONFIG.ui_locales = config.ui_locales || CLIENT_CONFIG.ui_locales;
        CLIENT_CONFIG.acr_values = config.acr_values || CLIENT_CONFIG.acr_values;
        CLIENT_CONFIG.nonce = config.nonce || CLIENT_CONFIG.nonce;

        Object.assign( CLIENT_CONFIG, config );
    }

    context.OIDC = {
        doInit: doInit,
        doConnect: doConnect,
        doGetUserInfo: doGetUserInfo
    };

    context.addEventListener( 'load', onLoad, false );
} )( window );