BankID OIDC Connector v1.5.0
============================

BankID OIDC Connector v1.5.0 was released on September 14, 2018.

About
-----

BankID OIDC connector is a library for easy integration with BankID's OpenID Connect platform.

What's new
----------
- Support for new parameters to `OIDC.doInit` and `OIDC.doConnect` configuration object: sign_id, sign_txt, action, application_name
- Load the OIDC configuration on doInit to let merchants control when the GET request happens.
- `OIDC.doInit` now returns an optional Promise (if supported) that fires when `doInit` has completed.
- When building Authorization Endpoint URL, any empty parameters are filtered away.
- README with latest changes.
- The loaded event `oidc-connector-loaded` is no longer sent before OIDC config has been retrieved.
- Updated version of developer dependencies and build tools like gulp, webpack etc. with latest features and security fixes. 
- Removed experimental features such as `OIDC.doGetUserInfo` and auto-exchanging Authorization Code.
- Removed parameters `token_url` and `userinfo_url` from `OIDC.doInit` configuration object.

Installation
------------

See README.md

Documentation
-------------

Official documentation: https://confluence.bankidnorge.no/confluence/pdoidcl/technical-documentation/js-connector