import engine from '../engine';
import Tracker from './tracker';
// import * as MATH from '../math/math';

export default class TrackerCircle extends Tracker {
  constructor(callback) {
    super(callback);

    // For circular tracks
    this.circleAngle = 0.1;
    this.circleRadius = 60;
  }

  initialize() {
    super.initialize();
  }

  activate() {
    super.activate();
  }

  step(dt) {
    this.circleAngle += (this.trackSpeed * dt) / engine.core.TIME_PER_FRAME;
    this.position.x = Math.cos(this.circleAngle) * this.circleRadius;
    this.position.y = Math.sin(this.circleAngle) * this.circleRadius;

    // Tracker.step is where the attached items steps are called, so they go
    // after updating the tracker

    // Call inherited function
    super.step(dt);
  }

  draw(ctx) {
    // Call inherited function
    super.draw(ctx);

    if (engine.options.drawTrackers === true) {
      let pos = this.getParentPosition();
      let gradient = ctx.createLinearGradient(
        pos.x - this.circleRadius,
        pos.y,
        pos.x + this.circleRadius,
        pos.y
      );
      gradient.addColorStop(0, '#009');
      gradient.addColorStop(1, '#900');
      ctx.strokeStyle = gradient;
      // ctx.strokeStyle = '#FF0000';
      ctx.lineWidth = 1;

      ctx.beginPath();
      ctx.arc(pos.x, pos.y, this.circleRadius, 0, 2 * Math.PI, false);
      ctx.closePath();
      ctx.stroke();
    }
  }
}
