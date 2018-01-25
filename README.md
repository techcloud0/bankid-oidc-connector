# BankID OIDC Connector

The BankID OIDC Connector provides a Javascript API to easily integrate with the BankID OpenID Connect Platform.

## Documentation

Official [documentation](https://confluence.bankidnorge.no/confluence/pdoidcl) from OIDC Provider BankID.

## Usage

See example usage in `src/main/public/` or check out the [examples](https://confluence.bankidnorge.no/confluence/pdoidcl/js-connector/examples) page in the documentation.

If you want to build your own connector file, see [Development](#development).

## Development

A node server is used to host the connector and example pages.

### Requirements

- NodeJS 6+

### Install dependencies

```
npm install --global gulp-cli
npm install
```

### Run

```
gulp
```

A server will be hosted on [https://localhost:3000](https://localhost:3000) where you can view usage examples.

The connector is hosted at [https://localhost:3000/js/connector.bundle.js](https://localhost:3000/js/connector.bundle.js) 

### HTTPS

The BankID OIDC service only accepts `redirect_uri` on HTTPS which is why the node server defaults to HTTPS.

In order to enrich the server with certificate info or to disable HTTPS, you need to edit the `connect.server({...})` call in `tools/gulp/server.connector.gulp.js`

## Additional features

### Local proxy for Token/Userinfo exchange
 
The local development node server can act as a proxy to the Token and Userinfo endpoints when using the experimental
features in the OIDC Connector as [explained here](https://confluence.bankidnorge.no/confluence/pdoidcl/js-connector/back-end-implementation).

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

OpenID Connect specification:
http://openid.net/specs/openid-connect-core-1_0.html