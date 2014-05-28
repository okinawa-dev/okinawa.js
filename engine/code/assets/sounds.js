 
Engine.Sounds = function()
{
  // List of Audio() objects used in the game, indexed by id/name
  // sounds[name] = [object, original_path];
  this.sounds  = {};
}

Engine.Sounds.SOUNDINFO = {
  AUDIOOBJECT : 0,
  ORIGINALPATH : 1,
}

Engine.Sounds.prototype.initialize = function() 
{ 
  // engine.logs.log('engine.sounds.initialize', 'Initializing sound Handler');

  this.sounds.length = 0;
}

Engine.Sounds.prototype.step = function(dt, object) 
{
}

// Engine.Sounds.prototype.draw = function(ctx, object) 
// {
// }

Engine.Sounds.prototype.soundExists = function(path)
{
  var ids = Object.keys(this.sounds);

  for (var i = 0, len = ids.length; i < len; i++)
  {
    if (this.sounds[ids[i]][Engine.Sounds.SOUNDINFO.ORIGINALPATH] == path)
      return true;
  }

  return false;
}

Engine.Sounds.prototype.addSound = function(name, path, object)
{
  this.sounds[name] = [object, path];
}

Engine.Sounds.prototype.get = function(name)
{
  if (this.sounds[name] == undefined)
    return null;

  return this.sounds[name][Engine.Sounds.SOUNDINFO.AUDIOOBJECT];
}