
Engine.Scene = function()
{
  Engine.Item.call(this);

  this.playable    = false; // This screen is playable
  this.backgrounds = [];    

  this.isCurrent   = false; // Is the screen being used now

  this.gui         = new Engine.GUI.GuiElement(this); // Different Gui for each scene

  this.clock       = new Engine.UnalignedClock();
  this.input       = new Engine.INPUT.SceneInput();
}

Engine.Scene.prototype = Object.create(Engine.Item.prototype);
Engine.Scene.prototype.constructor = Engine.Scene;


Engine.Scene.prototype.initialize = function()
{
  Engine.Item.prototype.initialize.call(this);

  this.gui.initialize();
  this.clock.initialize();
  this.input.initialize();
}

Engine.Scene.prototype.activate = function()
{
  Engine.Item.prototype.activate.call(this);

  this.gui.activate();
  this.clock.activate();
  this.input.activate();

  for (var i = 0, len = this.backgrounds.length; i < len; i++) 
    this.backgrounds[i].activate();
}

Engine.Scene.prototype.draw = function(ctx)
{
  // Test for safety: clean the full scene
  // If everything is well coded in the game, in theory this could be removed
  ctx.clearRect(0, 0, engine.core.size.x, engine.core.size.y);  

  for (var i = 0, len = this.backgrounds.length; i < len; i++) 
    this.backgrounds[i].draw(ctx);

  Engine.Item.prototype.draw.call(this, ctx);

  this.gui.draw(ctx);
}

Engine.Scene.prototype.step = function(dt)
{
  for (var i = 0, len = this.backgrounds.length; i < len; i++) 
  {
    this.backgrounds[i].step(dt);
  }

  this.clock.step(dt);

  Engine.Item.prototype.step.call(this, dt);

  this.gui.step(dt);
}

Engine.Scene.prototype.addBackground = function(background)
{
  this.backgrounds.push(background);
}
