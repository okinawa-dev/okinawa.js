
/* jshint -W084 */

Engine.ParticleCollection = function() 
{
  this.particles         = [];
  this.maxParticles      = 10000;
  this._removedParticles = [];   // particles to be removed at the end of step() 

  this.effectField = document.createElement('canvas');
  this.effectField.width = engine.core.size.x; 
  this.effectField.height = engine.core.size.y;
  this.effectField.ctx = this.effectField.getContext('2d');
  // this.effectField.ctx.globalCompositeOperation = 'darker';
  // this.effectField.ctx.fillStyle = 'rgba(' + this.particleColor.join(',') + ')';
};

Engine.ParticleCollection.prototype.initialize = function()
{
  this.particles         = [];
  this.maxParticles      = 10000;
  this._removedParticles = [];
};

Engine.ParticleCollection.prototype.addParticle = function(particle)
{
  if (this.particles.length > this.maxParticles)
    return;

  this.particles.push(particle);
};

Engine.ParticleCollection.prototype.removeParticle = function(what)
{
  this._removedParticles.push(what);
};

Engine.ParticleCollection.prototype._resetItems = function()
{
  this.particles.length = 0;
};

// Reset the list of removed items
Engine.ParticleCollection.prototype._resetRemoved = function() 
{
  this._removedParticles.length = 0; 
};

// Remove any items marked for removal
Engine.ParticleCollection.prototype._finalizeRemoved = function() 
{
  for (var i = 0, len = this._removedParticles.length; i < len; i++) 
  {
    var what = this._removedParticles[i];
    var idx = this.particles.indexOf(what);
    
    if(idx != -1) 
    {
      // what.detachAllItems();
      this.particles.splice(idx, 1);
    }
  }
};

Engine.ParticleCollection.prototype.step = function (dt)
{
  var i, len = this.particles.length, p;

  for (i = 0; i < len; i++)
  {
    p = this.particles[i];

    if (p.lived > p.ttl)
      this.removeParticle(p);
    else
      p.step(dt);
  }

  // Remove any objects marked for removal
  this._finalizeRemoved();
  // Reset the list of removed objects
  // this._resetRemoved();
};

Engine.ParticleCollection.prototype.draw = function (ctx) 
{
  if (this.particles.length > 0)
  {
    this.effectField.ctx.clearRect ( 0 , 0 , engine.core.size.x , engine.core.size.y );

    var particle, i = -1;
    while (particle = this.particles[++i])
    {
      var tmpColor = [particle.color[0] - particle.lived * 3, 
                      particle.color[1] - particle.lived,
                      particle.color[2],
                      particle.color[3]];

      this.effectField.ctx.fillStyle = 'rgba(' + tmpColor.join(',') + ')';
      this.effectField.ctx.fillRect(particle.position.x, 
                                    particle.position.y, 
                                    particle.size, 
                                    particle.size);
    }

    ctx.drawImage(this.effectField, 0, 0, engine.core.size.x, engine.core.size.y);
  }
};
