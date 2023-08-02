/*
 *  Base object
 *  Everything on screen should inherit from here
 */

import engine from './engine';
import * as MATH from './math/math';

export default class Item {
  constructor() {
    this.spriteName = null;

    // If false, will not be rendered by the spriteHandler
    this._visible = true;

    this.position = new MATH.Point();
    this.size = new MATH.Point();
    this.scaling = new MATH.Point(1, 1);

    this.speed = new MATH.Point();
    this.maxVel = 0; // maximum speed
    this.accel = 0; // acceleration

    this.vRot = 0; // rotation speed
    this.maxVRot = 0; // max rotation speed
    this.accelRot = 0; // rotation accel
    this.rotation = new MATH.Rotation();

    this.globalAlpha = 1;

    this.maxRadius = 0; // object radius
    this.collisionRadius = 0; // smaller radius for collsions

    // If isAnimated == true, the object itself would call the spriteHandler to ask
    // for its new frame, etc
    this.isAnimated = false;
    this.currentFrame = 0; // for animations
    // this.numFrames       = 1;
    this.numLoops = 1; // times the animation has been repeated
    // for animations (last time when frame changed)
    this.forceFrameSpeed = 0; // 0 == spriteHandler will use default animation speed
    this.timeLastFrame = 0; // new Date().getTime();

    // Object hierarchy on the screen
    this._attachedItems = []; // objects attached to current position
    this._removedItems = []; // objects to be removed at the end of step()
    this._parent = null; // object this item is attached to
  }

  initialize() {}

  activate() {
    for (let i = 0, len = this._attachedItems.length; i < len; i++) {
      let what = this._attachedItems[i];
      what.activate();
    }
  }

  getVisible() {
    return this._visible;
  }
  setVisible(value) {
    this._visible = value;
  }

  getParent() {
    return this._parent;
  }
  setParent(parent) {
    this._parent = parent;
  }

  getParentScene() {
    let p = this;

    while (p.getParent() !== null) {
      p = p.getParent();
    }

    if (p === this) {
      // global object not in a scene? should not happen
      return engine.scenes.getCurrentScene();
    }

    return p;
  }

  getAttachedItems() {
    return this._attachedItems;
  }
  attachItem(what) {
    // this._attachedItems[this._attachedItems.length] = what;
    this._attachedItems.push(what);
    what.setParent(this);
  }

  detachItem(what) {
    let scene = this.getParentScene();

    // stop listening to input events
    scene.input.removeListeners(what);

    let list = what.children();

    for (let i = 0, len = list.length; i < len; i++)
      scene.input.removeListeners(list[i]);

    this._removedItems.push(what);
    what.setParent(null);
    // delete this.items[index]; // mark the position as undefined, does not change the array size
    // this.items.splice(index, 1);
  }

  detachAllItems() {
    for (let i = 0, len = this._attachedItems.length; i < len; i++) {
      let what = this._attachedItems[i];

      // recursive !!
      what.detachAllItems();
      // what._finalizeRemoved();

      this.detachItem(what);
    }

    this._finalizeRemoved();
  }

  children() {
    let chs = [];

    for (let i = 0, len = this._attachedItems.length; i < len; i++) {
      chs = chs.concat(this._attachedItems[i]);
      chs = chs.concat(this._attachedItems[i].children());
    }

    return chs;
  }
  _resetItems() {
    this._attachedItems.length = 0;
  }

  // Reset the list of removed items
  _resetRemoved() {
    this._removedItems.length = 0;
  }

  // Remove any items marked for removal
  _finalizeRemoved() {
    for (let i = 0, len = this._removedItems.length; i < len; i++) {
      let what = this._removedItems[i];
      let idx = this._attachedItems.indexOf(what);

      if (idx != -1) {
        // what.detachAllItems();
        this._attachedItems.splice(idx, 1);
      }
    }
    // Reset the list of removed objects
    this._resetRemoved();
  }

  setImage(spriteName) {
    this.spriteName = spriteName;
    this.size = engine.sprites.getSpriteSize(spriteName);
  }

  getOrigin() {
    let center = this.getPosition();

    return new MATH.Point(
      center.x - this.size.x / 2,
      center.y - this.size.y / 2,
    );
  }

  getPosition() {
    let result = new MATH.Point();
    let parentPosition = new MATH.Point();
    let transformedPosition = new MATH.Point();

    if (this._parent !== null) {
      parentPosition = this._parent.getPosition();
      transformedPosition = this._parent.rotation.transformPosition(
        this.position,
      );
      result.x = transformedPosition.x + parentPosition.x;
      result.y = transformedPosition.y + parentPosition.y;
    } else {
      result.x = this.position.x;
      result.y = this.position.y;
    }

    return result;
  }

  setPosition(x, y) {
    this.position.x = x;
    this.position.y = y;
  }

  getSize() {
    return this.size;
  }
  setSize(x, y) {
    this.size.x = x;
    this.size.y = y;
  }

  getScaling() {
    return this.scaling;
  }
  setScaling(x, y) {
    this.scaling.x = x;
    this.scaling.y = y;
  }

