import * as MATH from '../math/math';

const SPRITEINFO = {
  PATH: 0,
  XSTART: 1,
  YSTART: 2,
  WIDTH: 3,
  HEIGTH: 4,
  FRAMES: 5,
  INITFRAME: 6,
  FRAMESPEED: 7,
};

export default class Sprites {
  constructor() {
    // Information related to each sprite, as it was configured in the preloader, indexed by
    // the sprite id/name
    // sprites[spriteName] = [imagePath, xStart, yStart, width, height, frames, initFrame, speed]
    this.sprites = {};

    // List of Image() objects used in the game, indexed by original URL
    // images[path] = object;
    this.images = {};
  }

  initialize() {
    // engine.logs.log('engine.sprites.initialize', 'Initializing sprites Handler');

    this.sprites.length = 0;
    this.images.length = 0;
  }

  step(dt, object) {
    let fps = this.sprites[object.spriteName][SPRITEINFO.FRAMESPEED];
    let frames = this.sprites[object.spriteName][SPRITEINFO.FRAMES];
    let initFrame = this.sprites[object.spriteName][SPRITEINFO.INITFRAME];

    // If the item wants to be rendered at different frame speed
    if (object.forceFrameSpeed !== 0) {
      fps = object.forceFrameSpeed;
    }

    // if frames > 1 -> animation
    if (frames > 1) {
      let now = new Date().getTime();

      // If the animation just started
      if (object.timeLastFrame === 0) {
        object.timeLastFrame = now;
      }

      // If time enough has passed to change the currentFrame
      if (now - object.timeLastFrame > 1000 / fps) {
        let preFrame = object.currentFrame;

        object.currentFrame++;

        if (object.currentFrame >= initFrame + frames) {
          object.currentFrame = initFrame;
        }

        object.timeLastFrame = now;

        // If the animation restarts, increment loop counter
        if (preFrame == frames - 1) {
          object.numLoops += 1;
          if (typeof object.eventAnimationRestart !== 'undefined') {
            object.eventAnimationRestart();
          }
        }
      }
    }
  }

  draw(ctx, object) {
    if (object.getVisible() === false) {
      return;
    }

    // sprites[i] -> [imagePath, xStart, yStart, width, height, frames, initFrame, speed]
    let image = this.sprites[object.spriteName][SPRITEINFO.PATH];
    let xStart = this.sprites[object.spriteName][SPRITEINFO.XSTART];
    let yStart = this.sprites[object.spriteName][SPRITEINFO.YSTART];
    let width = this.sprites[object.spriteName][SPRITEINFO.WIDTH];
    let height = this.sprites[object.spriteName][SPRITEINFO.HEIGTH];
    // let frames = this.sprites[object.spriteName][SPRITEINFO.FRAMES];

    let position = object.getPosition();

    // Set transparency
    ctx.globalAlpha = object.globalAlpha;

    if (object.rotation.getAngle() !== 0) {
      ctx.save();

      ctx.translate(position.x, position.y);
      ctx.rotate(object.rotation.getAngle());

      ctx.drawImage(
        this.images[image],
        xStart + object.currentFrame * width,
        yStart,
        width,
        height,
        (-width / 2) * object.scaling.x,
        (-height / 2) * object.scaling.y,
        width * object.scaling.x,
        height * object.scaling.y
      );

      ctx.restore();
    }
    // Draw without rotation
    else {
      ctx.drawImage(
        this.images[image],
        xStart + object.currentFrame * width,
        yStart,
        width,
        height,
        position.x - (width / 2) * object.scaling.x,
        position.y - (height / 2) * object.scaling.y,
        width * object.scaling.x,
        height * object.scaling.y
      );
    }

    // restore, just in case
    ctx.globalAlpha = 1;
  }

  imageExists(path) {
    return Object.prototype.hasOwnProperty.call(this.images, path);
    // return this.images.hasOwnProperty(path);
  }

  spriteExists(name) {
    return Object.prototype.hasOwnProperty.call(this.sprites, name);
    // return this.sprites.hasOwnProperty(name);
  }

  addImage(path, object) {
    this.images[path] = object;
  }

  addSprite(
    name,
    path,
    xStart,
    yStart,
    width,
    height,
    frames,
    initFrame,
    speed
  ) {
    this.sprites[name] = [
      path,
      xStart,
      yStart,
      width,
      height,
      frames,
      initFrame,
      speed,
    ];
  }

  // Returns the object to be painted in the context
  getImage(spriteName) {
    // this.sprites[spriteName][0] -> full path from the spriteName
    return this.images[this.sprites[spriteName][SPRITEINFO.PATH]];
  }

  getImageFromPath(path) {
    return this.images[path];
  }

  getSpriteData(spriteName) {
    let ret = this.sprites[spriteName];

    if (typeof ret !== 'undefined') {
      return ret;
    }

    return null;
  }

  getSpriteInfo(spriteName, value) {
    let ret = this.sprites[spriteName];

    if (typeof ret !== 'undefined') {
      let info = ret[value];

      if (typeof info !== 'undefined') {
        return info;
      }
    }

    return null;
  }

  getSpriteSize(spriteName) {
    let ret = this.sprites[spriteName];
    let w = 0;
    let h = 0;

    if (typeof ret !== 'undefined') {
      w = ret[SPRITEINFO.WIDTH];
      h = ret[SPRITEINFO.HEIGTH];
    }

    return new MATH.Point(w, h);
  }
}
