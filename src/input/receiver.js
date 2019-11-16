import engine from '../engine';
import { addEvent } from '../utils';
import { KEYS } from './input';
import * as MATH from '../math/math';

export default class Receiver {
  constructor() {
    // Same as KEYS, but with code:key ordering
    // Built in the initialize method
    this.inverseKeyboard = {};

    // Object with the keys pressed == true
    this.pressed = {}; // { keyCode : true/false }
    this.lastPressed = []; // list of last pressed key codes
    this.lastPressedTime = new Date().getTime(); // Time when a key was pressed last time

    this.currentInputController = null;
  }

  initialize() {
    // Build the inverseKeyboard
    for (let prop in KEYS)
      if (Object.prototype.hasOwnProperty.call(KEYS, prop)) {
        // if (KEYS.hasOwnProperty(prop)) {
        this.inverseKeyboard[KEYS[prop]] = prop;
      }

    // Using document instead of window in the key-press events
    // because old IEs did not implement them in the window object

    addEvent('keyup', document, (event) => {
      engine.input.onKeyup(event);
      // event.preventDefault();
    });

    addEvent('keydown', document, (event) => {
      engine.input.onKeydown(event);

      // don't trap keys if the focus is in a html input (outside the game canvas)
      if (engine.input.isTargetInput(event)) return;

      if (
        engine.options.preventDefaultKeyStrokes === true ||
        // delete or backspace
        event.keyCode == 8 ||
        event.keyCode == 46
      )
        event.preventDefault();
    });

    addEvent('blur', window, () => {
      engine.input.resetKeys();
      // Pause the game when we change tab or window
      if (engine.options.pauseOnWindowChange) {
        engine.pauseGame();
      }
      // event.preventDefault();
    });

    // Capture touch events
    addEvent('touchstart', engine.core.canvas, (event) => {
      engine.input.onClickStart(
        event.touches[0].clientX,
        event.touches[0].clientY
      );

      // So touch would work in Android browser
      if (navigator.userAgent.match(/Android/i)) {
        event.preventDefault();
      }
      return false;
    });

    addEvent('touchmove', engine.core.canvas, (event) => {
      event.preventDefault();
      return false;
    });

    addEvent('touchend', engine.core.canvas, (event) => {
      event.preventDefault();
      return false;
    });

    // Capture click events
    addEvent('click', engine.core.canvas, (event) => {
      engine.input.onClickStart(event.clientX, event.clientY);
      event.preventDefault();
      return false;
    });

    addEvent('mousedown', engine.core.canvas, (event) => {
      event.preventDefault();
      return false;
    });

    // To avoid selections
    // document.onselectstart = function() { return false; }
  }

  activate() {}

  getCurrentInputcontroller() {
    return this.currentInputController;
  }

  setCurrentInputController(controller) {
    this.currentInputController = controller;
  }

  isKeyPressed(keyCode) {
    return this.pressed[keyCode];
  }

  onKeydown(event) {
    // Avoid multiple events when holding keys
    if (this.pressed[event.keyCode] === true) {
      return;
    }

    // The key is pressed
    this.pressed[event.keyCode] = true;

    // Add to the array of last pressed keys, and update times
    this.addLastPressed(event.keyCode);
  }

  onKeyup(event) {
    delete this.pressed[event.keyCode];
  }

