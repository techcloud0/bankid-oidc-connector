# Changelog - BankID OIDC Connector

## [2.0.2] - 28.01.2022

### Updated
- Changed name of package author to BankID.

## [2.0.1] - 23.09.2019

### Updated
- Updated dependencies

## [2.0.0] - 08.05.2019

### Added
- Added npm script for building the OIDC connector.

### Updated
- Changed name of package author to Vipps.
- Updated dependencies and build tools (gulp, babel, webpack etc.) with latest features and security fixes.
- Updated Dockerfile to use Node.js 10.15.
- Development server host set to 0.0.0.0.
- Local gulp package is used for npm scripts.
- Updated README to use npm scripts in development section.

### Removed
- OIDC configuration is no longer fetched in `onload` event handler. Prevents potential conflict with `OIDC.doInit`.
- Removed unused code related to the development server.

## [1.5.0] - 14.09.2018

### Added
- Support for new parameters: sign_id, sign_txt, action, application_name
- `OIDC.doInit` now returns an optional Promise (if supported) that fires when `doInit` has completed.

### Updated
- When building Authorization Endpoint URL, any empty parameters are filtered away.
- README with latest changes.
- The loaded event `oidc-connector-loaded` is no longer sent before OIDC config has been retrieved.
- Updated version of developer dependencies and build tools like gulp, webpack etc. with latest features and security fixes. 

### Removed
- Removed experimental features such as `OIDC.doGetUserInfo` and auto-exchanging Authorization Code.
- Removed parameters `token_url` and `userinfo_url` from `OIDC.doInit` configuration object.

## [1.4.1] - 11.05.2018

### Updated
- Fetch new OIDC configuration if URL to configuration changes avoiding an issue where a built-in OIDC URL would not allow merchants to override it.
- Load the OIDC configuration on doInit to let merchants control when the GET request happens.


## [1.4.0] - 10.05.2018

### Added
- New parameter to doInit called oidc_url that is used to fetch the authorization endpoint (oauth_url) from an OpenID configuration.
- Usage of session storage to temporarily store retrieved authorization endpoint from OpenID configuration.
- Default URL to OpenID configuration is now built into the connector when served from BankID CDN.

### Updated
- The library now makes an automated GET request on load to retrieve authorization endpoint from an OpenID configuration (if oidc_url is given or built in).
- The login window name is now named 'BankIDOIDCConnectorLoginWindow'.

## [1.3.0] - 20.02.2018

### Added
- Default URL to Authorize Endpoint is now built into the connector.

### Updated
- No longer prints version to console log. It is now available via `OIDC.VERSION`.
- No longer requires passing `callback` to `doConnect` function.
- Fixed a problem with window focus in Safari on Mobile
- Improved README

### Removed
- Removed more unused code

## [1.2.0] - 29.01.2018

### Updated
- Development server now serves on HTTPS by default
- Improved README
- Revamped examples and location in source tree

## [1.1.1] - 24.01.2018

### Added
- Initial public release
- New examples
- Added links to documentation

## [1.1.0] - 18.01.2018

### Updated
- Library now attaches to window.OIDC instead of window.BID / window.XID

### Removed
- Clean dead and old code
- Removed legacy CSS files

## [1.0.4] - 22.11.2017

### Updated
- Fixed dist task to only build Javascript bundles

## [1.0.3] - 22.11.2017

### Updated
- Refactored login_hint parsing
- Fixed broken examples

## [1.0.2] - 10.10.2017

### Updated
- Fixed a problem with redirect method
- Streamlined the examples

## [1.0.1] - 06.10.2017

### Added
- Initial import