  getSpeed() {
    return this.speed;
  }
  setSpeed(x, y) {
    this.speed.x = x;
    this.speed.y = y;
  }

  getParentPosition() {
    if (this._parent !== null) {
      return this._parent.getPosition();
    } else {
      return new MATH.Point();
    }
  }

  getParentSpeed() {
    if (this._parent !== null) {
      return this._parent.getSpeed();
    } else {
      return new MATH.Point();
    }
  }

  getRadius() {
    return Math.sqrt(
      Math.pow(this.size.x / 2, 2) + Math.pow(this.size.y / 2, 2),
    );
  }

  getMagnitude() {
    return Math.sqrt(
      this.speed.x * this.speed.x + this.speed.y * this.speed.y,
    );
  }

  move(dx, dy) {
    this.position.x += dx;
    this.position.y += dy;
  }

  rotate(dRot) {
    this.rotation.rotate(dRot);
  }

  setRotation(rot) {
    this.rotation.update(rot);
  }

  getRotation() {
    if (this._parent !== null) {
      return this.rotation.getAngle() + this._parent.getRotation();
    } else {
      return this.rotation.getAngle();
    }
  }

  draw(ctx) {
    if (this._visible === true) {
      for (let i = 0, len = this._attachedItems.length; i < len; i++) {
        this._attachedItems[i].draw(ctx);
      }
      if (this.spriteName !== null) {
        engine.sprites.draw(ctx, this);
      }

      if (engine.options.drawBoundingBoxes === true) {
        this.drawHelper(ctx, 'spriteBox');
      }
      if (engine.options.drawMaxRadius === true) {
        this.drawHelper(ctx, 'maxRadius');
      }
      if (engine.options.drawCollisionRadius === true) {
        this.drawHelper(ctx, 'collisionRadius');
      }
      if (engine.options.drawOrigins === true) {
        this.drawHelper(ctx, 'origin');
      }
      if (engine.options.drawCenters === true) {
        this.drawHelper(ctx, 'center');
      }
      if (engine.options.drawDirectionVectors === true) {
        this.drawHelper(ctx, 'direction');
      }
    }
  }

  step(dt) {
    if (this.speed.x !== 0 || this.speed.y !== 0)
      this.move(
        (this.speed.x * dt) / engine.core.TIME_PER_FRAME,
        (this.speed.y * dt) / engine.core.TIME_PER_FRAME,
      );

    if (this.vRot !== 0) {
      this.rotate((this.vRot * dt) / engine.core.TIME_PER_FRAME);
    }
    // Advance the necessary frames in the animation if needed
    if (this.isAnimated === true && this.spriteName !== null) {
      engine.sprites.step(dt, this);
    }

    for (let i = 0, len = this._attachedItems.length; i < len; i++) {
      this._attachedItems[i].step(dt);
    }
    // Remove any objects marked for removal
    this._finalizeRemoved();
  }

  eventAnimationRestart() {}

  drawHelper(ctx, what) {
    let pos = this.getPosition();
    let size = this.getSize();
    let scale = this.getScaling();

    // Draw the collisionRadius
    if ('maxRadius' == what) {
      ctx.beginPath();
      ctx.arc(pos.x, pos.y, this.maxRadius, 0, 2 * Math.PI, false);
      ctx.closePath();
      ctx.lineWidth = 1;
      ctx.strokeStyle = '#FF0000';
      ctx.stroke();
    } else if ('collisionRadius' == what) {
      ctx.beginPath();
      ctx.arc(pos.x, pos.y, this.collisionRadius, 0, 2 * Math.PI, false);
      ctx.closePath();
      ctx.lineWidth = 1;
      ctx.strokeStyle = '#FF0000';
      ctx.stroke();
    }
    // Draw the origin
    else if ('origin' == what) {
      ctx.fillStyle = '#FF0000';
      ctx.fillRect(
        pos.x - (size.x / 2) * scale.x,
        pos.y - (size.y / 2) * scale.y,
        2,
        2,
      );
    } else if ('center' == what) {
      ctx.fillStyle = '#FF0000';
      ctx.fillRect(pos.x, pos.y, 2, 2);
    } else if ('spriteBox' == what) {
      ctx.lineWidth = 1;
      ctx.strokeStyle = '#FF0000';
      ctx.strokeRect(
        pos.x - (size.x / 2) * scale.x,
        pos.y - (size.y / 2) * scale.y,
        size.x * scale.x,
        size.y * scale.y,
      );
    } else if ('direction' == what) {
      let speed = this.getSpeed();

      ctx.lineWidth = 1;
      ctx.strokeStyle = '#FF0000';
      ctx.beginPath();
      ctx.moveTo(pos.x, pos.y);
      ctx.lineTo(pos.x + speed.x * 10, pos.y + speed.y * 10);
      ctx.stroke();
    }
  }

  // By default, when an item collides, it is deleted
  // Objects which inherit from Item must implement their own collide method
  collide() {
    // Delete the attached items
    this.detachAllItems();

    // true if object should be removed, false otherwise
    return true;
  }
}
