/**
 * @interface BIDOIDCConnect
 */

/**
 * @typedef {Object} BIDOIDCConnect.Configuration
 * @property {String} oauth_url
 * @property {String} method
 * @property {String} client_id
 * @property {String} scope
 * @property {String} response_mode
 * @property {String} response_type
 * @property {String} grant_type
 * @property {String} redirect_uri
 * @property {String} application_name
 * @property {Boolean} skipClientPrompt
 * @property {Boolean} forceClientPrompt
 * @property {Boolean} noStepup
 * @property {String} client_type
 * @property {String} user_profile
 * @property {String} ui_locales
 * @property {String} acr_values
 * @memberOf BIDOIDCConnect
 */

/**
 * @typedef {Object} BIDOIDCConnect.TokenResult
 * @property {String} access_token
 * @property {String} token_type
 * @property {Number} expires_in
 * @property {String} scope
 * @property {String} id_token
 * @memberOf BIDOIDCConnect
 */

/**
 * @typedef {Object} BIDOIDCConnect.ConnectButton
 * @property {HTMLElement} button
 * @property {HTMLElement} iframe
 * @property {String} id
 * @property {String} connectEvent
 * @property {String} type
 * @property {String} scope
 * @memberOf BIDOIDCConnect
 */

/**
 * @typedef {Object} BIDOIDCConnect.UserInfo.UserAddress
 * @property {String} formatted
 * @property {String} country
 * @property {String} street_address
 * @property {String} postal_code
 * @property {String} locality
 * @property {String} house_number
 * @property {String} house_letter
 * @property {String} street_name
 * @memberOf BIDOIDCConnect.UserInfo
 */
/**
 * @typedef {Object} BIDOIDCConnect.UserInfo
 * @property {String} id
 * @property {String} preferred_username
 * @property {String} family_name
 * @property {String} given_name
 * @property {String} name
 * @property {String} birthdate
 * @property {BIDOIDCConnect.UserInfo.UserAddress} address
 * @property {String} phone_number
 * @property {String} email
 * @memberOf BIDOIDCConnect
 */

import Dialog from './component/dialog.component';
import EVENT_CONSTANTS from './constants/event.constants';
import UtilHelper from './helper/util-helper.js';

