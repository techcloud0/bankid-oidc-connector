# BankID OIDC Connector

The BankID OIDC Connector provides a Javascript API to easily integrate with the BankID OpenID Connect platform.

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
            // Merchant given client ID on the OIDC service
            // TODO: Replace this with your own!
            client_id: 'your_client_id',
            // Your callback URL that will receive the Authorization Grant response
            // TODO: Replace this with your own!
            redirect_uri: 'https://yourdomain.com/oidc/callback',
        });
    }
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

* **NOTE: You need to replace `client_id` and `redirect_uri` with your own values as given by the OpenID Connect provider.**
* By default, the OIDC connector will use redirect UI mode when triggered. Change `method` parameter to `window`, or `inline` for other modes.
* You can override the authorization_endpoint that is opened by providing `oauth_url` to `OIDC.doInit( { oauth_url: '', ... } )` configuration object.

### Load Asynchronously

```html
<html>
  <body>
    <button disabled>Login</button>
    <script>
    function onOIDCLoaded() {
        OIDC.doInit({
            // Merchant given client ID on the OIDC service
            // TODO: Replace this with your own!
            client_id: 'your_client_id',
            // Your callback URL that will receive the Authorization Grant response
            // TODO: Replace this with your own!
            redirect_uri: 'https://yourdomain.com/oidc/callback',
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
    <script src="https://oidc.bankidapis.no/js-connect/v1/js/connector.bundle.min.js" async defer></script>
  </body>
</html>
```

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

## Additional reading

See [Release Notes](RELEASE-NOTES.md) for latest version and [Change Log](CHANGELOG.md) for release notes on all releases.

OpenID Connect specification:
http://openid.net/specs/openid-connect-core-1_0.html