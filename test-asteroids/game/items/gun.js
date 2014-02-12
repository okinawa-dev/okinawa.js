
Game.ITEMS.Gun = function()
{ 
  Engine.Item.call(this);

  this.size = new Engine.MATH.Point(10, 10);
}

Game.ITEMS.Gun.prototype = Object.create(Engine.Item.prototype);
Game.ITEMS.Gun.prototype.constructor = Game.ITEMS.Gun;

Game.ITEMS.Gun.prototype.step = function(dt) 
{
  // Not necessary if there are no animations, but here it is
  // engine.sprites.step(dt, this);

  Engine.Item.prototype.step.call(this, dt);
}

Game.ITEMS.Gun.prototype.draw = function(ctx) 
{
  Engine.Item.prototype.draw.call(this, ctx);
}

Game.ITEMS.Gun.prototype.shoot = function(creator)
{
  var pos = this.getPosition();

  var shot = new Game.ITEMS.Shot(creator, this.getPosition(), this.getRotation());
  engine.scenes.getCurrentScene().attachItem(shot);
}

Game.ITEMS.Gun.prototype.collide = function(what)
{
  // Guns are not physical objects
  return false;
}
