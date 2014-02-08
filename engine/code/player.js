
Engine.Player = function ()
{ 
  engine.logs.log('Player.initialize', 'Initializing player object');

  this.avatar = null;
}

Engine.Player.prototype.getAvatar = function()
{
  return this.avatar;
}

Engine.Player.prototype.setAvatar = function(item)
{
  this.avatar = item;
}

Engine.Player.prototype.initialize = function()
{
}

Engine.Player.prototype.activate = function()
{
}

Engine.Player.prototype.step = function(dt)
{
}

Engine.Player.prototype.draw = function(ctx)
{
  // This object is not drawn, its avatar should be 
  // added as an attached item inside any screen
  return;
}

