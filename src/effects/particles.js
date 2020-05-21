import engine from '../engine';

export default class Particles {
  constructor() {
    this.particles = [];
    this.maxParticles = 10000;
    this._removedParticles = []; // particles to be removed at the end of step()

    this.effectField = document.createElement('canvas');
    this.effectField.width = engine.core.size.x;
    this.effectField.height = engine.core.size.y;
    this.effectField.ctx = this.effectField.getContext('2d');
    // this.effectField.ctx.globalCompositeOperation = 'darker';
    // this.effectField.ctx.fillStyle = 'rgba(' + this.particleColor.join(',') + ')';
  }

  initialize() {
    this.particles = [];
    this.maxParticles = 10000;
    this._removedParticles = [];
  }

  addParticle(particle) {
    if (this.particles.length > this.maxParticles) {
      return;
    }

    this.particles.push(particle);
  }

  removeParticle(what) {
    this._removedParticles.push(what);
  }

  _resetItems() {
    this.particles.length = 0;
  }

  // Reset the list of removed items
  _resetRemoved() {
    this._removedParticles.length = 0;
  }

  // Remove any items marked for removal
  _finalizeRemoved() {
    for (let i = 0, len = this._removedParticles.length; i < len; i++) {
      let what = this._removedParticles[i];
      let idx = this.particles.indexOf(what);

      if (idx != -1) {
        // what.detachAllItems();
        this.particles.splice(idx, 1);
      }
    }
  }

  step(dt) {
    let i,
      len = this.particles.length,
      p;

    for (i = 0; i < len; i++) {
      p = this.particles[i];

      if (p.lived > p.ttl) {
        this.removeParticle(p);
      } else {
        p.step(dt);
      }
    }

    // Remove any objects marked for removal
    this._finalizeRemoved();
    // Reset the list of removed objects
    // this._resetRemoved();
  }

  draw(ctx) {
    if (this.particles.length > 0) {
      this.effectField.ctx.clearRect(
        0,
        0,
        engine.core.size.x,
        engine.core.size.y
      );

      var particle,
        i = -1;
      while ((particle = this.particles[++i])) {
        var tmpColor = [
          particle.color[0] - particle.lived * 3,
          particle.color[1] - particle.lived,
          particle.color[2],
          particle.color[3],
        ];

        this.effectField.ctx.fillStyle = 'rgba(' + tmpColor.join(',') + ')';
        this.effectField.ctx.fillRect(
          particle.position.x,
          particle.position.y,
          particle.size,
          particle.size
        );
      }

      ctx.drawImage(
        this.effectField,
        0,
        0,
        engine.core.size.x,
        engine.core.size.y
      );
    }
  }
}
