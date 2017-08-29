const BASE = 'bid';

export default {
    BASE: BASE,
    ROOT: `.${BASE}`,
    MAIN: `.${BASE}__main`,

    VISIBLE: `${BASE}--visible`,

    HEADER: `.${BASE}__header`,
    HEADER_HEADLINE: `.${BASE}__header .${BASE}__title--headline`,

    DIALOG: `.${BASE}__dialog`,
    DIALOG_MAIN: `.${BASE}__dialog .${BASE}__dialog__main`,
    DIALOG_SECTION: `.${BASE}__dialog .${BASE}__dialog__section`,
    DIALOG_SECTION_CONTAINER: `.${BASE}__dialog .${BASE}__dialog__section__container`,
    DIALOG_HEADER: `.${BASE}__dialog .${BASE}__dialog__header`,
    DIALOG_HEADER_HEADLINE: `.${BASE}__dialog .${BASE}__dialog__header__headline`,
    DIALOG_CLOSE: `.${BASE}__dialog .${BASE}__dialog__close`,

    MENU_POPOVER: `.${BASE}__popover[data-popover=menu]`,
    MENU_BUTTON: `.${BASE}__button-icon__button[data-button=menu]`,

    CERTIFICATE_POPOVER: `.${BASE}__popover[data-popover=certificate]`,
    CERTIFICATE_BUTTON: `.${BASE}__button-icon__button[data-button=certificate]`,

    POPOVER_CLOSE: `.${BASE}__popover .${BASE}__popover__close`,
    POPOVER_CLOSE__BUTTON: `.${BASE}__popover .${BASE}__popover__close button`,

    CONTENT_HEADER_HEADLINE: `.${BASE}__content__header--headline`,
    LIST_ITEM: `ul.${BASE}__list li`,

    CONSENT_DENY_BUTTON: `.${BASE}__content--consent button[data-button=consent-deny]`,
    CONSENT_ALLOW_BUTTON: `.${BASE}__content--consent button[data-button=consent-allow]`,

    ENROLL_DENY_BUTTON: `.${BASE}__content--enroll button[data-button=enroll-deny]`,
    ENROLL_ALLOW_BUTTON: `.${BASE}__content--enroll button[data-button=enroll-allow]`,

    STEPUP_DENY_BUTTON: `.${BASE}__content--stepup button[data-button=stepup-deny]`,
    STEPUP_ALLOW_BUTTON: `.${BASE}__content--stepup button[data-button=stepup-allow]`,

    XID_LATER_DENY_BUTTON: `.${BASE}__content--later button[data-button=later-deny]`,
    XID_LATER_ALLOW_BUTTON: `.${BASE}__content--later button[data-button=later-allow]`,

    USAGE_DENY_BUTTON: `.${BASE}__content--usage button[data-button=usage-deny]`,
    USAGE_ALLOW_BUTTON: `.${BASE}__content--usage button[data-button=usage-allow]`,
    USAGE_CHANGE_USER_BUTTON: `.${BASE}__content--usage button[data-button=usage-change]`,
    USAGE_REMEMBER_ME_CHECKBOX: `.${BASE}__content--usage input[name=usage-remember]`,

    CALL_TO_ACTION_BUTTON: `.${BASE}__button-icon--call-to-action button[data-button=call-to-action]`,

    BUBBLE: `.${BASE}__bubble`
};