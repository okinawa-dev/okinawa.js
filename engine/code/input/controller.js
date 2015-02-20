
Engine.INPUT.Controller = function()
{
  // Same as KEYBOARD, but with code:key ordering
  // Built in the initialize method
  this.inverseKeyboard = {};

  // Object with the keys pressed == true
  this.pressed = {};                           // { keyCode : true/false }
  this.lastPressed = [];                       // list of last pressed key codes
  this.lastPressedTime = new Date().getTime(); // Time when a key was pressed last time

  this.currentInputController = null;
}

Engine.INPUT.Controller.prototype.initialize = function() 
{
  // Build the inverseKeyboard
  for (var prop in Engine.INPUT.KEYS)
    if (Engine.INPUT.KEYS.hasOwnProperty(prop)) 
      this.inverseKeyboard[Engine.INPUT.KEYS[prop]] = prop;

  // Using document instead of window in the key-press events 
  // because old IEs did not implement them in the window object

  addEvent('keyup', document, function(event) { 
    engine.input.onKeyup(event); 
    // event.preventDefault();
  });

  addEvent('keydown', document, function(event) { 
    engine.input.onKeydown(event); 
    if (engine.options.preventDefaultKeyStrokes == true)
      event.preventDefault();
  });

  addEvent('blur', window, function(event) { 
    engine.input.resetKeys(); 
    // Pause the game when we change tab or window
    if (engine.options.pauseOnWindowChange) {
      engine.pauseGame();
    }
    // event.preventDefault();
  });

  // Capture touch events
  addEvent('touchstart', engine.core.canvas, function(event) {
    engine.input.onTouchStart(event);

    // So touch would work in Android browser
    if ( navigator.userAgent.match(/Android/i) )
        event.preventDefault();
    return false;
  });

  addEvent('touchmove', engine.core.canvas, function(event) {
    event.preventDefault();
    return false;
  });

  addEvent('touchend', engine.core.canvas, function(event) {
    event.preventDefault();
    return false;
  });

  // Capture click events
  addEvent('click', engine.core.canvas, function(event) {
    engine.input.onClickStart(event);
    return false;
  });

  // To avoid selections
  // document.onselectstart = function() { return false; }

  // addEvent('touchend', document, function(event) {
  //   event.preventDefault();
  // });

  // addEvent('touchmove', document, function(event) {
  //   event.preventDefault();
  //   return false;
  // });

}

Engine.INPUT.Controller.prototype.activate = function()
{
}

Engine.INPUT.Controller.prototype.getCurrentInputcontroller = function() 
{ 
  return this.currentInputController; 
}

Engine.INPUT.Controller.prototype.setCurrentInputController = function(controller)
{
  this.currentInputController = controller;
}

Engine.INPUT.Controller.prototype.isKeyPressed = function(keyCode) 
{
  return this.pressed[keyCode];
}

Engine.INPUT.Controller.prototype.onKeydown = function(event) 
{
  // Avoid multiple events when holding keys
  if (this.pressed[event.keyCode] == true)
    return;

  // The key is pressed
  this.pressed[event.keyCode] = true;

  // Add to the array of last pressed keys, and update times
  this.addLastPressed(event.keyCode);
}

Engine.INPUT.Controller.prototype.onKeyup = function(event) 
{
  delete this.pressed[event.keyCode];
}

Engine.INPUT.Controller.prototype.onTouchStart = function(event)
{
  // If the screen is being modified, ignore touch events for safety
  if (engine.device.isResizing == true)
    return;

  var position = new Engine.MATH.Point(event.touches[0].clientX, event.touches[0].clientY); // ontouchstart
  // var position = new Engine.MATH.Point(event.changedTouches[0].pageX, event.changedTouches[0].pageY); // ontouchend

  // Apply correction if the scroll has moved
  var scroll = engine.device.getGlobalScroll();

  position.x += scroll.x;
  position.y += scroll.y;

  // engine.logs.log('Engine.INPUT.Controller.onTouchStart', 'Touch in position: ' +position.x+' '+position.y);        

  if ((position.x < engine.device.canvasGlobalOffset.x) || (position.y < engine.device.canvasGlobalOffset.y) || 
      (position.x > engine.device.canvasGlobalOffset.x + engine.core.canvas.width) ||
      (position.y > engine.device.canvasGlobalOffset.y + engine.core.canvas.height))
  {
    // engine.logs.log('Engine.INPUT.Controller.onTouchStart', 'Touch outside the canvas, ignoring');   
    // engine.gui.get('console').addText('touch', 'Pos ' + position.x + ' ' + position.y); 
  }
  else
  {
    position.x -= engine.device.canvasGlobalOffset.x;
    position.y -= engine.device.canvasGlobalOffset.y;

    // engine.logs.log('Engine.INPUT.Controller.onTouchStart', 'Touch inside the canvas, got it!');
    // engine.gui.get('console').addText('touch', 'Pos ' + position.x + ' ' + position.y); 

    this.currentInputController.detectTouch(position);
  }
}

