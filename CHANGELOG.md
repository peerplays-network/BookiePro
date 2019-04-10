# Change Log

All notable changes to this project will be documented in this file. See [standard-version](https://github.com/conventional-changelog/standard-version) for commit guidelines.

<a name="0.5.0"></a>
# [0.5.0](https://github.com/peerplays-network/peerplays-core-gui/compare/v0.4.3...v0.5.0) (2019-04-09)


### Bug Fixes

* fixed merge conflicts ([cc63ce3](https://github.com/peerplays-network/peerplays-core-gui/commit/cc63ce3))


### build

* move electron build in-repo ([61d2119](https://github.com/peerplays-network/peerplays-core-gui/commit/61d2119))


### Chores

* merge WAL-134 ([3cef1f6](https://github.com/peerplays-network/peerplays-core-gui/commit/3cef1f6))


### BREAKING CHANGES

* build process has changed. building executables not working yet
* electron upgrade and many file/script modifications


<a name="0.4.4"></a>
## [0.4.4](https://github.com/peerplays-network/peerplays-core-gui/compare/v0.4.5...v0.4.4) (2019-04-10)

### Changed

- Connect to nodes based on their latency.

<a name="0.4.3"></a>
## [0.4.3](https://github.com/peerplays-network/peerplays-core-gui/compare/v0.4.0...v0.4.3) (2019-04-05)

## [0.4.2-rc.1] - 03-28-19

### Changed

- Removed common option row from proposal confirmation modals.
- Resolved issues with vote tab hanging on load.
- Cleaned up some residue files in the repository.
- Login form allows full stops and dashes to ensure older bitshares generated accounts can login.

## [0.4.0] - 02-15-19

### Changed

- The fees list now shows fee amounts correctly (some were “-*”).
- Better error handling and error display when confirming a transaction.
- Prior users transaction history will no longer be displayed briefly to the different, newly logged in user.
- The header of the help modal will now be fixed to the top when scrolling the help modal content.
- The help modal now scrolls properly to allow visibility of entire help section.
- Update to the “How to claim PPY Tokens” link within the help modal.
- Sub-section links within the Help modal have been fixed.
- More logical error when signing up for accounts to indicate the requirements of an account name.
- Account name input fields no longer accept uppercase letters. Instead, they will be converted to lowercase on-the-fly.
- The Play tab has been removed.
- The codebase directory has been restructured better.
- The codebase has had thorough formatting made to improve code readability/maintainability for developers.

### Added

- Witnesses list now displays all registered witnesses, not just the active ones.
- Multiple Node Endpoint Support added.
- Common Message Module has been implemented.
