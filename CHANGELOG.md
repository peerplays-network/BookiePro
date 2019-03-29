# Changelog

## [1.2.16] - 03-28-19

### Changed

- Fixed a bug that caused incorrect transaction history to be displayed.
- Fixed bets not appearing in the center pane when an event is in progress.
- Fixed a bug that caused all common message component messages to be removed when one is removed.
- Fixed a bug that prevented bet placing excpet on a certain portion of the bucket in the center pane.

### Added

- New subtotal for new bets being created.

## [1.2.15] - 11-27-18

### Changed

- Code optimizations and cleaning.
- Fixed a bug the prevented bets from being placed due to ID changes on the blockchain.
- When updating/editing a bet, the functionality has changed:
  - Given that I have placed a bet and it is unmatched, the existing part of my bet (BACK or LAY) is kept and a new bet is placed for the (new) excess amount.
  - Given that I have placed a bet and it is unmatched, the existing bet and the new excess to be displayed as separate bets in the Open Bets tab in the betslip.
  - Given that I have placed a bet and it is unmatched, the existing bet and the new excess to have different Bet Object ID numbers.
- Fixed a bug where the bet place loading animation did not persist until the bet had been successfully placed.

### Added

- Error message indicating to the user that they must completely fill out the betslip to place their bet(s).

## [1.2.13] - 10-25-18

### Changed

- Bug fixes.
- "Betslip" tab is now called "Place Bets".
- "Placed Bets" tab is now called "Open Bets".
- Betslip now defaults to the "Open Bets" tab.

### Added

- Common Message Module.
