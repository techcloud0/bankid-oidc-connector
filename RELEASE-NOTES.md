BankID OIDC Connector v1.4.1
============================

BankID OIDC Connector v1.4.1 was released on May 11, 2018.

About
-----

BankID OIDC connector is a library for easy integration with BankID's OpenID Connect platform.

What's new
----------

- Fetch new OIDC configuration if URL to configuration changes avoiding an issue where a built-in OIDC URL would not allow merchants to override it.
- Load the OIDC configuration on doInit to let merchants control when the GET request happens.

Installation
------------

See README.md

Documentation
-------------

Official documentation: https://confluence.bankidnorge.no/confluence/pdoidcl/technical-documentation/js-connector