
Engine.Emitter = function(x, y, particleVx, particleVy, magnitude, spread) 
{
  Engine.Item.call(this);
  
  // position of the emitter
  this.position.x    = x;
  this.position.y    = y;

  this.speed.x       = 0;
  this.speed.y       = 0;

  // velocity vector of the particles
  this.particleSpeed = new Engine.MATH.Point(particleVx, particleVy);

  this.magnitude     = magnitude;

  this.particleColor = [255,255,255,255]; // [255,47,30,255]; // [66,167,222,255];
  this.particleLife  = 100;
  this.particleSize  = 3;

  this.started       = false;

  this.spread        = spread;
  this.emissionRate  = 3;
}

Engine.Emitter.prototype = Object.create(Engine.Item.prototype);
Engine.Emitter.prototype.constructor = Engine.Emitter;


Engine.Emitter.prototype.start = function() { this.started = true; }
Engine.Emitter.prototype.stop = function() { this.started = false; }

Engine.Emitter.prototype.createParticle = function()
{
  var modifier = Math.random() * this.spread - this.spread / 2;

  var newvx = this.particleSpeed.x * this.magnitude;
  var newvy = this.particleSpeed.y * this.magnitude;
  newvx = (newvx * Math.cos(modifier)) + (newvy * Math.sin(modifier));
  newvy = (-newvy * Math.cos(modifier)) - (newvx  * Math.sin(modifier));

  // Initial position of the particle (counting the inherited parent position)
  var position = this.getParentPosition();

  // (x, y, vx, vy)
  var particle = new Engine.Particle( this.position.x + position.x, this.position.y + position.y,
                               newvx, newvy);

  particle.ttl = Math.random() * this.particleLife;
  particle.color = this.particleColor;
  particle.size = this.particleSize;

  // this.particles.push(particle);
  engine.particles.addParticle(particle);
}

Engine.Emitter.prototype.step = function (dt)
{
  Engine.Item.prototype.step.call(this, dt);
  
  // this.emissionCount = this.emissionCount++ % this.emissionRate;

  if (this.started == true) 
  {
    for (var i = 0; i < this.emissionRate; i++)
    {
      this.createParticle();
    }
  }
}

Engine.Emitter.prototype.draw = function (ctx) 
{
  Engine.Item.prototype.draw.call(this, ctx);
}

