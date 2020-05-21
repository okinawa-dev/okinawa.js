import engine from '../engine';
import { KEYS, COMBO_TYPES } from './input';

export default class Controller {
  constructor() {
    // List of combos to detect
    // Combos will be defined in the form
    // combos[comboName] = { comboType: type, comboKeys: [list of keys], lastTime: time }
    this.combos = {};

    // { keyCode : [ list of structures of type
    //                      {
    //                          listeningOb:   ob listening to the event,
    //                          listeningFunc: function to be called inside listeningOb,
    //                          onPause:       bool, if ob should be informed with the game on pause,
    //                      }
    //             ]
    // }
    this.comboListeners = {};

    this.keyListeners = {}; // { keyCode : [ list of objects listening to the event ] }

    // List of clickable zones
    // clickableZones[zoneName] = {
    //                  position : x, y of its center,
    //                  size : x, y (rectangle form),
    //                  character : character to emulate when it's touched
    //                        }
    this.clickableZones = {};

    this.clickListeners = []; // array of elements listening to click events
  }

  initialize() {}

  activate() {
    engine.input.setCurrentInputController(this);

    // Always have the common controls
    this.addKeyListener(
      engine.core,
      'eventKeyPressed',
      [KEYS.P, KEYS.ESC, KEYS.F],
      true
    );
  }

  // testLog()
  // {
  //   let res = '[';
  //   for (let j = 0, len_j = this.lastPressed.length; j < len_j; j++)
  //     res += this.lastPressed[j] + ', ';
  //   res += ']';

  //   engine.logs.log('Input.testLog', res);
  // }

  addKeyListener(object, funcName, keyList, onPause) {
    if (typeof onPause == 'undefined') {
      onPause = false;
    }

    let element = {};
    element['listeningOb'] = object;
    element['listeningFunc'] = funcName;
    element['onPause'] = onPause;

    for (let i = 0, len = keyList.length; i < len; i++) {
      if (typeof this.keyListeners[keyList[i]] === 'undefined') {
        this.keyListeners[keyList[i]] = [element];
      } else {
        this.keyListeners[keyList[i]].push(element);
      }
    }
  }

  addClickListener(object, funcName, onPause) {
    if (typeof onPause === 'undefined') {
      onPause = false;
    }
    let element = {};
    element['listeningOb'] = object;
    element['listeningFunc'] = funcName;
    element['onPause'] = onPause;

    this.clickListeners.push(element);
  }

  removeListeners(obj) {
    let i, j, len_i, len_j;

    for (i in this.keyListeners) {
      for (j = 0, len_j = this.keyListeners[i].length; j < len_j; j++) {
        if (this.keyListeners[i][j].listeningOb == obj) {
          this.keyListeners[i].splice(j, 1);

          if (!this.keyListeners[i].length) {
            delete this.keyListeners[i];
          }
        }
      }
    }

    for (i = 0, len_i = this.clickListeners.length; i < len_i; i++) {
      for (j = 0, len_j = this.clickListeners[i].length; j < len_j; j++) {
        if (this.clickListeners[i][j].listeningOb == obj) {
          this.clickListeners[i].splice(j, 1);
        }
      }
    }
  }

  informKeyPressed(keyCode) {
    let listeners = [];

    // Objects listening to the actual key pressed
    if (typeof this.keyListeners[keyCode] != 'undefined') {
      listeners = listeners.concat(this.keyListeners[keyCode]);
    }

    // Objects listening to ANY key pressed
    if (typeof this.keyListeners[KEYS.ANY_KEY] != 'undefined') {
      listeners = listeners.concat(this.keyListeners[KEYS.ANY_KEY]);
    }

    if (typeof listeners == 'undefined') {
      return;
    }

    for (let i = 0, len = listeners.length; i < len; i++) {
      let which = listeners[i];

      // If the listening object should not be informed on pause
      if (!which.onPause && engine.paused) {
        continue;
      }

      // If the object has the function, inform
      if (typeof which.listeningOb[which.listeningFunc] != 'undefined') {
        which.listeningOb[which.listeningFunc](keyCode);
      }
    }
  }

