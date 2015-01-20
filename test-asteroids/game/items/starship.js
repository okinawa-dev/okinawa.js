
Game.ITEMS.Starship = function(type)
{ 
  Engine.Item.call(this);

  this.spriteName = type;

  this.size.x    = engine.sprites.sprites[this.spriteName][3];
  this.size.y    = engine.sprites.sprites[this.spriteName][4];

  // for collisions
  this.maxRadius = this.getRadius();
  this.collisionRadius = 24;

  this.gunRack = [];

  this.motorEffect = null;
}

Game.ITEMS.Starship.prototype = Object.create(Engine.Item.prototype);
Game.ITEMS.Starship.prototype.constructor = Game.ITEMS.Starship;

Game.ITEMS.Starship.prototype.initialize = function()
{
  Engine.Item.prototype.initialize.call(this);

  // Create thrusts (particle speed, magnitude, spread)
  this.motorEffect = new Engine.Emitter(1, 1, Math.PI / 5);
  this.motorEffect.setPosition(-20, -1);
  this.motorEffect.setRotation(Math.PI);
  this.attachItem(this.motorEffect);

  // Create guns
  var gun = new Game.ITEMS.Gun();
  gun.setPosition(20, 0);

  this.gunRack.push(gun);
  this.attachItem(gun);

  // Rotate the ship, because in the original image it looks towards the right side
  this.setRotation(- Math.PI / 2);
}

Game.ITEMS.Starship.prototype.step = function(dt) 
{
  // Not necessary if there are no animations, but here it is
  // engine.sprites.step(dt, this);

  Engine.Item.prototype.step.call(this, dt);

  if (engine.game.player.isThrusting == true)
    this.motorEffect.start();
  else
    this.motorEffect.stop();
}

Game.ITEMS.Starship.prototype.draw = function(ctx) 
{
  Engine.Item.prototype.draw.call(this, ctx);
}

Game.ITEMS.Starship.prototype.collide = function(what)
{
  // Cannot collide with our own shots
  if ((what instanceof Game.ITEMS.Shot) && (what.creator == this))
    return false;

  // Colliding with any other thing = less speed and lose points
  this.speed.x = this.speed.x / 10;
  this.speed.y = this.speed.y / 10;

  engine.game.points.add(-10);

  // should not be removed
  return false;
}

Game.ITEMS.Starship.prototype.shoot = function()
{
  for(var i = 0, len = this.gunRack.length; i < len; i++) 
    this.gunRack[i].shoot(this);

  engine.sounds.play('shot');
}




