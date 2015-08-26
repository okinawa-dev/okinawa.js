
Engine.Particle = function(position, speed) 
{
  Engine.Item.call(this);

  this.setPosition(position.x, position.y);
  this.setSpeed(speed.x, speed.y);

  this.ttl    = -1;
  this.lived  = 0;
  this.color  = [];
  this.size   = 2;    
};

Engine.Particle.prototype = Object.create(Engine.Item.prototype);
Engine.Particle.prototype.constructor = Engine.Particle;


Engine.Particle.prototype.initialize = function() 
{
};

Engine.Particle.prototype.activate = function() 
{
};

Engine.Particle.prototype.step = function(dt) 
{
  this.move(this.speed.x * dt / engine.core.TIME_PER_FRAME,
            this.speed.y * dt / engine.core.TIME_PER_FRAME);

  this.lived++;
};

// Not needed, the particles will be drawn inside the ParticleCollection object
Engine.Particle.prototype.draw = function(ctx) 
{
};

// Will never be used, the particles are not attached to the scene
Engine.Particle.prototype.collide = function(what)
{
  // Particles are not physical objects
  return false;
};
