BankID OIDC Connector v1.4.0
============================

BankID OIDC Connector v1.4.0 was released on May 10, 2018.

About
-----

BankID OIDC connector is a library for easy integration with BankID's OpenID Connect platform.

What's new
----------

- New parameter to doInit called oidc_url that is used to fetch the authorization endpoint (oauth_url) from an OpenID configuration.
- Usage of session storage to temporarily store retrieved authorization endpoint from OpenID configuration.
- The library now makes an automated GET request on load to retrieve authorization endpoint from an OpenID configuration (if oidc_url is given or built in).
- Default URL to OpenID configuration is now built into the connector when served from BankID CDN.
- The login window name is now named 'BankIDOIDCConnectorLoginWindow'.

Installation
------------

See README.md

Documentation
-------------

Official documentation: https://confluence.bankidnorge.no/confluence/pdoidcl/technical-documentation/js-connector