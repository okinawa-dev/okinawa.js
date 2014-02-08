
Engine.Effects = function()
{
  this.effects = [];
  this.removed = [];
}

Engine.Effects.prototype.initialize = function() 
{ 
  // engine.logs.log('effectHandler.initialize', 'Initializing effects Handler');

  this.effects.length = 0;
}

Engine.Effects.prototype.removeEffect = function(eff)
{
  this.removed.push(eff);
}

// Reset the list of removed objects
Engine.Effects.prototype._resetRemoved = function() 
{
  this.removed.length = 0; 
}

// Remove any objects marked for removal
Engine.Effects.prototype._finalizeRemoved = function() 
{
  for(var i = 0, len = this.removed.length; i < len; i++) 
  {
    var idx = this.effects.indexOf(this.removed[i]);
    if(idx != -1) 
      this.effects.splice(idx, 1);
  }
}

Engine.Effects.prototype.step = function(dt) 
{
  this._resetRemoved();

  for (var i = 0, len = this.effects.length; i < len; i++) 
  {
    var eff = this.effects[i];

    eff.step(dt);

    // Effect lasts only the expected lifetime
    if ((eff.lifeTime > 0) && (eff.lived > eff.lifeTime))
      this.removeEffect(eff);

    // Effect lasts only one complete loop
    if ((eff.maxLoops > 0) && (eff.numLoops > eff.maxLoops))
      this.removeEffect(eff);
  }

  this._finalizeRemoved();
}

Engine.Effects.prototype.draw = function(ctx) 
{
  for (var i = 0, len = this.effects.length; i < len; i++) 
  {
    this.effects[i].draw(ctx);
  }
}

// The coordinates passed are the ones from the center
Engine.Effects.prototype.addEffect= function(type, x, y, vx, vy) 
{
  // var effectH = engine.sprites.sprites[type][3];
  // var effectW = engine.sprites.sprites[type][4];       

  eff = new Engine.Effect(type, x, y, vx, vy);
  this.effects.push(eff);

  // Returns the effect to add further changes
  return eff;
}

