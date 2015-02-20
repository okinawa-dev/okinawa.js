
Engine.GUI.GuiTouchButton = function(txt)
{
  Engine.GUI.GuiElement.call(this);

  this.buttonToEmulate = null;
  this.buttonSprite = 'touch_zone';
}

Engine.GUI.GuiTouchButton.prototype = Object.create(Engine.GUI.GuiElement.prototype);
Engine.GUI.GuiTouchButton.prototype.constructor = Engine.GUI.GuiTouchButton;


Engine.GUI.GuiTouchButton.prototype.initialize = function(button)
{
  Engine.GUI.GuiElement.prototype.initialize.call(this);

  if (button != undefined)
    this.buttonToEmulate = button;
}

Engine.GUI.GuiTouchButton.prototype.activate = function()
{
  Engine.GUI.GuiElement.prototype.activate.call(this);

  var scene = this.getParentScene();
  var pos = this.getPosition();

  // Add touch area to the scene input controller
  scene.input.addTouchZone('touch_zone_' + this.guiId, 
    pos,
    this.getSize(),
    this.buttonToEmulate);

  if (this.getVisible() == true)
  {
    var image = new Engine.GUI.GuiElement();
    image.setPosition(pos.x, pos.y);
    image.setImage(this.buttonSprite);
    scene.gui.attachItem(image, 'touch_image_' + this.guiId);    
  }

  // Listen to all the keys
  // scene.input.addKeyListener( this, 'eventKeyPressed', keyList, true ); 
}

Engine.GUI.GuiTouchButton.prototype.setButtonToEmulate = function(button)
{
  this.buttonToEmulate = button;
}

Engine.GUI.GuiTouchButton.prototype.draw = function(ctx)
{
  Engine.GUI.GuiElement.prototype.draw.call(this, ctx);
}

Engine.GUI.GuiTouchButton.prototype.step = function(dt)
{
  Engine.GUI.GuiElement.prototype.step.call(this, dt);
}


