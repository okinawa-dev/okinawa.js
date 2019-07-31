import engine from '../engine';
import Item from '../item';

export default class Background extends Item {
  constructor() {
    super();

    this.backgroundType = 'image'; // { color, image }

    this.color = 'black';
    this.spriteName = null;

    this.position.x = engine.core.size.x / 2;
    this.position.y = engine.core.size.y / 2;

    this.pauseScroll = false;

    this.verticalScroll = false;
    this.verticalOffset = 0;
    this.verticalSpeed = 0;
    this.horizontalScroll = false;
    this.horizontalOffset = 0;
    this.horizontalSpeed = 0;
  }

  initialize() {
    super.initialize();
  }

  activate() {
    super.activate();

    this.verticalOffset = 0;
    this.horizontalOffset = 0;
  }

  step(dt) {
    super.step(dt);

    // Not necessary if there are no animations, but here it is
    // if (this.spriteName != null)
    //   engine.sprites.step(dt, this);

    if (this.pauseScroll === false) {
      // Calculate the offset if we have scroll
      // Note: vertical OR horizontal scroll, NOT both
      if (this.verticalScroll === true) {
        this.verticalOffset +=
          (this.verticalSpeed * dt) / engine.core.TIME_PER_FRAME;
        this.verticalOffset = Math.floor(
          this.verticalOffset % engine.core.size.y
        );
      } else if (this.horizontalScroll === true) {
        this.horizontalOffset +=
          (this.horizontalSpeed * dt) / engine.core.TIME_PER_FRAME;
        this.horizontalOffset = Math.floor(
          this.horizontalOffset % engine.core.size.x
        );
      }
    }
  }

  draw(ctx) {
    if (this.backgroundType == 'color') {
      ctx.fillStyle = this.color;
      ctx.fillRect(0, 0, engine.core.size.x, engine.core.size.y);
    } else if (this.backgroundType == 'image') {
      let intOffset;
      let remaining;

      if (this.verticalScroll === true) {
        intOffset = Math.floor(this.verticalOffset);
        remaining = engine.core.size.y - intOffset;

        // Draw the top half of the background
        if (intOffset > 0) {
          ctx.drawImage(
            engine.sprites.getImage(this.spriteName),
            0,
            remaining,
            engine.core.size.x,
            intOffset,
            0,
            0,
            engine.core.size.x,
            intOffset
          );
        }

        // Draw the bottom half of the background
        if (remaining > 0) {
          ctx.drawImage(
            engine.sprites.getImage(this.spriteName),
            0,
            0,
            engine.core.size.x,
            remaining,
            0,
            intOffset,
            engine.core.size.x,
            remaining
          );
        }
      } else if (this.horizontalScroll === true) {
        intOffset = Math.floor(this.horizontalOffset);
        remaining = engine.core.size.x - intOffset;

        // Draw the right half of the background (left side of the image)
        if (intOffset > 0) {
          ctx.drawImage(
            engine.sprites.getImage(this.spriteName),
            0,
            0,
            intOffset,
            engine.core.size.y,
            remaining,
            0,
            intOffset,
            engine.core.size.y
          );
        }

        // Draw the left half of the background (right side of the image)
        if (remaining > 0) {
          ctx.drawImage(
            engine.sprites.getImage(this.spriteName),
            intOffset,
            0,
            remaining,
            engine.core.size.y,
            0,
            0,
            remaining,
            engine.core.size.y
          );
        }
      } else {
        // ctx, object
        // draw itself without using the parent draw function (Item.draw)
        engine.sprites.draw(ctx, this);
      }

      // super.draw(ctx);
    }
  }
}
