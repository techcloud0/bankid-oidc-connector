# BankID OIDC Connector v1.0.2

## How do I use this
The BankID OIDC Connector is a helper library for interacting with the BankID OpenID Connect Platform - a simple identity layer on top of the OAuth 2.0 protocol.

## Usage

Check out the [official documentation](https://confluence.bankidnorge.no/confluence/pages/viewpage.action?pageId=96831073).

## Examples

Check `src/main/public/examples/simple.html` for current usage.

## Development

For development, a node server is used to host the connector and example pages, in addition to middlewares for OAUTH handling.

### Requirements

- NodeJS 6+

### Install dependencies

```
npm install
```

### Configure development environment

Check `config.json` and create your own `config.custom.json` to override configuration.

### Build and run

```
gulp connector:dev
```

## Additional reading
OpenID Connect supports three different flows
* Authorization Code Flow
* Implicit Flow
* Hybrid Flow

Each of these flows fits a certain kind of use. Here is a good resource explaining what properties each flow supports (helps you determine what flow to select for each use case).
http://openid.net/specs/openid-connect-core-1_0.html#Authentication