  informClick(id) {
    if (typeof this.clickListeners === 'undefined') {
      return;
    }

    for (let i = 0, len = this.clickListeners.length; i < len; i++) {
      let which = this.clickListeners[i];

      // If the listening object should not be informed on pause
      if (!which.onPause && engine.paused) {
        continue;
      }

      // If the object has the function, inform
      if (typeof which.listeningOb[which.listeningFunc] !== 'undefined') {
        which.listeningOb[which.listeningFunc](id);
      }
    }
  }

  defineCombo(name, type, list) {
    this.combos[name] = { comboType: type, comboKeys: list, lastTime: 0 };
  }

  addComboListener(object, funcName, comboNames, onPause) {
    if (typeof onPause === 'undefined') {
      onPause = false;
    }

    let element = [];
    element['listeningOb'] = object;
    element['listeningFunc'] = funcName;
    element['onPause'] = onPause;

    for (let i = 0, len = comboNames.length; i < len; i++) {
      if (typeof this.comboListeners[comboNames[i]] === 'undefined') {
        this.comboListeners[comboNames[i]] = [element];
      } else {
        this.comboListeners[comboNames[i]].push(element);
      }
    }
  }

  informComboPerformed(comboName, time) {
    if (engine.options.outputPressedCombos === true) {
      engine.logs.log(
        'Input.informComboPerformed',
        'Combo activated: ' + comboName,
        time
      );
    }

    // Update last time performed
    this.combos[comboName].lastTime = time;
    let listeners = this.comboListeners[comboName];

    if (typeof listeners === 'undefined') {
      return;
    }

    for (let i = 0, len = listeners.length; i < len; i++) {
      let which = listeners[i];

      // If the listening object should not be informed on pause
      if (!which.onPause && engine.paused) {
        continue;
      }

      // If the object has the function, inform
      if (typeof which.listeningOb[which.listeningFunc] !== 'undefined') {
        which.listeningOb[which.listeningFunc](comboName);
      }
    }

    // Control of combo result should be done in Controls.informComboPerformed
    return;
  }

  detectCombo() {
    for (let comboName in this.combos) {
      let combo = this.combos[comboName];
      let j, len_j;

      // All the keys pressed at the same time
      if (combo.comboType == COMBO_TYPES.SIMULTANEOUS) {
        for (j = 0, len_j = combo.comboKeys.length; j < len_j; j++) {
          // Any of the keys is not pressed, combo failed
          if (!engine.input.isKeyPressed(combo.comboKeys[j])) {
            break;
          }
          // All pressed, this is the last one and it's also pressed, combo win!
          if (
            j == len_j - 1 &&
            engine.input.isKeyPressed(combo.comboKeys[j])
          ) {
            return comboName;
          }
        }
      }
      // Keys pressed in a consecutive way
      else if (combo.comboType == COMBO_TYPES.CONSECUTIVE) {
        let lp_len = engine.input.lastPressed.length;
        let ck_len = combo.comboKeys.length;

        // If pressed list shorter than combo
        if (lp_len < ck_len) {
          return null;
        }

        for (j = 1; j <= ck_len && j <= lp_len; j++) {
          // Non-match
          if (
            combo.comboKeys[ck_len - j] != engine.input.lastPressed[lp_len - j]
          ) {
            break;
          }
          // Last element and everyone match
          if (j >= ck_len || j >= lp_len) {
            return comboName;
          }
        }
      }
    }

    // No combos found
    return null;
  }

  addClickZone(id, location, rectangleSize, ch) {
    this.clickableZones[id] = {
      position: location,
      size: rectangleSize,
      character: ch,
    };
  }

  detectClick(position) {
    for (let clickId in this.clickableZones) {
      let clickZone = this.clickableZones[clickId];

      // engine.logs.log('Engine.INPUT.SceneInput.detectTouch', 'Testing ' + clickId + ' zone');

      if (
        position.x >= clickZone.position.x - clickZone.size.x / 2 &&
        position.x <= clickZone.position.x + clickZone.size.x / 2 &&
        position.y >= clickZone.position.y - clickZone.size.y / 2 &&
        position.y <= clickZone.position.y + clickZone.size.y / 2
      ) {
        // Touch done!
        // engine.logs.log('Engine.INPUT.SceneInput.detectTouch', 'Touch OK, zone: ' + clickId);
        // engine.gui.get('console').addText('touch', clickId);

        // Save the emulated key
        if (clickZone.character !== null) {
          engine.input.addLastPressed(clickZone.character);
        }

        engine.input.addClick(clickId);
      }
    }
  }
}
