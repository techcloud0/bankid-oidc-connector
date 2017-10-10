import STORAGE_CONSTANTS from '../constants/storage.constants';

/**
 * @class ConnectorConfig
 */
class ConnectorConfig {

    constructor( { method, oauth_url, token_url, userinfo_url, grant_type, devMode } ) {
        this.method = method;
        this.oauth_url = oauth_url;
        this.token_url = token_url;
        this.userinfo_url = userinfo_url;
        this.grant_type = grant_type;
        this.storage_key_access = STORAGE_CONSTANTS.STORAGE_KEY_ACCESS;
        this.devMode = devMode;
    }

}

export default ConnectorConfig;