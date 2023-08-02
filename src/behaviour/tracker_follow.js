import engine from '../engine';
import Tracker from './tracker';
import * as MATH from '../math/math';

export default class TrackerFollow extends Tracker {
  constructor(callback) {
    super(callback);

    this.targetOb = null;
    this.lastDirection = null; // In case target disappears

    this.trackSpeed = 1;
  }

  initialize() {
    super.initialize();
  }

  activate() {
    super.activate();
  }

  setTarget(target) {
    this.targetOb = target;
  }

  step(dt) {
    let pos = this.getPosition();
    let targetPos = this.targetOb.getPosition();
    let direction = null;
    let forceDetach = false;

    // The target has been removed from the scene
    if (this.targetOb.getParent() === null) {
      direction = this.lastDirection;
      forceDetach = true;
    } else {
      direction = new MATH.Point(targetPos.x - pos.x, targetPos.y - pos.y);

      direction = direction.normalize();
      this.lastDirection = direction;
    }

    let movement = new MATH.Point(
      direction.x * this.trackSpeed,
      direction.y * this.trackSpeed,
    );
    let futurePos = new MATH.Point(pos.x + movement.x, pos.y + movement.y);

    let distanceToTarget = engine.math.pointDistance(pos, targetPos);
    let distanceToFuture = engine.math.pointDistance(pos, futurePos);

    if (forceDetach === false && distanceToTarget > distanceToFuture) {
      this.position.x = futurePos.x;
      this.position.y = futurePos.y;
    } else {
      if (this.getParent() !== null) {
        this.position.x = targetPos.x;
        this.position.y = targetPos.y;

        // Move all children from here to the parent
        for (let i = 0, len = this.getAttachedItems().length; i < len; i++) {
          let element = this.getAttachedItems()[i];

          element.position.x += this.position.x;
          element.position.y += this.position.y;

          // Exit speed, so the element does not stop
          element.speed.x = direction.x * this.trackSpeed;
          element.speed.y = direction.y * this.trackSpeed;

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
      let pos = this.getPosition();
      let targetPos = this.targetOb.getPosition();
      let gradient = ctx.createLinearGradient(
        pos.x,
        pos.y,
        targetPos.x,
        targetPos.y,
      );
      gradient.addColorStop(0, '#009');
      gradient.addColorStop(1, '#900');
      ctx.strokeStyle = gradient;
      // ctx.strokeStyle = '#FF0000';
      ctx.lineWidth = 1;

      ctx.beginPath();
      ctx.moveTo(pos.x, pos.y);
      ctx.lineTo(targetPos.x, targetPos.y);
      ctx.stroke();
    }
  }
}
