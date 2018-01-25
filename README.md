# BankID OIDC Connector

The BankID OIDC Connector provides a Javascript API to easily integrate with the BankID OpenID Connect Platform.

## Usage

Check out the [official documentation](https://confluence.bankidnorge.no/confluence/pdoidcl/js-connector).

## Examples

See the examples folder in `src/main/public/` or check out the [documentation](https://confluence.bankidnorge.no/confluence/pdoidcl/js-connector/examples).

## Development

A node server is used to host the connector and example pages, in addition to middlewares for special OAUTH handling.

### Requirements

- NodeJS 6+

### Install dependencies

```
npm install --global gulp-cli
npm install
```

### Configure development environment

Check `config.json` and create your own `config.custom.json` to override configuration.

### Build and run

```
gulp connector:dev
```

## Additional reading

Official [documentation](https://confluence.bankidnorge.no/confluence/pdoidcl) from OIDC Provider BankID.

OpenID Connect specification:
http://openid.net/specs/openid-connect-core-1_0.html