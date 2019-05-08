BankID OIDC Connector v2.0.0
============================

BankID OIDC Connector v2.0.0 was released on May 8, 2019.

About
-----

BankID OIDC connector is a library for easy integration with BankID's OpenID Connect platform.

What's new
----------
- Added npm script for building the OIDC connector.
- Changed name of package author to Vipps.
- Updated dependencies and build tools (gulp, babel, webpack etc.) with latest features and security fixes.
- Updated Dockerfile to use Node.js 10.15.
- Development server host set to 0.0.0.0.
- Local gulp package is used for npm scripts.
- Updated README to use npm scripts in development section.
- OIDC configuration is no longer fetched in `onload` event handler. Prevents potential conflict with `OIDC.doInit`.
- Removed unused code related to the development server.

Installation
------------

See README.md

Documentation
-------------

Official documentation: https://confluence.bankidnorge.no/confluence/pdoidcl/technical-documentation/js-connector