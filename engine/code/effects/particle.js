
Engine.Particle = function(x, y, vx, vy) 
{
  Engine.Item.call(this);

  this.setPosition(x, y);
  this.setSpeed(vx, vy);

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
