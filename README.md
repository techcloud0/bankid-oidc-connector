# BankID OIDC Connector

The BankID OIDC Connector provides a Javascript API to easily integrate with the BankID OpenID Connect Platform.

## Documentation

See official [documentation](https://confluence.bankidnorge.no/confluence/pdoidcl/technical-documentation/js-connector) from OIDC Provider BankID.

## Usage

A simple example on how to connect to an OIDC provider like BankID:

```html
<html>
 <head>
   <script src="https://oidc.bankidapis.no/js-connect/v1/js/connector.bundle.min.js"></script>
   <script>
    function init() {
        OIDC.doInit({
            // URL to OIDC authorization_endpoint
            // TODO: Replace this with the correct URL. See official documentation.
            oauth_url: 'https://oidc-preprod.bankidapis.no/auth/realms/preprod/protocol/openid-connect/auth',
            // Merchant given client ID on the OIDC service
            // TODO: Replace this with your own!
            client_id: 'your_client_id',
            // Your callback URL that will receive the Authorization Grant response
            // TODO: Replace this with your own!
            redirect_uri: 'https://yourdomain.com/oidc/callback',
        });
    };
    init();
   </script>
  </head>
  <body>
    <button>Login</button>
    <script>
        document.querySelector('button').addEventListener('click', function() {
            OIDC.doConnect( {} );
        }, false);
    </script>
  </body>
</html>
```

* **NOTE: You need to replace `client_id` and `redirect_uri` with your own values.**
* By default, the OIDC connector will use redirect mode. Change `method` parameter to `window`, or `inline` for other modes.

### Login hint

You can for example use `login_hint` to select authentication method.

Specify it in the `doInit` call to apply it globally:
```javascript
OIDC.doInit( { login_hint: 'XID', ... } )
```

or, pass it in `doConnect` calls:
```javascript
OIDC.doConnect( { config: { login_hint: 'XID' } } )
```

Other parameters can be passed in this way, see [API Reference](https://confluence.bankidnorge.no/confluence/pdoidcl/technical-documentation/js-connector/api-reference) for more information.

See more examples under `src/main/public/` or check out the [examples](https://confluence.bankidnorge.no/confluence/pdoidcl/technical-documentation/js-connector/examples) page in the documentation.

## Development

A node server is used to host the connector and example pages. Gulp is used to build the connector and run the development server.

### Requirements

- NodeJS 6+

### Installation

```
npm install --global gulp-cli
npm install
```

### Run

```bash
gulp
```
This will watch for changes in `src/main/js` and a server will be hosted on [https://localhost:3000](https://localhost:3000) where you will find more examples.

The connector bundle is hosted at [https://localhost:3000/js/connector.bundle.js](https://localhost:3000/js/connector.bundle.js) 

### Build

If you want to build your own OIDC connector distribution:

```bash
gulp connector:dist
```

### HTTPS

The BankID OIDC service only accepts `redirect_uri` on HTTPS which is why the node server defaults to HTTPS.

In order to enrich the server with certificate info or to disable HTTPS, you need to edit the `connect.server({...})` call in `tools/gulp/server.connector.gulp.js`

## Additional features

### Local proxy for Token/Userinfo exchange
 
The local development node server can act as a proxy to the Token and Userinfo endpoints when using the experimental
features in the OIDC Connector as [explained here](https://confluence.bankidnorge.no/confluence/pdoidcl/technical-documentation/js-connector/back-end-implementation).

The provided node server has implemented the necessary backend features to make the Token and Userinfo calls on behalf of the OIDC connector
running on the client-side.

In order to use this feature with the development server, you need to do the following:

1. Create a new file in the root of the repository named `config.custom.json` .
2. Add configuration for:
    * `client_secret`: the client_secret for your client_id on the OIDC Service
    * `tokenUrl`: URL to the Token Endpoint on the OIDC Service.
    * `userInfoUrl`: URL to the Userinfo Endpoint on the OIDC Service.
3. On your client-side OIDC Connector `OIDC.doInit({ .. })` call:
    * add `token_url` pointing to your development server. E.g. http://localhost:3000/oauth/token
    * add `userinfo_url` pointing to your development server. E.g. http://localhost:3000/oauth/userinfo.    
4. Restart your development server

## Additional reading

See [Release Notes](RELEASE-NOTES.md) for latest version and [Change Log](CHANGELOG.md) for release notes on all releases.

OpenID Connect specification:
http://openid.net/specs/openid-connect-core-1_0.html