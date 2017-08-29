import FeaturesConstants from '../constants/features.constants';

/**
 * Ease in/out based on danro's jQuery plugin
 * https://github.com/danro/jquery-easing/blob/master/jquery.easing.js
 * @param time {Number} current time
 * @param startVal {Number} start value
 * @param changeInVal {Number} change in value
 * @param duration {Number} duration
 * @returns {Number}
 */
function easeInOutQuad( time, startVal, changeInVal, duration ) {
    let d2 = duration / 2;
    let t2 = time / d2;
    if ( t2 < 1 ) {
        return changeInVal / 2 * t2 * t2 + startVal;
    }
    t2--;
    return -changeInVal / 2 * ( t2 * ( t2 - 2 ) - 1 ) + startVal;
}

export default class DomHelper {
    /**
     * @param {HTMLElement} element
     * @param [options] {Object}
     * @param [options.duration] {Number} Duration in milliseconds. Defaults to 300.
     * @param [options.native] {Boolean} Use native behavior (no animation). Defaults to false.
     * @param [options.offset] {Number}
     * @param [options.alignToTop] {Boolean}
     *      If true, the top of the element will be aligned to the top of the visible area of the scrollable ancestor.
     *      If false, the bottom of the element will be aligned to the bottom of the visible area of the scrollable ancestor.
     */
    static scrollIntoView( element, options ) {
        options = options || {};

        function scrollTo( element, to, duration ) {
            const el = element;
            if ( !el ) {
                return;
            }
            const start = el.scrollTop;
            const change = Math.min( to, el.scrollHeight - el.offsetHeight ) - start;
            let currentTime = 0;
            const increment = 30;

            if ( change === 0 ) {
                return;
            }

            const animateScroll = function () {
                currentTime += increment;
                el.scrollTop = easeInOutQuad( currentTime, start, change, duration );

                if ( currentTime < duration ) {
                    setTimeout( animateScroll, increment );
                }
            };
            animateScroll();
        }

        function getScrollableParent() {
            let parent = element.parentNode;

            while ( parent ) {

                const currentStyle = ( window.getComputedStyle( parent ) || {} );
                const re = /auto|scroll/i;

                if ( re.test( currentStyle.overflow ) || re.test( currentStyle.overflowY ) ) {
                    return parent;
                } else {
                    parent = parent.parentNode;
                }
            }
            return document.body;
        }

        if ( options.native ) {
            return document.HTMLElement.prototype.scrollIntoView.call( element, options.alignToTop, options );
        }

        const el = element;
        const parent = getScrollableParent();
        let offsetEl = el;
        let top = 0;

        while ( offsetEl && offsetEl !== parent ) {
            top += offsetEl.offsetTop;
            offsetEl = offsetEl.offsetParent;
        }

        top -= options.offset || 0;

        if ( !options.alignToTop ) {
            top = top - parent.offsetHeight + el.offsetHeight;
        }

        scrollTo( parent, top, options.duration || 300 );
    }

    /**
     * @param {HTMLElement} elm
     * @param {String} selector
     * @return {Node|null} Null if not found
     */
    static findParentBySelector( elm, selector ) {
        function collectionHas( a, b ) {
            for ( let i = 0, len = a.length; i < len; i++ ) {
                if ( a[i] == b ) {
                    return true;
                }
            }
            return false;
        }

        const all = document.querySelectorAll( selector );
        let cur = elm.parentNode;
        while ( cur && !collectionHas( all, cur ) ) {
            cur = cur.parentNode;
        }
        return cur;
    }

    static loadImagePromise( src ) {
        return new Promise( ( fulfill ) => {
            const downloadingImage = new window.Image();
            downloadingImage.onload = fulfill;
            downloadingImage.onerror = fulfill;
            downloadingImage.src = src;
        } );
    }

    /**
     * @param {Boolean} isAdd
     * @param {HTMLElement} element
     * @param {String} className
     * @param {Number} [defDelay=250]
     * @return {Promise}
     */
    static toggleAnimationClass( isAdd, element, className, defDelay = 250 ) {
        const transitionEvent = FeaturesConstants.supportsTransitionEvent;
        const animationEvent = FeaturesConstants.supportsAnimationEvent;

        let timeoutPromise;
        let transitionPromise;
        let animationPromise;

        timeoutPromise = new Promise( fulfill => setTimeout( fulfill, defDelay ) );

        if ( transitionEvent && animationEvent ) {
            transitionPromise = new Promise( fulfill => element.addEventListener( transitionEvent, fulfill, false ) );
            animationPromise = new Promise( fulfill => element.addEventListener( animationEvent, fulfill, false ) );
        }

        if ( isAdd ) {
            element.classList.add( className );
        }
        else {
            element.classList.remove( className );
        }

        return Promise.race( [timeoutPromise, transitionPromise, animationPromise] );
    }

    /**
     * @param {HTMLElement} element
     * @param {String} className
     * @param {Number} [defDelay=250]
     * @return {Promise}
     */
    static addAnimationClass( element, className, defDelay = 250 ) {
        return DomHelper.toggleAnimationClass( true, element, className, defDelay );
    }

