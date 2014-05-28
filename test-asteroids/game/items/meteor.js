
Game.ITEMS.Meteor = function(size, speed)
{ 
  Engine.Item.call(this);

  this.spriteName = 'meteor';

  this.size.x   = engine.sprites.sprites[this.spriteName][3];
  this.size.y   = engine.sprites.sprites[this.spriteName][4];

  this.linearSpeed = speed;

  this.vRot     = Math.PI / 600;

  this.scaling.x = size;
  this.scaling.y  = size;

  this.maxRadius = this.getRadius();
  this.collisionRadius = 29;
}

Game.ITEMS.Meteor.prototype = Object.create(Engine.Item.prototype);
Game.ITEMS.Meteor.prototype.constructor = Game.ITEMS.Meteor;

Game.ITEMS.Meteor.prototype.step = function(dt) 
{
  Engine.Item.prototype.step.call(this, dt);

  // Not necessary if there are no animations, but here it is
  // engine.sprites.step(dt, this);
}

Game.ITEMS.Meteor.prototype.draw = function(ctx) 
{
  Engine.Item.prototype.draw.call(this, ctx);
}

Game.ITEMS.Meteor.prototype.collide = function(what)
{
  Engine.Item.prototype.collide.call(this);

  var newVx = what.speed.x;
  var newVy = what.speed.y;

  // The shots are fast and the effect is awkward... better not so much
  if (what instanceof Game.ITEMS.Shot)
  {
    newVx = what.speed.x / 10;
    newVy = what.speed.y / 10;
  }

  var effect = engine.effects.addEffect('halo', this.position.x, this.position.y, this.speed.x + newVx, this.speed.y + newVy);
  effect.initialScaling = 2;
  effect.finalScaling   = 3; 
  effect.lifeTime       = 20;
  effect.vRot           = Math.PI / 100;
  effect.transparencyMethod = 2; // disappearing

  for (var i = 0; i < 10; i++)
  {
    effect = engine.effects.addEffect('explosion', 
                                     this.position.x + (Math.random() - 0.5) * 40, this.position.y + (Math.random() - 0.5) * 40, 
                                     this.speed.x + (Math.random() - 0.5), this.speed.y + (Math.random() - 0.5));
    effect.scaling.x  = Math.abs(Math.random() - 0.1);
    effect.scaling.y  = effect.scaling.x;
    effect.vRot       = (Math.random() - 0.5) * Math.PI / 50;
    effect.lifeTime   = 100;
    effect.isAnimated = true;
    effect.transparencyMethod = Math.floor(Math.random() * 3);
  }

  engine.sounds.play('explosion');

  // true == should be removed
  return true;
}

