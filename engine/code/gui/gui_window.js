
Engine.GUI.GuiWindow = function(txt)
{
  Engine.GUI.GuiElement.call(this);

  this.size.x = 200;
  this.size.y = 100;
}

Engine.GUI.GuiWindow.prototype = Object.create(Engine.GUI.GuiElement.prototype);
Engine.GUI.GuiWindow.prototype.constructor = Engine.GUI.GuiWindow;


Engine.GUI.GuiWindow.prototype.initialize = function()
{
  Engine.GUI.GuiElement.prototype.initialize.call(this);
}

Engine.GUI.GuiWindow.prototype.activate = function()
{
  Engine.GUI.GuiElement.prototype.activate.call(this);
}

Engine.GUI.GuiWindow.prototype.draw = function(ctx)
{
  var pos =   this.getPosition();
  var size =  this.getSize();
  var scale = this.getScaling();

  ctx.fillStyle = 'rgba(0, 0, 0, 0.8)';
  ctx.fillRect( pos.x - (size.x / 2) * scale.x + 1, 
                pos.y - (size.y / 2) * scale.y + 1, 
                size.x * scale.x - 2, 
                size.y * scale.y - 2);

  ctx.lineWidth = 1;
  ctx.strokeStyle = 'grey';
  ctx.strokeRect( pos.x - (size.x / 2) * scale.x, 
                  pos.y - (size.y / 2) * scale.y, 
                  size.x * scale.x, 
                  size.y * scale.y);

  Engine.GUI.GuiElement.prototype.draw.call(this, ctx);
}

Engine.GUI.GuiWindow.prototype.step = function(dt)
{
  Engine.GUI.GuiElement.prototype.step.call(this, dt);
}