    /**
     * @param {HTMLElement} element
     * @param {String} className
     * @param {Number} [defDelay=250]
     * @return {Promise}
     */
    static removeAnimationClass( element, className, defDelay = 250 ) {
        return DomHelper.toggleAnimationClass( false, element, className, defDelay );
    }

    /**
     * Add multiple event listeners
     * @param el {HTMLElement}
     * @param ev {Array}
     * @param listener {Function}
     */
    static addListeners( el, ev, listener ) {
        for ( let i = 0; i < ev.length; i++ ) {
            el.addEventListener( ev[i], listener, false );
        }
    }

    /**
     * Add multiple eventlisteners
     * @param el {HTMLElement}
     * @param ev {Array}
     * @param listener {Function}
     */
    static removeListeners( el, ev, listener ) {
        for ( let i = 0; i < ev.length; i++ ) {
            el.removeEventListener( ev[i], listener, false );
        }
    }

    /**
     * @param {HTMLElement} containerElement
     * @param {Object} [options]
     * @param {Function} [options.onResized] Function(width, height)
     */
    static initResizeClient( containerElement, options = {} ) {
        /**
         * Get the client container
         * @type {HTMLElement}
         */
        let client = containerElement;

        // No client container?
        if ( !client ) {
            return;
        }

        /**
         * Get resize handle
         * @type {HTMLElement}
         */
        let resizer = client.querySelector( 'button' );

        // No resize handle?
        if ( !resizer ) {
            return;
        }

        DomHelper.addListeners( resizer, ['mousedown', 'touchstart'], initResize );

        /**
         * To prevent mouse/touch event to disappear into the iframe we need to cover by
         * adding this invisible container on top of the iframe
         * @type {Element}
         */
        const blocker = document.createElement( 'div' );
        blocker.className = 'blocker';
        //noinspection JSUndefinedPropertyAssignment
        blocker.show = function () {
            client.appendChild( blocker );
        };
        //noinspection JSUndefinedPropertyAssignment
        blocker.hide = function () {
            client.removeChild( blocker );
        };

        let start, docEl = document.querySelector( 'body' );

        /**
         * Start resize mode
         * @param e {Event}
         */
        function initResize( e ) {
            e.preventDefault();
            //noinspection JSUnresolvedFunction
            blocker.show();
            start = {
                x: ( e.pageX || e.clientX ),
                y: ( e.pageY || e.clientY ),
                w: parseInt( window.getComputedStyle( client, null ).width, 10 ),
                h: parseInt( window.getComputedStyle( client, null ).height, 10 )
            };
            DomHelper.addListeners( docEl, ['mousemove', 'touchmove'], doDrag );
            DomHelper.addListeners( docEl, ['mouseup', 'touchend'], stopDrag );
        }

        /**
         * Do resize on move
         * @param e {Event}
         */
        function doDrag( e ) {
            e.preventDefault();
            client.style.width = ( Math.round( ( start.w + ( ( e.pageX || e.clientX ) - start.x ) * 2 ) / 2 ) * 2 ) + 'px';
            client.style.height = ( Math.round( ( start.h + ( ( e.pageY || e.clientY ) - start.y ) * 2 ) / 2 ) * 2 ) + 'px';

            if ( options.onResized ) {
                options.onResized( parseInt( client.style.width ), parseInt( client.style.height ) );
            }
        }

        /**
         * End resize mode. Cleanup
         * @param e {Event}
         */
        function stopDrag( e ) {
            e.preventDefault();
            //noinspection JSUnresolvedFunction
            blocker.hide();
            DomHelper.removeListeners( docEl, ['mousemove', 'touchmove'], doDrag );
            DomHelper.removeListeners( docEl, ['mouseup', 'touchend'], stopDrag );
        }
    }

    /**
     * @param {HTMLElement} rootElement
     */
    static enableView( rootElement ) {
        Array.from( rootElement.querySelectorAll( 'button, input, a, [data-tabindex]' ) ).forEach( ( element ) => {
            if ( element.getAttribute( 'data-tabindex' ) ) {
                element.setAttribute( 'tabindex', element.getAttribute( 'data-tabindex' ) );
                element.removeAttribute( 'data-tabindex' );
            }
            else if ( element.tagName === 'A' ) {
                element.setAttribute( 'href', element.getAttribute( 'data-href' ) );
                element.removeAttribute( 'data-href' );
            }
            else {
                element.disabled = false;
            }
        } );
    }

    /**
     * @param {HTMLElement} rootElement
     */
    static disableView( rootElement ) {
        Array.from( rootElement.querySelectorAll( 'button, input, a, [tabindex]' ) ).forEach( ( element ) => {
            if ( element.getAttribute( 'tabindex' ) ) {
                element.setAttribute( 'data-tabindex', element.getAttribute( 'tabindex' ) );
                element.removeAttribute( 'tabindex' );
            }
            else if ( element.tagName === 'A' ) {
                element.setAttribute( 'data-href', element.getAttribute( 'href' ) );
                element.removeAttribute( 'href' );
            }
            else {
                element.disabled = true;
            }
        } );
    }

