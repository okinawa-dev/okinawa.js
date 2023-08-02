import engine from '../engine';
import Tracker from './tracker';
// import * as MATH from '../math/math';

export default class TrackerBezier extends Tracker {
  constructor(callback) {
    super(callback);

    // Example of bezier speed
    this.trackSpeed = 1 / 250;

    // For Bezier tracks
    this.bezierAdvance = 0;

    this.p0 = null;
    this.p1 = null;
    this.p2 = null;
    this.p3 = null;

    // let p0 = { x: -60,  y: -10  };
    // let p1 = { x: -70,  y: -200 };
    // let p2 = { x: -125, y: -200 };
    // let p3 = { x: 100,  y: -350 };

    // this.bezierPoints(p0, p1, p2, p3);
  }

  initialize() {
    super.initialize();
  }

  activate() {
    super.activate();
  }

  bezierPoints(p0, p1, p2, p3) {
    this.p0 = p0;
    this.p1 = p1;
    this.p2 = p2;
    this.p3 = p3;

    this.cx = 3 * (this.p1.x - this.p0.x);
    this.bx = 3 * (this.p2.x - this.p1.x) - this.cx;
    this.ax = this.p3.x - this.p0.x - this.cx - this.bx;

    this.cy = 3 * (this.p1.y - this.p0.y);
    this.by = 3 * (this.p2.y - this.p1.y) - this.cy;
    this.ay = this.p3.y - this.p0.y - this.cy - this.by;
  }

  step(dt) {
    let t = this.bezierAdvance;
    this.bezierAdvance += (this.trackSpeed * dt) / engine.core.TIME_PER_FRAME;

    // let oldX = this.position.x;
    // let oldY = this.position.y;

    this.position.x =
      this.ax * (t * t * t) + this.bx * (t * t) + this.cx * t + this.p0.x;
    this.position.y =
      this.ay * (t * t * t) + this.by * (t * t) + this.cy * t + this.p0.y;

    // inform the attached items we are moving
    // for (let i = 0, len = this.getAttachedItems().length; i < len; i++)
    // {
    //   let element = this.getAttachedItems()[i];
    //   if (this.position.x > oldX)
    //     element.informEvent(EVENTS.RIGHT);
    //   else if (this.position.x < oldX)
    //     element.informEvent(EVENTS.LEFT);
    //   if (this.position.y > oldY)
    //     element.informEvent(EVENTS.DOWN);
    //   else if (this.position.y < oldY)
    //     element.informEvent(EVENTS.UP);
    // }

    // End of the curve
    if (this.bezierAdvance > 1) {
      this.bezierAdvance = 1;

      if (this.getParent() !== null) {
        // Move all children from here to the parent
        for (let i = 0, len = this.getAttachedItems().length; i < len; i++) {
          let element = this.getAttachedItems()[i];

          element.position.x += this.position.x;
          element.position.y += this.position.y;

          this.detachItem(element);
          this.getParent().attachItem(element);
        }

        // Suicide!
        this.getParent().detachItem(this);
      }

      if (this.callback) {
        this.callback();
      }
    }

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
        pos.x + this.p0.x,
        pos.y + this.p0.y,
        pos.x + this.p3.x,
        pos.y + this.p3.y,
      );

      gradient.addColorStop(0, '#009');
      gradient.addColorStop(1, '#900');
      ctx.strokeStyle = gradient;
      ctx.fillStyle = null;

      ctx.lineWidth = 1;
      // ctx.strokeStyle = '#FF0000';

      ctx.beginPath();
      ctx.moveTo(pos.x + this.p0.x, pos.y + this.p0.y);
      ctx.bezierCurveTo(
        pos.x + this.p1.x,
        pos.y + this.p1.y,
        pos.x + this.p2.x,
        pos.y + this.p2.y,
        pos.x + this.p3.x,
        pos.y + this.p3.y,
      );
      ctx.stroke();
    }
  }
}
