
Engine.Emitter = function(particleSpeed, magnitude, spread) 
{
  Engine.Item.call(this);
  
  // this.position = new Engine.MATH.Point(0, 0);
  // this.speed    = new Engine.MATH.Point(0, 0);
  this.size     = new Engine.MATH.Point(10, 10);

  // velocity vector of the particles
  this.particleSpeed = particleSpeed;

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

  var angle = this.getRotation() + modifier;
  
  var direction = engine.math.angleToDirectionVector(angle);
  direction = direction.normalize();

  var particleSpeed = new Engine.MATH.Point(direction.x * this.particleSpeed,
                                            direction.y * this.particleSpeed);


  // var newvx = this.particleSpeed.x * this.magnitude;
  // var newvy = this.particleSpeed.y * this.magnitude;
  // newvx = (newvx * Math.cos(modifier)) + (newvy * Math.sin(modifier));
  // newvy = (-newvy * Math.cos(modifier)) - (newvx  * Math.sin(modifier));

  // Initial position of the particle
  var position = this.getPosition();

  // (x, y, vx, vy)
  var particle = new Engine.Particle( position, particleSpeed);

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

