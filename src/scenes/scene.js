import engine from '../engine';
import Item from '../item';
import * as GUI from '../gui/gui';
import UnalignedClock from '../clock';
import * as INPUT from '../input/input';

export default class Scene extends Item {
  constructor() {
    super();

    this.playable = false; // This screen is playable
    this.backgrounds = [];

    this.isCurrent = false; // Is the screen being used now

    this.gui = new GUI.GuiElement(this); // Different Gui for each scene

    this.clock = new UnalignedClock();
    this.input = new INPUT.SceneInput();
  }

  initialize() {
    super.initialize();

    this.gui.initialize();
    this.clock.initialize();
    this.input.initialize();
  }

  activate() {
    super.activate();

    this.gui.activate();
    this.clock.activate();
    this.input.activate();

    for (let i = 0, len = this.backgrounds.length; i < len; i++) {
      this.backgrounds[i].activate();
    }
  }

  draw(ctx) {
    // Test for safety: clean the full scene
    // If everything is well coded in the game, in theory this could be removed
    ctx.clearRect(0, 0, engine.core.size.x, engine.core.size.y);

    for (let i = 0, len = this.backgrounds.length; i < len; i++) {
      this.backgrounds[i].draw(ctx);
    }

    super.draw(ctx);
    this.gui.draw(ctx);
  }

  step(dt) {
    for (let i = 0, len = this.backgrounds.length; i < len; i++) {
      this.backgrounds[i].step(dt);
    }

    this.clock.step(dt);
    super.step(dt);
    this.gui.step(dt);
  }

  addBackground(background) {
    this.backgrounds.push(background);
  }
}