Engine.INPUT.Controller.prototype.onClickStart = function(event)
{
  // If the screen is being modified, ignore click events for safety
  if (engine.device.isResizing == true)
    return;

  var position = new Engine.MATH.Point(event.clientX, event.clientY); 

  // Apply correction if the scroll has moved
  var scroll = engine.device.getGlobalScroll();

  position.x += scroll.x;
  position.y += scroll.y;

  // engine.logs.log('Engine.INPUT.Controller.onTouchStart', 'Touch in position: ' +position.x+' '+position.y);        

  if ((position.x < engine.device.canvasGlobalOffset.x) || (position.y < engine.device.canvasGlobalOffset.y) || 
      (position.x > engine.device.canvasGlobalOffset.x + engine.core.canvas.width) ||
      (position.y > engine.device.canvasGlobalOffset.y + engine.core.canvas.height))
  {
    // engine.logs.log('Engine.INPUT.Controller.onTouchStart', 'Touch outside the canvas, ignoring');   
    // engine.gui.get('console').addText('touch', 'Pos ' + position.x + ' ' + position.y); 
  }
  else
  {
    position.x -= engine.device.canvasGlobalOffset.x;
    position.y -= engine.device.canvasGlobalOffset.y;

    // engine.logs.log('Engine.INPUT.Controller.onTouchStart', 'Touch inside the canvas, got it!');
    // engine.gui.get('console').addText('touch', 'Pos ' + position.x + ' ' + position.y); 

    this.currentInputController.detectClick(position);
  }
}

Engine.INPUT.Controller.prototype.resetKeys = function() 
{
  for(var key in this.pressed)
    this.pressed[key] = false;
}

Engine.INPUT.Controller.prototype.addLastPressed = function(keyCode)
{  
  // Inform to listening objects in the current scene
  this.currentInputController.informKeyPressed(keyCode);

  var now = new Date().getTime()

  // If a second has passed, clear the pressed keys list
  if (now - this.lastPressedTime > 1000)
    this.lastPressed = [];

  this.lastPressedTime = now;
  this.lastPressed.push(keyCode);

  // Only save last 10 elements 
  if (this.lastPressed.length > 10)
    this.lastPressed.shift();

  if (engine.options.outputPressedKeys == true)
    engine.logs.log('Input.addLastPressed', 'Pressed key: ' + this.inverseKeyboard[keyCode], now);

  // Inform combo performed to currentInputController if needed
  var whichCombo = this.currentInputController.detectCombo();

  if (whichCombo != null)
    this.currentInputController.informComboPerformed(whichCombo, now);
}

Engine.INPUT.Controller.prototype.getKeyFromCode = function(keyCode)
{
  return this.inverseKeyboard[keyCode];
}

Engine.INPUT.Controller.prototype.convertKeyToNumber = function(keyCode)
{
  switch(keyCode)
  {
    case Engine.INPUT.KEYS.NINE: 
      return 9;
    case Engine.INPUT.KEYS.EIGTH: 
      return 8;
    case Engine.INPUT.KEYS.SEVEN: 
      return 7;
    case Engine.INPUT.KEYS.SIX: 
      return 6;
    case Engine.INPUT.KEYS.FIVE: 
      return 5;
    case Engine.INPUT.KEYS.FOUR: 
      return 4;
    case Engine.INPUT.KEYS.THREE: 
      return 3;
    case Engine.INPUT.KEYS.TWO: 
      return 2;
    case Engine.INPUT.KEYS.ONE: 
      return 1;
    case Engine.INPUT.KEYS.ZERO: 
      return 0;
    default:
      break;
  }
  return -1;
}

Engine.INPUT.Controller.prototype.convertNumberToKey = function(number)
{
  switch(number)
  {
    case 9: 
      return Engine.INPUT.KEYS.NINE;
    case 8: 
      return Engine.INPUT.KEYS.EIGTH;
    case 7: 
      return Engine.INPUT.KEYS.SEVEN;
    case 6: 
      return Engine.INPUT.KEYS.SIX;
    case 5: 
      return Engine.INPUT.KEYS.FIVE;
    case 4: 
      return Engine.INPUT.KEYS.FOUR;
    case 3: 
      return Engine.INPUT.KEYS.THREE;
    case 2: 
      return Engine.INPUT.KEYS.TWO;
    case 1: 
      return Engine.INPUT.KEYS.ONE;
    case 0: 
      return Engine.INPUT.KEYS.ZERO;
    default:
      break;
  }
  return Engine.INPUT.KEYS.ZERO;
}