    /**
     * @param {HTMLElement} form
     * @returns {Object}
     */
    static formToObject( form ) {
        const result = {};
        if ( typeof form === 'object' && form.nodeName === 'FORM' ) {
            Array.from( form.elements ).forEach( function ( control ) {
                if ( control.name && !control.disabled && ['file', 'reset', 'submit', 'button'].indexOf( control.type ) === -1 && !control.getAttribute( 'data-ignore' ) ) {
                    if ( control.type === 'select-multiple' ) {
                        Array.from( control.options ).forEach( function ( option ) {
                            if ( option.selected ) {
                                result[control.name] = option.value;
                            }
                        } );
                    } else if ( ['checkbox', 'radio'].indexOf( control.type ) === -1 || control.checked ) {
                        const arrayMatch = control.name.match( /^([\w\-]+)\[([\w\-]+)]$/ );
                        const objectMatch = control.name.match( /^([\w\-]+)\.([\w\-]+)$/ );

                        if ( arrayMatch ) {
                            let [key, prop] = arrayMatch.slice( 1 );
                            if ( !result[key] ) {
                                result[key] = [{}];
                            }

                            if ( typeof result[key][result[key].length - 1][prop] !== 'undefined' ) {
                                result[key].push( {} );
                            }

                            result[key][result[key].length - 1][prop] = control.value;
                        }
                        else if ( objectMatch ) {
                            let [key, prop] = objectMatch.slice( 1 );
                            if ( !result[key] ) {
                                result[key] = {};
                            }

                            result[key][prop] = control.value;
                        }
                        else {
                            result[control.name] = control.value;
                        }
                    }
                }
            } );
        }
        return result;
    }

    static serializeObjectToUrl( obj ) {
        let arr = [];
        for ( let key in obj ) {
            arr.push( key + '=' + encodeURIComponent( obj[key] ) );
        }
        return arr.join( '&' );
    }

    /**
     * @param {String} path
     * @param {Object} params
     * @param {String} [method=post]
     */
    static submit( path, params, method = 'post' ) {
        const form = document.createElement( 'form' );
        form.setAttribute( 'method', method );
        form.setAttribute( 'action', path );

        for ( let key in params ) {
            if ( params.hasOwnProperty( key ) ) {
                let hiddenField = document.createElement( 'input' );
                hiddenField.setAttribute( 'type', 'hidden' );
                hiddenField.setAttribute( 'name', key );
                hiddenField.setAttribute( 'value', params[key] );

                form.appendChild( hiddenField );
            }
        }

        document.body.appendChild( form );
        form.submit();
    }

    /**
     * @returns {Boolean}
     */
    static isTouchDevice() {
        return 'ontouchstart' in window        // works on most browsers
            || window.navigator['maxTouchPoints'];       // works on IE10/11 and Surface
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
     * @param {Object|String} [data]
     * @param {DomHelper.AjaxCallback} callback
     * @param {String} method
     * @param {Boolean} json
     */
    static ajax( url, data, callback, method = 'GET', json = false ) {
        let contentType = 'application/x-www-form-urlencoded';
        if ( data && !json && typeof( data ) === 'object' ) {
            let y = '',
                e = encodeURIComponent;
            for ( let x in data ) {
                if ( data.hasOwnProperty( x ) ) {
                    y += '&' + e( x ) + '=' + e( data[x] );
                }
            }
            data = y.slice( 1 );
        } else if ( data && json && typeof( data ) === 'object' ) {
            data = JSON.stringify( data );
            contentType = 'application/json';
        }

        if ( data && method === 'GET' ) {
            method = 'POST';
        }

        try {
            const xhr = new ( window.XMLHttpRequest || window.ActiveXObject )( 'MSXML2.XMLHTTP.3.0' );
            xhr.open( method, url, 1 );
            xhr.withCredentials = true;
            // xhr.setRequestHeader( 'X-Requested-With', 'XMLHttpRequest' ); // TODO Removed because it sends an OPTION request before the request, is this needed? I think so for some servers.
            xhr.setRequestHeader( 'Content-type', contentType );
            xhr.onreadystatechange = function () {
                if ( xhr.readyState > 3 ) {
                    if ( xhr.status === 200 ) {
                        callback( null, xhr.responseText );
                    }
                    else {
                        callback( { message: xhr.responseText, error: xhr, code: xhr.status } );
                    }
                }
            };
            xhr.send( data );
        } catch ( e ) {
            callback( { error: e } );
        }
    }

    static openWindow( width, height, href ) {
        const left = ( window.screen.width / 2 )-( width/2 );
        const top = ( window.screen.height / 2 )-( height/2 );
        window.open( href, 'newwindow', `width=${width},height=${height},top=${top},left=${left}` );
    }
}