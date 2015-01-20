
Game.SCENES.Initial = function() 
{
  Engine.Scene.call(this);
}

Game.SCENES.Initial.prototype = Object.create(Engine.Scene.prototype);
Game.SCENES.Initial.prototype.constructor = Game.SCENES.Initial;

// Will be called after creation of this object
Game.SCENES.Initial.prototype.initialize = function()
{
  Engine.Scene.prototype.initialize.call(this);

  // This object will be listening to the spacebar key
  // When pressed, our eventKeyPressed functions will be called
  this.input.addKeyListener(this, 'eventKeyPressed', [ Engine.INPUT.KEYS.SPACEBAR ]);
}

// Will be called when the scene starts being playable
Game.SCENES.Initial.prototype.activate = function()
{
  var avatar = engine.game.player.getAvatar();

  // Position the player avatar in the proper place
  avatar.setPosition(engine.core.size.x/2, engine.core.size.y/2);

  // Attach the player avatar to this scene
  this.attachItem(avatar);  

  Engine.Scene.prototype.activate.call(this);
}

Game.SCENES.Initial.prototype.draw = function(ctx)
{
  Engine.Scene.prototype.draw.call(this, ctx);
}

Game.SCENES.Initial.prototype.step = function(dt)
{
  Engine.Scene.prototype.step.call(this, dt);
}

Game.SCENES.Initial.prototype.eventKeyPressed = function(keyCode)
{
  if (keyCode == Engine.INPUT.KEYS.SPACEBAR)
    engine.scenes.advanceScene();
}



