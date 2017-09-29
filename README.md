# BankID OIDC Connector

THIS IS A WORK IN PROGRESS

## How do I use this
The BankID OIDC Connector is a helper library for interacting with the BankID OpenID Connect Platform - a simple identity layer on top of the OAuth 2.0 protocol.

## Usage

Check out the [API Documentation](https://confluence.bankidnorge.no/confluence/pages/viewpage.action?pageId=96831073).

## Examples

Check `src/main/public/examples/simple.html` for current usage.

## Development

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