( function ( context, Dialog ) {

    let oAuthUrl = '/';

    const DEFAULT_CLIENT_CONFIG = {
        scope: 'openid',
        response_mode: 'query',
        response_type: 'code',
        redirect_uri: '/',
        skipClientPrompt: false,
        forceClientPrompt: false,
        noStepup: false,
        ui_locales: 'nb',
        client_type: '',
        user_profile: '',
        acr_values: '4',
        nonce: '',
        state: 'untouched',
        token_endpoint: `${oAuthUrl}/token`,
        userinfo_endpoint: `${oAuthUrl}/userinfo`
    };
    const CLIENT_CONFIG = {};
    const CONFIG = {
        method: 'window',
        endpoint: oAuthUrl,
        grant_type: 'authorization_code',
        storage_key_access: 'xid-access'
    };
    /**
     * @type {{id: {BIDOIDCConnect.ConnectButton}}}
     */
    const connectButtons = {};

    function isConnected() {
        return !!window.sessionStorage.getItem( CONFIG.storage_key_access );
    }

    function getAccessObject() {
        const accessToken = ( window.sessionStorage.getItem( CONFIG.storage_key_access ) || '' ).split( ';' );
        return {
            accessToken: accessToken[0] || '',
            tokenType: accessToken[1] || '',
        };
    }

    /**
     * @param {String} id
     * @returns {BIDOIDCConnect.ConnectButton}
     */
    function getConnectButton( id ) {
        return connectButtons[id];
    }

    function createRandom() {
        return Math.floor( ( 1 + Math.random() ) * 0x10000 )
            .toString( 16 )
            .substring( 1 );
    }

    function createLoginHintFromConfig( config ) {
        const directConsent = typeof config.skipClientPrompt !== 'undefined' ? config.skipClientPrompt : DEFAULT_CLIENT_CONFIG.skipClientPrompt;
        const forceConfirm = typeof config.forceClientPrompt !== 'undefined' ? config.forceClientPrompt : DEFAULT_CLIENT_CONFIG.forceClientPrompt;
        const noStepup = typeof config.noStepup !== 'undefined' ? config.noStepup : DEFAULT_CLIENT_CONFIG.noStepup;
        const clientType = typeof config.client_type !== 'undefined' ? config.client_type : DEFAULT_CLIENT_CONFIG.client_type;
        const userProfile = typeof config.user_profile !== 'undefined' ? config.user_profile : DEFAULT_CLIENT_CONFIG.user_profile;

        const login_hint = [];
        const allowedClientTypes = ['XID', 'BID', 'BIM', 'OBIM', 'DUMMY'];

        if ( allowedClientTypes.indexOf( clientType.toUpperCase() ) !== -1 ) {
            login_hint.push( clientType.toUpperCase() );
        }

        if ( userProfile ) {
            login_hint.push( ':' + userProfile );
        }

        if ( directConsent ) {
            login_hint.push( ':directconsent' );
        }

        if ( noStepup ) {
            login_hint.push( ':nostepup' );
        }

        if ( forceConfirm ) {
            login_hint.push( ':forceconfirm' );
        }
        return login_hint.join( '' );
    }

    function createClientConfig( id, override_config = {} ) {
        const config = override_config;

        if ( id ) {
            const connectButton = getConnectButton( id );

            if ( connectButton ) {
                config.scope = connectButton.button.getAttribute( 'scope' ) || CLIENT_CONFIG.scope;
            }
        }

        Object.keys( CLIENT_CONFIG ).forEach( key => {
            if ( !( key in config ) ) {
                config[key] = CLIENT_CONFIG[key];
            }
        } );

        // Update login hint based on current config
        config.login_hint = createLoginHintFromConfig( config );
        return config;
    }

    function createConnectButtonIframeElement( connectButtonElement ) {
        const id = connectButtonElement.id || createRandom();

        let iframeElement = document.createElement( 'iframe' );
        iframeElement.height = '0px';
        iframeElement.width = '0px';

        // TODO: This is a quickfix - implement in a better way another time
        const scenarioID = UtilHelper.urlSearchToObj( window.location.search )['scenarioId'];
        let service = 'XID';

        switch ( scenarioID ) {
            case '1a':
            case '1b': {
                iframeElement.setAttribute( 'src', 'components/bid_connect_button.html' );
                service = 'BankID';
                break;
            }

            default:
                iframeElement.setAttribute( 'src', 'components/bid-xid_connect_button.html' );
        }

        iframeElement.setAttribute( 'frameborder', '0' );
        iframeElement.setAttribute( 'scrolling', 'no' );
        iframeElement.onload = () => doInitConnectButtonIframe( id, service );

        connectButtons[id] = {
            iframe: iframeElement,
            button: connectButtonElement,
            id,
        };

        return iframeElement;
    }

    function createButtonText( id ) {
        const connectButton = getConnectButton( id );
        return connectButton && connectButton.button.getAttribute( 'text' ) || 'Logg inn med xID';
    }

    function objectToURL( obj ) {
        return Object.keys( obj ).map( key => `${key}=${encodeURIComponent( obj[key] )}` ).join( '&' );
    }

    function onLoad() {
        doPolyfill();
        doReplaceConnectButton();
        doSendLoadedEvent();
    }

    function doPolyfill() {
        if ( !Array.from ) {
            Array.from = function ( object ) {
                return [].slice.call( object );
            };
        }

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

    function doSendLoadedEvent() {
        document.body.dispatchEvent( new window.CustomEvent( EVENT_CONSTANTS.LOADED_EVENT ) );
    }

    /**
     * @param {String} id
     * @param {Object} err
     * @param {BIDOIDCConnect.TokenResult|null} [tokenResult]
     */
    function doSendConnectEvent( id, err, tokenResult = null ) {
        let connectEvent = getConnectButton( id ) && getConnectButton( id ).button.getAttribute( 'xid-user' ) || 'xid-connect';

        document.body.dispatchEvent( new window.CustomEvent( connectEvent, {
            'detail': {
                id,
                err,
                accessToken: tokenResult && tokenResult.access_token
            }
        } ) );
    }

    /**
     * @param {String}id
     * @param {Object} err
     * @param {BIDOIDCConnect.UserInfo|null} [userInfo]
     */
    function doSendUserEvent( id, err, userInfo = null ) {
        let userEvent = getConnectButton( id ) && getConnectButton( id ).button.getAttribute( 'xid-user' ) || 'xid-user';

        document.body.dispatchEvent( new window.CustomEvent( userEvent, {
            'detail': {
                id,
                err,
                user: userInfo
            }
        } ) );
    }

    function doInitConnectButtonIframe( id, service ) {
        const connectButton = getConnectButton( id );

        if ( !connectButton ) {
            return;
        }

        // const connectEvent = connectButton.button.getAttribute( 'status-event' ) || 'xid-connect';
        // const type = connectButton.button.getAttribute( 'type' ) || 'login';
        // const scope = connectButton.button.getAttribute( 'scope' ) || CLIENT_CONFIG.scope;

        const config = createClientConfig( id );
        doSetConnectButtonIframeSize( connectButton.iframe );
        connectButton.iframe.contentWindow.postMessage( JSON.stringify( {
            type: 'init',
            data: {
                id: connectButton.id,
                text: createButtonText( id ) + service,
                authorizeUrl: createAuthorizeClientUrl( config ),
                method: CONFIG.method
            }
        } ), '*' );
        doHandleXidPostMessage( { element: connectButton.iframe.contentWindow, id: id, once: false, config: config } );
    }

    function doSetConnectButtonIframeSize( iframeElement ) {
        const height = Math.max( iframeElement.contentWindow.document.documentElement['clientHeight'],
            iframeElement.contentWindow.document.body['scrollHeight'],
            iframeElement.contentWindow.document.documentElement['scrollHeight'],
            iframeElement.contentWindow.document.body['offsetHeight'],
            iframeElement.contentWindow.document.documentElement['offsetHeight'] );
        const width = Math.max( iframeElement.contentWindow.document.documentElement['clientWidth'],
            iframeElement.contentWindow.document.body['scrollWidth'],
            iframeElement.contentWindow.document.documentElement['scrollWidth'],
            iframeElement.contentWindow.document.body['offsetWidth'],
            iframeElement.contentWindow.document.documentElement['offsetWidth'] );

        iframeElement.height = '';
        iframeElement.height = height + 'px';
        iframeElement.width = '';
        iframeElement.width = width + 'px';
    }

    /**
     *
     * @param element
     * @param loginWindow
     * @param id
     * @param callback
     * @param once
     * @param onActionCallback
     * @param inlineElement
     * @param xIdLoginModal
     * @param {BIDOIDCConnect.Configuration} config
     */
    function doHandleXidPostMessage( { element, loginWindow, id, callback, once, onActionCallback, inlineElement = null, xIdLoginModal = null, config = {} } ) {
        const connectButton = getConnectButton( id );

        function actionCallback( event ) {
            console.log( 'doHandleXidPostMessage', 'message', event );

            let data = {};
            try {
                data = JSON.parse( event.data ) || {};
            }
            catch ( e ) {
                // ignore
            }

            switch ( data.type ) {
                case 'click': {
                    doLogin( { id, isIgnoreWindow: true } );
                    break;
                }
                case 'oauth-action': {
                    // Show dialog if any other action than callback
                    if ( xIdLoginModal && data.action !== 'callback' ) {
                        xIdLoginModal.showDialog();
                    }

                    if ( onActionCallback ) {
                        onActionCallback( data.action );
                    }
                    break;
                }
                case 'xid-token': {
                    console.log( 'doToken', data );
                    if ( loginWindow ) {
                        loginWindow.close();
                    }
                    if ( xIdLoginModal ) {
                        xIdLoginModal.hideDialog();
                    }

                    if ( !callback && !!connectButton ) {
                        callback = ( err ) => {
                            if ( err ) {
                                doSendUserEvent( id, err );
                            }
                            else {
                                doGetUserInfo( ( err, user ) => doSendUserEvent( id, err, user || null ) );
                            }
                        };
                    }

                    if ( inlineElement ) {
                        // Reset inline element
                        inlineElement.innerHTML = '';
                    }

                    if ( data.error ) {
                        doLogout();
                        doSendConnectEvent( id, data.error );

                        if ( callback ) {
                            callback( { error: data.error } );
                        }
                    }
                    else {
                        doStoreUserAccessToken( data );
                        doSendConnectEvent( id, null, data );

                        if ( callback ) {
                            callback( null, data.params );
                        }
                    }
                    element.removeEventListener( 'message', actionCallback );
                    break;
                }
                case 'xid-error': {
                    if ( loginWindow ) {
                        loginWindow.close();
                    }
                    if ( xIdLoginModal ) {
                        xIdLoginModal.hideDialog();
                    }

                    console.error( 'Received error: ' + data.error );

                    if ( inlineElement ) {
                        // Reset inline element
                        inlineElement.innerHTML = '';
                    }

                    if ( callback ) {
                        callback( { error: data.error } );
                    }
                    element.removeEventListener( 'message', actionCallback );
                    break;
                }
                case 'xid-code': {
                    if ( loginWindow ) {
                        loginWindow.close();
                    }
                    if ( xIdLoginModal ) {
                        xIdLoginModal.hideDialog();
                    }

                    if ( !callback && !!connectButton ) {
                        callback = ( err ) => {
                            if ( err ) {
                                doSendUserEvent( id, err );
                            }
                            else {
                                doGetUserInfo( ( err, user ) => doSendUserEvent( id, err, user || null ) );
                            }
                        };
                    }

                    if ( inlineElement ) {
                        // Reset inline element
                        inlineElement.innerHTML = '';
                    }

                    if ( config.response_type === 'code' ) {
                        doAuthenticateCode( id, data.code, callback );
                    }
                    element.removeEventListener( 'message', actionCallback );
                    break;
                }
            }
        }

        element.addEventListener( 'message', actionCallback, false );
    }

    function doReplaceConnectButton() {
        const connectButtonElements = Array.from( document.querySelectorAll( 'xid\\:connect-button' ) );

        connectButtonElements.forEach( connectButtonElement => {
            const connectButtonIframeElement = createConnectButtonIframeElement( connectButtonElement );
            connectButtonElement.parentNode.replaceChild( connectButtonIframeElement, connectButtonElement );
        } );
    }

    /**
     * @param {String} url
     * @param {Object} data
     * @param {Function} callback
     * @param {Object} headers
     */
    function doAjax( url, data, callback, headers ) {
        const dataForm = objectToURL( data );

        const xhr = new window.XMLHttpRequest();
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

        xhr.open( 'POST', url );
        for ( const header in headers ) {
            if ( headers.hasOwnProperty( header ) ) {
                xhr.setRequestHeader( header, headers[header] );
            }
        }
        xhr.setRequestHeader( 'Content-Type', 'application/x-www-form-urlencoded' );
        xhr.send( dataForm );
    }

    /**
     * @param {BIDOIDCConnect.TokenResult} tokenResult
     */
    function doStoreUserAccessToken( tokenResult ) {
        window.sessionStorage.setItem( CONFIG.storage_key_access, [tokenResult.access_token, tokenResult.token_type].join( ';' ) );
    }

    function doAuthenticateCode( id, code, callback ) {
        doAjax( CLIENT_CONFIG.token_endpoint, {
            'client_id': CLIENT_CONFIG.client_id,
            'grant_type': CONFIG.grant_type,
            'code': code,
            'redirect_uri': CLIENT_CONFIG.redirect_uri
        }, ( err, result ) => {
            if ( err ) {
                doLogout();
                doSendConnectEvent( id, err );

                if ( callback ) {
                    callback( err );
                }
            }
            else {
                if ( result['error'] ) {
                    doLogout();
                    doSendConnectEvent( id, result['error'] );

                    if ( callback ) {
                        callback( { error: result['error'] } );
                    }
                }
                else {
                    doStoreUserAccessToken( result );
                    doSendConnectEvent( id, null, result );

                    if ( callback ) {
                        callback( null, result );
                    }
                }
            }
        } );
    }

    function createAuthorizeClientUrl( clientConfig ) {
        const objectUrl = objectToURL( clientConfig );
        return `${CONFIG.endpoint}?${objectUrl}`;
    }

    /**
     * Public doConnect API function for starting a xID login session.
     * @param {Function} [callback]
     * @param {BIDOIDCConnect.Configuration} [config]
     * @param {Function} [onActionCallback]
     * @param {Function} [inlineOnLoadCallback]
     * @param {HTMLElement} [inlineElementID]
     * @param {Boolean} [inlineModalWindow]
     */
    function doConnect( { callback, config, onActionCallback, inlineOnLoadCallback, inlineElementID, inlineModalWindow } ) {
        _doConnect( {
            callback: callback,
            config: config,
            onActionCallback: onActionCallback,
            inlineElementID: inlineElementID,
            inlineOnLoadCallback: inlineOnLoadCallback,
            inlineModalWindow: inlineModalWindow
        } );
    }

    /**
     * Perform doConnect to xID with configuration.
     * @param {Function} [callback]
     * @param {BIDOIDCConnect.Configuration} [config]
     * @param {Function} [inlineOnLoadCallback]
     * @param {Function} [onActionCallback]
     * @param {String} id
     * @param {String} inlineElementID
     * @param {Boolean} [isIgnoreWindow]
     * @param {Boolean} [inlineModalWindow]
     * @private
     */
    function _doConnect( { callback, config, id, inlineElementID, inlineOnLoadCallback, onActionCallback, isIgnoreWindow, inlineModalWindow } ) {
        if ( !callback ) {
            return console.error( 'doConnect missing callback' );
        }

        if ( isConnected() ) {
            callback( null, true );
            return;
        }

        const clientConfig = createClientConfig( id, config );
        console.log( 'doConnect', clientConfig );
        const authorizeUrl = createAuthorizeClientUrl( clientConfig );

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

                    doHandleXidPostMessage( {
                        element: context,
                        loginWindow: loginWindow,
                        id: id,
                        callback: callback,
                        once: false,
                        onActionCallback: onActionCallback,
                        config: clientConfig
                    } );
                }
                break;
            }
            case 'redirect': {
                document.location.href = authorizeUrl;
                break;
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
                    console.error( `doConnect inlineElement ${inlineElementID} not found` );
                    return;
                }
                inlineElement.appendChild( iframeElement );

                let xIdLoginModal = null;
                if ( inlineModalWindow ) {
                    xIdLoginModal = new Dialog(
                        document.querySelector( `${Dialog.SELECTORS.DIALOG}[data-dialog=xid-login-modal]` ),
                        { isModal: true }
                    );
                    xIdLoginModal.initDialog();
                }

                doHandleXidPostMessage( {
                    element: context,
                    loginWindow: null,
                    id: id,
                    callback: callback,
                    once: false,
                    onActionCallback: onActionCallback,
                    inlineElement: inlineElement,
                    xIdLoginModal: xIdLoginModal,
                    config: clientConfig
                } );
                break;
            }
        }

    }

    function doLogin( { id, isIgnoreWindow = false } ) {
        console.log( 'doLogin', id );
        _doConnect( {
            callback: ( err ) => {
                if ( err ) {
                    doSendUserEvent( id, err );
                }
                else {
                    doGetUserInfo( ( err, user ) => doSendUserEvent( id, err, user || null ) );
                }
            },
            id: id,
            isIgnoreWindow: isIgnoreWindow
        } );
    }

    /**
     * @callback BIDOIDCConnect.GetUserInfoCallback
     * @param accessToken
     * @param tokenType
     * @param responseType
     * @memberOf BIDOIDCConnect
     */
    function doGetUserInfo( callback, accessToken = null, tokenType = null, responseType = 'code' ) {
        if ( !callback ) {
            return console.error( 'doGetUserInfo missing callback' );
        }

        if ( !isConnected() ) {
            callback( { error: 'User is not authorized' } );
            return;
        }

        let headers = {};
        let data = {};

        if ( !accessToken || !tokenType ) {
            const accessObject = getAccessObject();
            accessToken = accessObject.accessToken;
            tokenType = accessObject.tokenType;
        }

        if ( responseType === 'code' ) {
            data.access_token = accessToken;
            data.token_type = tokenType;
        } else if ( responseType === 'token' ) {
            headers.Authorization = `${tokenType} ${accessToken}`;
        }

        doAjax( CLIENT_CONFIG.userinfo_endpoint, data, ( err, result ) => {
            if ( err ) {
                doLogout();
                callback( err );
            }
            else {
                if ( result['error'] ) {
                    doLogout();
                    callback( { error: result['error'] } );
                }
                else {
                    callback( null, result );
                }
            }
        }, headers );
    }

    function doLogout() {
        console.log( 'doLogout' );
        window.sessionStorage.removeItem( CONFIG.storage_key_access );
    }

    /**
     * @param {BIDOIDCConnect.Configuration} config
     */
    function doInit( config ) {
        if ( !config ) {
            return console.error( ' doInit missing config object' );
        }

        CONFIG.endpoint = config.oauth_url || CONFIG.endpoint;
        CONFIG.grant_type = config.grant_type || CONFIG.grant_type;
        CONFIG.method = config.method || CONFIG.method;
        CONFIG.storage_key_access = 'xid-access' + '-' + config.client_id;

        if ( ['window', 'redirect', 'inline'].indexOf( CONFIG.method ) === -1 ) {
            return console.error( 'doInit bad method' );
        }

        if ( !config.hasOwnProperty( 'client_id' ) ) {
            return console.error( 'doInit missing client id' );
        }

        let initConfig = DEFAULT_CLIENT_CONFIG;
        Object.keys( config ).forEach( key => {
            initConfig[key] = config[key];
        } );

        CLIENT_CONFIG.client_id = initConfig.client_id;
        CLIENT_CONFIG.token_endpoint = initConfig.token_endpoint;
        CLIENT_CONFIG.userinfo_endpoint = initConfig.userinfo_endpoint;
        CLIENT_CONFIG.scope = initConfig.scope;
        CLIENT_CONFIG.response_mode = initConfig.response_mode;
        CLIENT_CONFIG.response_type = initConfig.response_type;
        CLIENT_CONFIG.redirect_uri = initConfig.redirect_uri;
        CLIENT_CONFIG.application_name = initConfig.application_name;
        CLIENT_CONFIG.state = initConfig.state;
        CLIENT_CONFIG.ui_locales = initConfig.ui_locales;
        CLIENT_CONFIG.acr_values = initConfig.acr_values;
        CLIENT_CONFIG.nonce = initConfig.nonce || createRandom();
        Object.assign( CLIENT_CONFIG, createClientConfig( CLIENT_CONFIG ) );
        console.log( 'doInit', CLIENT_CONFIG );
    }

    context.BID = {
        doConnect: doConnect,
        doInit: doInit,
        doLogout: doLogout,
        doGetUserInfo: doGetUserInfo
    };

    context.addEventListener( 'load', onLoad, false );
} )( window, Dialog );