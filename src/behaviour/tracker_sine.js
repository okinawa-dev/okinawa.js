import engine from '../engine';
import Tracker from './tracker';
import * as MATH from '../math/math';

export default class TrackerSine extends Tracker {
  constructor(callback) {
    super(callback);

    this.position = new MATH.Point(0, 0);
    this.amplitudeVector = new MATH.Point(10, 10); // { x: 10, y: 10};
    this.frequencyVector = new MATH.Point(1, 1); // { x: 1, y: 1};
    // phase in degrees (will be converted to radians)
    this.phaseVector = new MATH.Point(0, 0); // { x: 1, y: 1};

    this.initTime = 0;
  }

  initialize() {
    super.initialize();

    this.initTime = new Date().getTime();
  }

  activate() {
    super.activate();

    this.initTime = new Date().getTime();
  }

  step(dt) {
    this.position.x +=
      this.amplitudeVector.x *
      Math.sin(
        ((new Date().getTime() - this.initTime) / 1000) *
          this.frequencyVector.x +
          (this.phaseVector.x / 180) * Math.PI,
      ) *
      (dt / 1000);
    this.position.y +=
      this.amplitudeVector.y *
      Math.sin(
        ((new Date().getTime() - this.initTime) / 1000) *
          this.frequencyVector.y +
          (this.phaseVector.y / 180) * Math.PI,
      ) *
      (dt / 1000);

    // Tracker.step is where the attached items steps are called, so they go
    // after updating the tracker

    // Call inherited function
    super.step(dt);
  }

  draw(ctx) {
    // Call inherited function
    super.draw(ctx);

    if (engine.options.drawTrackers === true) {
      var pos = this.getParentPosition();
      ctx.strokeStyle = '#FF0000';
      ctx.lineWidth = 1;

      ctx.beginPath();
      ctx.moveTo(pos.x, pos.y);
      ctx.lineTo(pos.x + this.position.x, pos.y + this.position.y);
      ctx.closePath();
      ctx.stroke();
    }
  }
}