  onClickStart(x, y) {
    // If the screen is being modified, ignore touch events for safety
    if (engine.device.isResizing === true) {
      return;
    }

    let position = new MATH.Point(x, y);
    // let position = new MATH.Point(event.changedTouches[0].pageX, event.changedTouches[0].pageY); // ontouchend

    // Apply correction if the scroll has moved
    let scroll = engine.device.getGlobalScroll();

    position.x += scroll.x;
    position.y += scroll.y;

    // engine.logs.log('Engine.INPUT.Controller.onTouchStart', 'Touch in position: ' +position.x+' '+position.y);

    if (
      position.x < engine.device.canvasGlobalOffset.x ||
      position.y < engine.device.canvasGlobalOffset.y ||
      position.x >
        engine.device.canvasGlobalOffset.x + engine.core.canvas.width ||
      position.y >
        engine.device.canvasGlobalOffset.y + engine.core.canvas.height
    ) {
      // engine.logs.log('Engine.INPUT.Controller.onTouchStart', 'Touch outside the canvas, ignoring');
      // engine.gui.get('console').addText('touch', 'Pos ' + position.x + ' ' + position.y);
    } else {
      position.x -= engine.device.canvasGlobalOffset.x;
      position.y -= engine.device.canvasGlobalOffset.y;

      // engine.logs.log('Engine.INPUT.Controller.onTouchStart', 'Touch inside the canvas, got it!');
      // engine.gui.get('console').addText('touch', 'Pos ' + position.x + ' ' + position.y);

      this.currentInputController.detectClick(position);
    }
  }

  resetKeys() {
    for (var key in this.pressed) {
      this.pressed[key] = false;
    }
  }

  addLastPressed(keyCode) {
    // Inform to listening objects in the current scene
    this.currentInputController.informKeyPressed(keyCode);

    let now = new Date().getTime();

    // If a second has passed, clear the pressed keys list
    if (now - this.lastPressedTime > 1000) {
      this.lastPressed = [];
    }

    this.lastPressedTime = now;
    this.lastPressed.push(keyCode);

    // Only save last 10 elements
    if (this.lastPressed.length > 10) {
      this.lastPressed.shift();
    }

    if (engine.options.outputPressedKeys === true) {
      engine.logs.log(
        'Input.addLastPressed',
        'Pressed key: ' + this.inverseKeyboard[keyCode],
        now
      );
    }

    // Inform combo performed to currentInputController if needed
    let whichCombo = this.currentInputController.detectCombo();

    if (whichCombo !== null) {
      this.currentInputController.informComboPerformed(whichCombo, now);
    }
  }

  addClick(id) {
    this.currentInputController.informClick(id);

    if (engine.options.outputClicks === true) {
      engine.logs.log('Input.addClick', 'Click over: ' + id);
    }
  }

  getKeyFromCode(keyCode) {
    return this.inverseKeyboard[keyCode];
  }

  convertKeyToNumber(keyCode) {
    switch (keyCode) {
      case KEYS.NINE:
        return 9;
      case KEYS.EIGTH:
        return 8;
      case KEYS.SEVEN:
        return 7;
      case KEYS.SIX:
        return 6;
      case KEYS.FIVE:
        return 5;
      case KEYS.FOUR:
        return 4;
      case KEYS.THREE:
        return 3;
      case KEYS.TWO:
        return 2;
      case KEYS.ONE:
        return 1;
      case KEYS.ZERO:
        return 0;
      default:
        break;
    }

    return -1;
  }

  convertNumberToKey(number) {
    switch (number) {
      case 9:
        return KEYS.NINE;
      case 8:
        return KEYS.EIGTH;
      case 7:
        return KEYS.SEVEN;
      case 6:
        return KEYS.SIX;
      case 5:
        return KEYS.FIVE;
      case 4:
        return KEYS.FOUR;
      case 3:
        return KEYS.THREE;
      case 2:
        return KEYS.TWO;
      case 1:
        return KEYS.ONE;
      case 0:
        return KEYS.ZERO;
      default:
        break;
    }

    return KEYS.ZERO;
  }

  isTargetInput(event) {
    return (
      event.target.type == 'textarea' ||
      event.target.type == 'text' ||
      event.target.type == 'number' ||
      event.target.type == 'email' ||
      event.target.type == 'password' ||
      event.target.type == 'search' ||
      event.target.type == 'tel' ||
      event.target.type == 'url' ||
      event.target.isContentEditable
    );
  }
}
