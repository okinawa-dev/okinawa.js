# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [2.0.2] - 2019-08-30

### Changed

- Fix with asset loading in url domains with directories (i.e. domain.com/something/game)

## [2.0.1] - 2019-08-27

### Changed

- Fix vulnerable dependency with eslint-utils.

## [2.0.0] - 2019-08-07

### Changed

- Code ported to current JavaScript standards (classes, import/export modules, etc)
- Linting now done with [eslint](https://github.com/eslint/eslint)
- [Font.js](https://github.com/Pomax/Font.js) lib updated to last version available
- Bundle building now done with [browserify](https://github.com/browserify/browserify) + [babelify](https://github.com/babel/babelify)

## [1.0.0] - 2019-07-30

After resuming work in the project, the architecture is going to change, so here it is the
original content of the readme file.

**readme.md contents when reaching version 1.0.0**

A simple javascript 2D game engine.

Current list of features:

- [x] Multiple scenes/levels
- [x] Each level with its own hierarchy of items on screen
- [x] Item positioning and rotation inside the hierarchy
- [x] Independent background collection attached to the scene (with parallax)
- [x] Image preloading
- [x] GUI elements (text, console, menus, windows/frames)
- [x] Css fonts rendering to images (only re-rendered when text changes)
- [x] Simple item behaviour attaching it to a tracker (bezier curves, circles, sine movement, follow)
- [x] Particle system
- [x] Input controller per scene (key events subscribing or checking key status in real time)
- [x] Input combos: consecutive or simultaneous keys
- [x] Basic touch controls for touch devices
- [x] Clock subcriptions to wait for certain events
- [x] Basic audio support

Tests (in separate projects):

- [Asteroids clone](https://github.com/neverbot/okinawa-asteroids)
  Test it in https://dev.neverbot.com/okinawa.js

To do:

- [ ] Better audio system
- [ ] Item collections in the scene (multiple layers of items)
- [ ] Upload more examples of how to use the engine
- [ ] A manual/tutorial would be useful, don't you think?

I started this just to learn something about javascript, so...

- Is the code orthodox? Maybe not, as I'm not used to most javascript coding conventions. Feel free to point anything you found or to improve it.
- Did I learn a lot? Sure I did.
- Does it work? Yes it does.

## [0.1.0] - 2014-02-18

- Initial commit... a long time ago, in a galaxy far, far away.

[2.0.2]: https://github.com/okinawa-dev/okinawa.js/releases/tag/2.0.2
[2.0.1]: https://github.com/okinawa-dev/okinawa.js/releases/tag/2.0.1
[2.0.0]: https://github.com/okinawa-dev/okinawa.js/releases/tag/2.0.0
[1.0.0]: https://github.com/okinawa-dev/okinawa.js/releases/tag/1.0.0
[0.1.0]: https://github.com/okinawa-dev/okinawa.js/releases/tag/0.1.0
