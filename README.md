# BankID OIDC Connector

A tiny Javascript library that can simplify your client-side integration with OpenID Connect v1 authorization endpoints. 

This library works for any OpenID Connect Identity provider, but it is especially tailored for [BankID OIDC Provider](https://confluence.bankidnorge.no/confluence/pdoidcl/introduction).

## Usage

Here is a simple example on how to connect to BankID OIDC Provider by including the library directly in your application:

```html
<html lang="en">
  <body>
    <!-- Button is disabled until the Connector is ready to connect. -->
    <button disabled>Login</button>
    
    <script>
        /** This function will be called when Connector is ready. */
        function onOIDCLoaded() {
            OIDC.doInit({
                // Your client ID on the OIDC service (environment CURRENT)
                client_id: 'your_client_id',
                // Your callback URL that will receive the Authorization Grant response
                redirect_uri: 'https://example.org/oidc/callback',
            }).then( function() {
                var button = document.querySelector('button');
                button.addEventListener( 'click', function() {
                    OIDC.doConnect( {} );
                }, false);
                button.disabled = false;
            });
        }
    
        document.body.addEventListener( 'oidc-connector-loaded', onOIDCLoaded, false);
    </script>

    <!-- Loading Connector for environment CURRENT -->
    <script src="https://auth.current.bankid.no/js-connect/v2/js/connector.bundle.min.js" async defer></script>
  </body>
</html>
```

### Initialize required config

First we need to initialize the library with some minimal configuration - your application's `client_id` and `redirect_uri`.

```javascript
OIDC.doInit({
    client_id: 'your_client_id',
    redirect_uri: 'https://example.org/oidc/callback',
}).then(() => {
    console.log("OIDC Connector loaded!");
});
```

The URL to the authorization endpoint will be automatically determined by requesting the OIDC discovery endpoint depending on the environment. 
When this request has completed, `doInit` fulfills the promise.

### Start authentication

Now we are ready to start authentication. Typically, you do this in response to a user action such as button clicks.

```javascript
OIDC.doConnect();
```

This will redirect the browser to the authorization endpoint.

### Additional options

#### Change authorization endpoint

You can override it to point to a custom endpoint by providing the `oauth_url` option:

```javascript
OIDC.doInit( {
    client_id: 'your_client_id',
    redirect_uri: 'https://example.org/oidc/callback',
    oauth_url: 'https://auth.example.org/oidc/authenticate'
} );
```

#### Window integration method

The OIDC connector will redirect the user by default. Change `method` parameter to `window` to open a popup instead.

```javascript
OIDC.doConnect( {
    config: {
        method: 'window'
    }
} );
```

Remember to only call this in the context of a user action to avoid native popup blockers.

#### Login hint

You can for example use `login_hint` to pre-select authentication method.

Specify it in the `OIDC.doInit` call to apply it globally:
```javascript
OIDC.doInit( {
    login_hint: 'BID',
} );
```

or, pass it in `OIDC.doConnect` calls:
```javascript
OIDC.doConnect( {
    config: {
        login_hint: 'BID'
    }
} );
```

Other parameters can be passed in this way, see [API Reference](#api-reference) for more information.

See more examples under [src/main/public/](./src/main/public), including an example of how you can communicate with the Connector from your callback page (redirect_uri) when using methods `window` or `inline`. Then you can trigger your callback function given to `OIDC.doConnect` via [events](#events).

## API Reference

### Methods

#### OIDC.doInit( { } )
Sets the global configuration used for any doConnect calls.


| Parameter        | Description           | Default  | Required  | 
| ------------- |-------------|-----|-----|
| client_id      | Unique ID (arbitrary string) for the OIDC Client in question. This is created as part of the provisioning process. |  | Yes |
| redirect_uri      |       |    | Yes |
| oauth_url | Absolute URL to the OIDC Authorize endpoint.     |   (default authorize endpoint) | No. The OIDC Connector determines the correct URL value via the output from oidc_url |
| oidc_url | Absolute URL to the OIDC Openid-configuration endpoint.     |   (default .well-known endpoint) | No. The OIDC Connector embeds the correct URL value|
| scope | Absolute URL to the OIDC Authorize endpoint.     |   'openid' |  |
| method | Integration method. One of redirect, window or inline.     |   'redirect' | |
| response_type | Determines the message flow to be used, thus also governing the content and type of the response from the Authorize endpoint.      |   'code' | |
| response_mode | The response mode to be used for returning parameters from the Authorization Endpoint via redirect_uri.     |   'query' | |
| prompt | Support for the standardized values none and login. The former can be used to check for an existing (still valid) authentication session with the OIDC provider.     |   | |
| acr | Requests use of specific Identity provider (IDP), or any IDP at a given Level of Assurance (Authentication Context Class Reference) or above.     |   4 | |
| login_hint | his parameter may be used to specify the use of any particularly named IDP along with any pre-configuration for the designated IDP. For example: 'BID'   |    | |
| state | Opaque value used to maintain state between the request and the callback.      |   'untouched'  | |
| nonce | String value used to associate a ODIC Client session with an ID Token, and to mitigate replay attacks. The value is passed through unmodified from the Authentication Request to the ID Token     |    | |
| ui_locales | May be used to set a language preference for GUI handling. BankID OIDC supports 'nb' (Norsk Bokmål) and 'en' (English).    |   'nb' | |
| id_token_hint | JWT value for an ID Token previously issued by the OIDC Provider used as a hint about the enduser's authenticated session with the OIDC provider.    |    | |
| sign_id | Related to document signing [feature](https://confluence.bankidnorge.no/confluence/pdoidcl/technical-documentation/value-added-services/document-and-text-signing) of BankID OIDC. ID to identity a document signing session.     |    | |
| sign_txt | Related to document signing [feature](https://confluence.bankidnorge.no/confluence/pdoidcl/technical-documentation/value-added-services/document-and-text-signing) of BankID OIDC. Simple text to be signed.    |    | |

The `OIDC.doInit` optionally returns a Promise object if Promise is supported by the browser.

For increased security in a production environment, it is highly encouraged to use nonce and state parameters when interacting with the OIDC service.

#### OIDC.doConnect ( { callback: function(err, data), config: { }, inlineOnLoadCallback: function(), inlineElementID: ".." } )

Start authentication session with parameters given in an object of key-value pairs.


| Parameter        | Description           | Default  | Required  | 
| ------------- |-------------|-----|-----|
| callback      | Function callback that is called when JS Connector receives XDM events. Arguments are: (err, data) | null |  |
| config      |     An object with key-value pairs of configuration parameters can be given that can override any parameters given in doInit.  |  {}  |  |
| inlineOnLoadCallback | Specify a callback function that will attach to the onload event for the injected iframe when using inline method.   |   null | |
| inlineElementID | A string containing the ID of a DOM element that will have the OIDC login iframe injected into.   |   null | Required when using inline method |

The `OIDC.doConnect` method returns a reference to the window object if `method` is `window` or the iframe element if `method` is `inline`.


### Events

The following custom events are relevant for the JS Connector.

#### When Connector has loaded

| Name        | Description  | 
| ------------- |-------------|
| oidc-connector-loaded      | Triggered on `document.body` element when JS Connect is loaded and ready to be used |

#### To communicate with Connector from popup/iframe

When using method window or inline, you can use [postMessage](https://developer.mozilla.org/en-US/docs/Web/API/Window/postMessage) API in your callback page (`redirect_uri`).

This way you can trigger the following types of messages to seamlessly integrate with the JS Connector on the parent page:

| Type        | When  | Example code on callback page |
| ------------- |-------------|-------|
| oidc-connector-response-data      | Will cause callback given to `doConnect` to be fired.  | `windowParent.postMessage( JSON.stringify( { type: 'oidc-connector-response-data', data: {} } ), '*' );` |
| oidc-connector-error      | Authentication error, provides optional error information.  | `windowParent.postMessage( JSON.stringify( { type: 'oidc-connector-error', error: "Some error" } ), '*' );` |

## Additional reading

See also official [documentation](https://confluence.bankidnorge.no/confluence/pdoidcl/technical-documentation/js-connector) from OIDC Provider BankID.

See [Release Notes](RELEASE-NOTES.md) for latest version and [Change Log](CHANGELOG.md) for release notes on all releases.

OpenID Connect specification:
http://openid.net/specs/openid-connect-core-1_0.html

## Development

A node server is used to host the connector and example pages. Gulp is used to build the connector and run the development server.

### Requirements

- NodeJS 10+

### Installation

```
npm install
```

### Run

```bash
npm start
```
This will watch for changes in `src/main/js` and a server will be hosted on [https://localhost:3000](https://localhost:3000) where you will find more examples.

The connector bundle is hosted at [https://localhost:3000/js/connector.bundle.js](https://localhost:3000/js/connector.bundle.js) 

### Build

If you want to build your own OIDC connector distribution:

```bash
npm run build
```

### HTTPS

The BankID OIDC service only accepts `redirect_uri` on HTTPS which is why the node server defaults to HTTPS.

In order to enrich the server with certificate info or to disable HTTPS, you need to edit the `connect.server({...})` call in `tools/gulp/server.connector.gulp.js`
