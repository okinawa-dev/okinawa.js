
Game.ITEMS.Shot = function(creator, position, angle)
{ 
  Engine.Item.call(this);

  this.spriteName = 'shot';

  // The object which originated the shot (player, npc, etc)
  this.creator     = creator;

  this.size.x     = engine.sprites.sprites[this.spriteName][3];
  this.size.y     = engine.sprites.sprites[this.spriteName][4];

  this.position = position;

  this.speedMagnitude = 5;

  this.setRotation(angle);

  var direction = engine.math.angleToDirectionVector(angle);
  direction = direction.normalize();

  this.speed.x = direction.x * this.speedMagnitude;
  this.speed.y = direction.y * this.speedMagnitude;

  this.maxRadius  = this.getRadius();
  this.collisionRadius = 12;
}

Game.ITEMS.Shot.prototype = Object.create(Engine.Item.prototype);
Game.ITEMS.Shot.prototype.constructor = Game.ITEMS.Shot;

Game.ITEMS.Shot.prototype.step = function(dt) 
{
  Engine.Item.prototype.step.call(this, dt);

  // Not necessary if there are no animations, but here it is
  // engine.sprites.step(dt, this); 
}

Game.ITEMS.Shot.prototype.draw = function(ctx) 
{
  Engine.Item.prototype.draw.call(this, ctx);
}

Game.ITEMS.Shot.prototype.collide = function(what)
{
  // Cannot collide with other shots
  if (what instanceof Game.ITEMS.Shot)
    return false;

  // Cannot collide with its own creator
  if (what == this.creator)
    return false;
  
  // Win!
  if (what instanceof Game.ITEMS.Meteor)
    engine.game.points.add(50);

  // Should be done only if we are going to return true in this function
  Engine.Item.prototype.collide.call(this);

  // true == should be removed
  return true;
}

