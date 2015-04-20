
Engine.INPUT.SceneInput = function()
{
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
}

Engine.INPUT.SceneInput.prototype.initialize = function() 
{

}

Engine.INPUT.SceneInput.prototype.activate = function() 
{
  engine.input.setCurrentInputController(this);

  // Always have the common controls
  this.addKeyListener( engine.core, 'eventKeyPressed', [ Engine.INPUT.KEYS.P, Engine.INPUT.KEYS.ESC, Engine.INPUT.KEYS.F ], true );
}

// Engine.INPUT.SceneInput.prototype.testLog = function()
// {
//   var res = '[';
//   for (var j = 0, len_j = this.lastPressed.length; j < len_j; j++)
//     res += this.lastPressed[j] + ', ';
//   res += ']';

//   engine.logs.log('Input.testLog', res);
// }

Engine.INPUT.SceneInput.prototype.addKeyListener = function(object, funcName, keyList, onPause)
{
  if (onPause == undefined)
    onPause = false;

  var element = [];
  element['listeningOb'] = object;
  element['listeningFunc'] = funcName;
  element['onPause'] = onPause;

  for (var i = 0, len = keyList.length; i < len; i++)
  {
    if (this.keyListeners[keyList[i]] == undefined)
      this.keyListeners[keyList[i]] = [ element ];
    else
      this.keyListeners[keyList[i]].push(element);
  }
}

Engine.INPUT.SceneInput.prototype.informKeyPressed = function(keyCode)
{
  var listeners = [];
  
  // Objects listening to the actual key pressed
  if (this.keyListeners[keyCode] != undefined)
    listeners = listeners.concat(this.keyListeners[keyCode]);

  // Objects listening to ANY key pressed
  if (this.keyListeners[Engine.INPUT.KEYS.ANY_KEY] != undefined)
    listeners = listeners.concat(this.keyListeners[Engine.INPUT.KEYS.ANY_KEY]);

  if (listeners == undefined)
    return;

  for (var i = 0, len = listeners.length; i < len; i++)
  {
    var which = listeners[i];

    // If the listening object should not be informed on pause
    if (!which.onPause && engine.paused)
      continue;

    // If the object has the function, inform
    if (which.listeningOb[which.listeningFunc] != undefined)
      which.listeningOb[which.listeningFunc](keyCode);
  }
}

Engine.INPUT.SceneInput.prototype.defineCombo = function(name, type, list)
{
  this.combos[name] = { comboType: type, comboKeys: list, lastTime: 0 };
}

Engine.INPUT.SceneInput.prototype.addComboListener = function(object, funcName, comboNames, onPause)
{
  if (onPause == undefined)
    onPause = false;

  var element = [];
  element['listeningOb'] = object;
  element['listeningFunc'] = funcName;  
  element['onPause'] = onPause;

  for (var i = 0, len = comboNames.length; i < len; i++)
  {
    if (this.comboListeners[comboNames[i]] == undefined)
      this.comboListeners[comboNames[i]] = [ element ];
    else
      this.comboListeners[comboNames[i]].push(element);
  }
}

Engine.INPUT.SceneInput.prototype.informComboPerformed = function(comboName, time)
{
  if (engine.options.outputPressedCombos == true)
    engine.logs.log('Input.informComboPerformed', 'Combo activated: ' + comboName, time);

  // Update last time performed
  this.combos[comboName].lastTime = time;

  var listeners = this.comboListeners[comboName];

  if (listeners == undefined)
    return;

  for (var i = 0, len = listeners.length; i < len; i++)
  {
    var which = listeners[i];

    // If the listening object should not be informed on pause
    if (!which.onPause && engine.paused)
      continue;

    // If the object has the function, inform
    if (which.listeningOb[which.listeningFunc] != undefined)
      which.listeningOb[which.listeningFunc](comboName);
  }

  // Control of combo result should be done in Controls.informComboPerformed
  return;
}

Engine.INPUT.SceneInput.prototype.detectCombo = function()
{
  for (var comboName in this.combos)
  {
    var combo = this.combos[comboName];

    // All the keys pressed at the same time
    if (combo.comboType == Engine.INPUT.COMBO_TYPES.SIMULTANEOUS)
    {
      for (var j = 0, len_j = combo.comboKeys.length; j < len_j; j++)
      {
        // Any of the keys is not pressed, combo failed
        if (!engine.input.isKeyPressed(combo.comboKeys[j]))
          break;
        // All pressed, this is the last one and it's also pressed, combo win!
        if ((j == len_j - 1) && (engine.input.isKeyPressed(combo.comboKeys[j])))
          return comboName;
      } 
    }
    // Keys pressed in a consecutive way
    else if (combo.comboType == Engine.INPUT.COMBO_TYPES.CONSECUTIVE)
    {
      var lp_len = engine.input.lastPressed.length;
      var ck_len = combo.comboKeys.length;

      // If pressed list shorter than combo
      if (lp_len < ck_len)
        return null;

      for (var j = 1; (j <= ck_len) && (j <= lp_len); j++)
      {
        // Non-match
        if (combo.comboKeys[ck_len - j] != engine.input.lastPressed[lp_len - j])
          break;

        // Last element and everyone match
        if ( (j >= ck_len) || (j >= lp_len) )
          return comboName;
      }
    }
  }

  // No combos found
  return null;
}

Engine.INPUT.SceneInput.prototype.addClickZone = function(id, location, rectangleSize, char)
{
  this.clickableZones[id] = {
    position : location,
    size : rectangleSize,
    character : char
  }
}

Engine.INPUT.SceneInput.prototype.detectClick = function(position)
{
  for (var clickId in this.clickableZones)
  {
    var clickZone = this.clickableZones[clickId];

    // engine.logs.log('Engine.INPUT.SceneInput.detectTouch', 'Testing ' + clickId + ' zone');

    if ((position.x >= clickZone.position.x - clickZone.size.x / 2 ) && 
        (position.x <= clickZone.position.x + clickZone.size.x / 2 ) && 
        (position.y >= clickZone.position.y - clickZone.size.y / 2 ) && 
        (position.y <= clickZone.position.y + clickZone.size.y / 2 ))
    {
      // Touch done!
      // engine.logs.log('Engine.INPUT.SceneInput.detectTouch', 'Touch OK, zone: ' + clickId);
      // engine.gui.get('console').addText('touch', clickId); 

      // Save the emulated key
      engine.input.addLastPressed(clickZone.character);
    }
  }
}
