/**
 * @class ConnectorConfig
 */
class ConnectorConfig {

    constructor( { method, oauth_url, token_url, userinfo_url, grant_type } ) {
        this.method = method;
        this.oauth_url = oauth_url;
        this.token_url = token_url;
        this.userinfo_url = userinfo_url;
        this.grant_type = grant_type;
    }

}

export default ConnectorConfig;