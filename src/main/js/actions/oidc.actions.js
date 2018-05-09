import DomHelper from '../helper/dom-helper';
import CONFIG from '../config/connector.config';
import { writeSessionStorage, readSessionStorage } from '../helper/storage-helper';

import STORAGE_CONSTANTS from '../constants/storage.constants';

/**
 * Makes a GET request to the provided OpenID Configuration. Calls callback function when completed.
 *
 * @param url
 * @param callback
 * @private
 */
export function doGetOIDCConfig( url, callback ) {
    if ( url ) {
        if ( readSessionStorage( STORAGE_CONSTANTS.OIDC_CONFIG_AUTHORIZATION_ENDPOINT ) !== null ) {
            CONFIG.oauth_url = readSessionStorage( STORAGE_CONSTANTS.OIDC_CONFIG_AUTHORIZATION_ENDPOINT );
            callback();
        } else {
            DomHelper.doGet( url, ( err, data ) => {
                if ( err ) {
                    console.error( err );
                }

                if ( data && data.authorization_endpoint ) {
                    CONFIG.oauth_url = data.authorization_endpoint;
                    writeSessionStorage( STORAGE_CONSTANTS.OIDC_CONFIG_AUTHORIZATION_ENDPOINT, data.authorization_endpoint );
                }

                callback();
            } );
        }
    } else {
        callback();
    }
}