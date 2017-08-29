import SelectorConstants from '../constants/selector.constants';

import DomHelper from '../helper/dom-helper';

export default class Dialog {
    static get SELECTORS() {
        return {
            VISIBLE: `${SelectorConstants.BASE}--visible`,
            DIALOG: `.${SelectorConstants.BASE}__dialog`,
            MAIN: `.${SelectorConstants.BASE}__dialog .${SelectorConstants.BASE}__dialog__main`,
            SECTION: `.${SelectorConstants.BASE}__dialog .${SelectorConstants.BASE}__dialog__section`,
            SECTION_CONTAINER: `.${SelectorConstants.BASE}__dialog .${SelectorConstants.BASE}__dialog__section__container`,
            HEADER: `.${SelectorConstants.BASE}__dialog .${SelectorConstants.BASE}__dialog__header`,
            HEADER_HEADLINE: `.${SelectorConstants.BASE}__dialog .${SelectorConstants.BASE}__dialog__header__headline`,
            CLOSE: `.${SelectorConstants.BASE}__dialog .${SelectorConstants.BASE}__dialog__close`,
        };
    }

    /**
     * @param {HTMLElement} dialogElement
     * @param {Object} [options]
     * @param {Function} [options.onShown]
     * @param {Function} [options.onHidden]
     * @param {Boolean} [options.isModal]
     */
    constructor( dialogElement, options = {} ) {
        this.dialogElement = dialogElement;
        this.dialogMainElement = null;
        this.options = options;

        // re-bind
        this.onGlobalEvent = this.onGlobalEvent.bind( this );
    }

    onGlobalEvent( event ) {
        const isCloseByMouse = event.type === 'click' && !this.dialogMainElement.contains( event.target ) && this.dialogMainElement !== event.target;
        const isCloseByKeyboard = event.which === 27; // ESC key
        const isCloseByMouseOrKeyboard = !this.options.isModal && (isCloseByMouse || isCloseByKeyboard);

        if ( isCloseByMouseOrKeyboard ) {
            setTimeout( this.hideDialog.bind( this ), 1 );
        }
    }

    initDialog() {
        this.dialogMainElement = this.dialogElement.querySelector( Dialog.SELECTORS.MAIN );
        const closeButtonElement = this.dialogElement.querySelector( `${Dialog.SELECTORS.CLOSE} button` );

        if ( closeButtonElement ) {
            closeButtonElement.addEventListener( 'click', this.hideDialog.bind( this ), false );
        }
    }

    /**
     * @param {String} [contentText]
     */
    showDialog( contentText ) {
        if ( contentText ) {
            this.dialogElement.querySelector( Dialog.SELECTORS.SECTION_CONTAINER ).innerHTML = contentText;
        }

        this.doSetDialogMaxHeight();

        DomHelper.addAnimationClass( this.dialogElement, Dialog.SELECTORS.VISIBLE ).then( () => {
            document.querySelector( 'body' ).addEventListener( 'click', this.onGlobalEvent, false );
            document.querySelector( 'body' ).addEventListener( 'keyup', this.onGlobalEvent, false );

            const headlineElement = this.dialogElement.querySelector( Dialog.SELECTORS.HEADER_HEADLINE );
            if ( headlineElement ) {
                headlineElement.focus();
            }
            else {
                this.dialogElement.querySelector( Dialog.SELECTORS.MAIN ).focus();
            }
        } );

        if ( this.options.onShown ) {
            this.options.onShown();
        }
    }

    hideDialog() {
        document.querySelector( 'body' ).removeEventListener( 'click', this.onGlobalEvent );
        document.querySelector( 'body' ).removeEventListener( 'keyup', this.onGlobalEvent );

        DomHelper.addAnimationClass( this.dialogElement, 'hide' )
            .then( () => {
                this.dialogElement.classList.remove( 'hide' );
                this.dialogElement.classList.remove( Dialog.SELECTORS.VISIBLE );

                if ( this.options.onHidden ) {
                    this.options.onHidden();
                }
            } );
    }

    doSetDialogMaxHeight() {
        const dialogSectionElement = this.dialogElement.querySelector( Dialog.SELECTORS.SECTION );
        const dialogSectionContainerElement = this.dialogElement.querySelector( Dialog.SELECTORS.SECTION_CONTAINER );
        const dialogHeaderElement = this.dialogElement.querySelector( Dialog.SELECTORS.HEADER );

        let bodyElement = DomHelper.findParentBySelector( this.dialogElement, '.bid' );
        let dialogHeaderHeight = 0;

        if ( !bodyElement ) {
            bodyElement = document.documentElement;
        }

        if ( dialogHeaderElement ) {
            dialogHeaderHeight = parseFloat( window.getComputedStyle( dialogHeaderElement, null ).getPropertyValue( 'line-height' ) );
        }

        const clientHeight = Math.max( bodyElement.scrollHeight, bodyElement.offsetHeight, bodyElement.scrollHeight, bodyElement.clientHeight );
        const dialogSectionPadding = parseFloat( window.getComputedStyle( dialogSectionContainerElement, null ).getPropertyValue( 'padding-top' ) );

        dialogSectionElement.style.maxHeight = `${Math.round( clientHeight - dialogHeaderHeight - dialogSectionPadding )}px`;
    }
}