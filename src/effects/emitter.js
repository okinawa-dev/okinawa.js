import engine from './engine';
import Item from '../item';
import * as MATH from '../math/math';
import Particle from './particle';

export default class Emitter extends Item {
  constructor(particleSpeed, magnitude, spread) {
    super();

    // this.position = new MATH.Point(0, 0);
    // this.speed    = new MATH.Point(0, 0);
    this.size = new MATH.Point(10, 10);

    // velocity vector of the particles
    this.particleSpeed = particleSpeed;

    this.magnitude = magnitude;

    this.particleColor = [255, 255, 255, 255]; // [255,47,30,255]; // [66,167,222,255];
    this.particleLife = 100;
    this.particleSize = 3;

    this.started = false;

    this.spread = spread;
    this.emissionRate = 3;
  }

  start() {
    this.started = true;
  }
  stop() {
    this.started = false;
  }

  createParticle() {
    let modifier = Math.random() * this.spread - this.spread / 2;
    let angle = this.getRotation() + modifier;
    let direction = engine.math.angleToDirectionVector(angle);
    direction = direction.normalize();

    let particleSpeed = new MATH.Point(
      direction.x * this.particleSpeed,
      direction.y * this.particleSpeed
    );

    // Initial position of the particle
    let position = this.getPosition();
    let particle = new Particle(position, particleSpeed);

    particle.ttl = Math.random() * this.particleLife;
    particle.color = this.particleColor;
    particle.size = this.particleSize;

    // this.particles.push(particle);
    engine.particles.addParticle(particle);
  }

  step(dt) {
    super.step(dt);
    // this.emissionCount = this.emissionCount++ % this.emissionRate;

    if (this.started === true) {
      for (let i = 0; i < this.emissionRate; i++) {
        this.createParticle();
      }
    }
  }

  draw(ctx) {
    super.draw(ctx);
  }

  collide() {
    // Emitters are not physical objects
    return false;
  }
}
