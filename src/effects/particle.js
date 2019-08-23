import engine from '../engine';
import Item from '../item';

export default class Particle extends Item {
  constructor(position, speed) {
    super();

    this.setPosition(position.x, position.y);
    this.setSpeed(speed.x, speed.y);

    this.ttl = -1;
    this.lived = 0;
    this.color = [];
    this.size = 2;
  }

  initialize() {}

  activate() {}

  step(dt) {
    this.move(
      (this.speed.x * dt) / engine.core.TIME_PER_FRAME,
      (this.speed.y * dt) / engine.core.TIME_PER_FRAME
    );

    this.lived++;
  }

  // Not needed, the particles will be drawn inside the ParticleCollection object
  draw() {}

  // Will never be used, the particles are not attached to the scene
  collide() {
    // Particles are not physical objects
    return false;
  }
}
