import engine from '../engine';
import Item from '../item';
import * as MATH from '../math/math';

export default class Effect extends Item {
  constructor(effectType, x, y, vx, vy) {
    super();

    let spriteData = engine.sprites.sprites[effectType];

    this.size = new MATH.Point(spriteData[3], spriteData[4]);
    this.numFrames = spriteData[5];

    // position of the particle
    this.position = new MATH.Point(x, y);
    // velocity vector of the particle
    this.speed = new MATH.Point(vx, vy);

    this.lived = 0; // Num of steps lived
    this.lifeTime = 0; // Max num of steps to live (if 0 then ignored)
    this.maxLoops = 1; // Num of loops to be rendered

    this.spriteName = effectType;

    this.initialScaling = 1;
    this.finalScaling = 1;

    this.transparencyMethod = 0; // 0 -> no, 1->appear, 2->disappear
    this.globalAlpha = 1;
  }

  step(dt) {
    // Call inherited function
    super.step(dt);

    // let preFrame = this.currentFrame;
    this.lived++;

    let newScaling = 1;

    if (this.initialScaling != 1 || this.finalScaling != 1) {
      newScaling =
        this.initialScaling +
        ((this.finalScaling - this.initialScaling) * this.lived) /
          this.lifeTime;

      this.scaling.x = newScaling;
      this.scaling.y = newScaling;
    }

    if (this.transparencyMethod == 2) {
      // disappearing
      if (this.lifeTime !== 0) {
        this.globalAlpha = 1 - this.lived / this.lifeTime;
      } else {
        this.globalAlpha = 1 - this.currentFrame / this.numFrames;
      }
    } else if (this.transparencyMethod == 1) {
      // appearing
      if (this.lifeTime !== 0) {
        this.globalAlpha = this.lived / this.lifeTime;
      } else {
        this.globalAlpha = this.currentFrame / this.numFrames;
      }
    }

    // If the effect is animated, advance its frames
    if (this.isAnimated === true) {
      engine.sprites.step(dt, this);
    }

    // if (preFrame != this.currentFrame)
    //   engine.logs.log('Effect', 'pre ' + preFrame + ' current ' + this.currentFrame);
  }

  draw(ctx) {
    // Call inherited function
    super.draw(ctx);
  }
}
