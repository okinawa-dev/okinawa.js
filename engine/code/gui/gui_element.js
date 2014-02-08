
Engine.GUI.GuiElement = function(parentItem)
{
  Engine.Item.call(this);

  this.guiId = null;

  if (parentItem != undefined)
    this.setParent(parentItem);
  else
    this.guiId = 'globalGUI';

  this.inputCallbacks = { }; // { keyCode : callback_function }

  this.guiElements = { }; // { "id" : guiElement object}

  this.blink = false;
}

Engine.GUI.GuiElement.prototype = Object.create(Engine.Item.prototype);
Engine.GUI.GuiElement.prototype.constructor = Engine.GUI.GuiElement;


Engine.GUI.GuiElement.prototype.initialize = function()
{
  Engine.Item.prototype.initialize.call(this);
}

Engine.GUI.GuiElement.prototype.activate = function()
{
  Engine.Item.prototype.activate.call(this);
}

Engine.GUI.GuiElement.prototype.draw = function(ctx)
{
  Engine.Item.prototype.draw.call(this, ctx);
}

Engine.GUI.GuiElement.prototype.step = function(dt)
{
  Engine.Item.prototype.step.call(this, dt);
}

Engine.GUI.GuiElement.prototype.setBlink = function(value)
{
  var scene = this.getParentScene();

  if (scene == null)
    return;

  if (value == true)
  {
    this.blink = true;
    scene.clock.suscribe(this.guiId + '_clock', this, 'blinkStep', 350);
  }
  else
  {
    this.blink = false;
    this.setVisible(true);
    scene.clock.unsuscribe(this.guiId + '_clock');
  }
}

Engine.GUI.GuiElement.prototype.blinkStep = function()
{
  if ((this.blink == true) && (this.getVisible() == true))
    this.setVisible(false);
  else if ((this.blink == true) && (this.getVisible() == false))
    this.setVisible(true);
  // Should not happen, ever
  else if (this.blink == false)
    this.setVisible(true);
}

Engine.GUI.GuiElement.prototype.addInputCallback = function(key, callback)
{
  var scene = this.getParentScene();

  if (scene == null)
    return;

  scene.input.addKeyListener( this, 'eventKeyPressed', [ key ], true ); // true == inform in pause too

  this.inputCallbacks[key] = callback;
}

Engine.GUI.GuiElement.prototype.eventKeyPressed = function(keyCode)
{
  // engine.logs.log('Gui.eventKeyPressed', 'Key Pressed: ' + keyCode);

  if ( this.inputCallbacks[keyCode] != undefined)
    this.inputCallbacks[keyCode]();
}

Engine.GUI.GuiElement.prototype.getElement = function(id)
{
  var ret = this.guiElements[id];
  if (ret != undefined)
    return ret;
  return null;
}
Engine.GUI.GuiElement.prototype.get = function(id) { return this.getElement(id); }

Engine.GUI.GuiElement.prototype.attachItem = function(what, id)
{
  this.guiElements[id] = what;
  what.guiId = id;
  // this.guiElementsIds = Object.keys(this.guiElements);

  Engine.Item.prototype.attachItem.call(this, what);
}

Engine.GUI.GuiElement.prototype.detachItem = function(id)
{
  if (id != undefined)
  {
    Engine.Item.prototype.detachItem.call(this, this.get(id));

    delete this.guiElements[id];

    // this.guiElementsIds = Object.keys(this.guiElements);  
  }
}

Engine.GUI.GuiElement.prototype.detachAllItems = function()
{
  var keys = Object.keys(this.guiElements);

  for (var i = 0, len = keys.length; i < len; i++) 
  {
    // Recursive in-depth
    this.guiElements[keys[i]].detachAllItems();
    this.detachItem(keys[i]);
  }

  this.guiElements = { };
  // this.guiElementsIds = [];

  this._finalizeRemoved();

  // Don't, in GUI the elements are detached by id, not by object
  // Engine.Item.prototype.detachAllItems.call(this);
}

Engine.GUI.GuiElement.prototype._resetItems = function()
{
  this.attachedItems.length = 0;
  this.guiElements = { };
}
