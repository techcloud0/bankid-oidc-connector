export default {
    supportsTransitionEvent: ( () => {
        let t;
        let el = document.createElement( 'fakeelement' );
        let transitions = {
            'transition': 'transitionend',
            'OTransition': 'oTransitionEnd',
            'MozTransition': 'transitionend',
            'WebkitTransition': 'webkitTransitionEnd',
            'IETransition': 'MSAnimationEnd'
        };

        for ( t in transitions ) {
            if ( el.style[t] !== undefined ) {
                return transitions[t];
            }
        }

        return false;
    } )(),

    supportsAnimationEvent: ( () => {
        let t;
        let el = document.createElement( 'fakeelement' );
        let animations = {
            'animation': 'animationend',
            'OAnimation': 'oAnimationEnd',
            'MozAnimation': 'animationend',
            'WebkitAnimation': 'webkitAnimationEnd',
            'IEAnimation': 'MSAnimationEnd'
        };

        for ( t in animations ) {
            if ( el.style[t] !== undefined ) {
                return animations[t];
            }
        }

        return false;
    } )()
};