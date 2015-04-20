
Engine.GUI.GuiButton = function(txt)
{
  Engine.GUI.GuiElement.call(this);

  this.buttonToEmulate = null;

  this.buttonSprite = '';
  this.image        = null;
}

Engine.GUI.GuiButton.prototype = Object.create(Engine.GUI.GuiElement.prototype);
Engine.GUI.GuiButton.prototype.constructor = Engine.GUI.GuiButton;


Engine.GUI.GuiButton.prototype.initialize = function(button)
{
  Engine.GUI.GuiElement.prototype.initialize.call(this);

  if (button != undefined)
    this.buttonToEmulate = button;
}

Engine.GUI.GuiButton.prototype.activate = function()
{
  Engine.GUI.GuiElement.prototype.activate.call(this);

  var scene = this.getParentScene();
  var pos = this.getPosition();

  // Add touch area to the scene input controller
  scene.input.addClickZone('button_zone_' + this.guiId, 
    pos,
    this.getSize(),
    this.buttonToEmulate);

  if (this.buttonSprite =! '')
  {
    if (this.image == null)
      this.image = new Engine.GUI.GuiElement();

    this.image.setPosition(0, 0);
    this.image.setImage(this.buttonSprite);
    this.attachItem(this.image);    
  }

  // Listen to all the keys
  // scene.input.addKeyListener( this, 'eventKeyPressed', keyList, true ); 
}

Engine.GUI.GuiButton.prototype.setButtonToEmulate = function(button)
{
  this.buttonToEmulate = button;
}

Engine.GUI.GuiButton.prototype.draw = function(ctx)
{
  Engine.GUI.GuiElement.prototype.draw.call(this, ctx);
}

Engine.GUI.GuiButton.prototype.step = function(dt)
{
  Engine.GUI.GuiElement.prototype.step.call(this, dt);
}
