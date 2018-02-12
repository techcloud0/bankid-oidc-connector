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

}

export default OIDCConfig;