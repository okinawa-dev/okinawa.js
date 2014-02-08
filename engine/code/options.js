
Engine.Options = function()
{
	// Use requestAnimationFrame instead of SetTimeOut in the main game loop
	this.useAnimationFrame = false;

	// Draw smooth particles instead of pixel rectangles
	this.useSmoothParticles = false;

	// drawHelpers:
	this.drawBoundingBoxes = false;
	this.drawMaxRadius = false;
	this.drawCollisionRadius = false;
	this.drawOrigins = false;
	this.drawCenters = false;
	this.drawTrackers = false;

	// screenInfos
	this.showFps = false; // frames per second
	this.showStatistics = false; // num items, particles, effects, etc

	// Console inform
	this.outputPressedKeys = false;
	this.outputPressedCombos = false;

	// Show LogHandler info in the navigator console
	this.debugInConsole = true;
	// Redirect console info to a html element
	// Useful for mobile debug
	this.debugInHtml = false;
	this.debugFunctionNames = false;

	this.allowPause = true; // allow pausing the game pressing the P key
	this.allowHalt = false; // allow halting the engine pressing the escape key
	this.allowFForFps = false; // allow pressing F to show FPS on screen
	this.pauseOnWindowChange = false;
	this.avoidLeavingPage = false;

	// Show the language screen?
	this.useLanguageScreen = false;
	this.defaultLanguage = 'english';
}

Engine.Options.prototype.addOptions = function(opts) 
{	  
  // Merge engine options and local game options in a single object
  for (var attr in opts) { 
    this[attr] = opts[attr]; 
  }
}
