Okinawa
=======

A simple javascript 2D game engine. Test it on http://dev.neverbot.com/okinawa

Current list of features:
 * Multiple scenes/levels
 * Each level with its own hierarchy of items on screen
 * Item positioning and rotation inside the hierarchy
 * Independent background collection attached to the scene (with parallax)
 * Image preloading
 * GUI elements (text, console, menus, windows/frames)
 * Css fonts rendering to images (only re-rendered when text changes)
 * Simple item behaviour attaching it to a tracker (bezier curves, circles, sine movement, follow)
 * Particle system
 * Input controller per scene (key events subscribing or checking key status in real time)
 * Input combos: consecutive or simultaneous keys
 * Basic touch controls for touch devices
 * Clock subcriptions to wait for certain events
 * Basic audio support

Tests included
 * Asteroids clone
   + Execute the `test-asteroids/tools/build.sh` script and the game will be built inside `test-asteroids/build`, ready to be tested
   
To do:
 * Better audio system
 * Item collections in the scene (multiple layers of items)
 * Upload more examples of how to use the engine
 * A manual/tutorial would be useful, don't you think?

I started this just to learn something about javascript, so...
 * Is the code orthodox? Maybe not, as I'm not used to most javascript coding conventions. Feel free to point anything you found or to improve it.
 * Did I learn a lot? Sure I did.
 * Does it work? Yes it does.
