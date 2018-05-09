import DomHelper from '../helper/dom-helper';

/**
 * @class OIDCConfig
 */
class OIDCConfig {

    constructor( { redirect_uri, login_hint, response_mode, response_type, ui_locales, acr_values, nonce, state, id_token_hint, prompt, scope } ) {
        this.redirect_uri = redirect_uri;
        this.login_hint = login_hint;
        this.response_mode = response_mode;
        this.response_type = response_type;
        this.ui_locales = ui_locales;
        this.acr_values = acr_values;
        this.nonce = nonce;
        this.state = state;
        this.id_token_hint = id_token_hint;
        this.prompt = prompt;
        this.scope = scope;
    }

    update( { login_hint, id_token_hint, prompt, client_id, scope, response_mode, response_type, redirect_uri, state, ui_locales, acr_values, nonce } ) {
        this.login_hint = login_hint || this.login_hint;
        this.id_token_hint = id_token_hint || this.id_token_hint;
        this.prompt = prompt || this.prompt;
        this.client_id = client_id;
        this.scope = scope || this.scope;
        this.response_mode = response_mode || this.response_mode;
        this.response_type = response_type || this.response_type;
        this.redirect_uri = redirect_uri || this.redirect_uri;
        this.state = state || this.state;
        this.ui_locales = ui_locales || this.ui_locales;
        this.acr_values = acr_values || this.acr_values;
        this.nonce = nonce || this.nonce;
    }

}

export default new OIDCConfig( {
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