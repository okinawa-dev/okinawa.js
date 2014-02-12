
Engine.Particle = function(position, speed) 
{
  Engine.Item.call(this);

  this.setPosition(position.x, position.y);
  this.setSpeed(speed.x, speed.y);

  this.ttl    = -1;
  this.lived  = 0;
  this.color  = [];
  this.size   = 2;    
}

Engine.Particle.prototype = Object.create(Engine.Item.prototype);
Engine.Particle.prototype.constructor = Engine.Particle;


Engine.Particle.prototype.step = function(dt) 
{
  this.move(this.speed.x * dt / engine.core.TIME_PER_FRAME,
            this.speed.y * dt / engine.core.TIME_PER_FRAME);

  this.lived++;
}
