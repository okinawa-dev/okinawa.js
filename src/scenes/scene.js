import engine from '../engine';
import Item from '../item';
import * as GUI from '../gui/gui';
import Clock from '../clocks/clock';
import * as INPUT from '../input/input';

export default class Scene extends Item {
  constructor() {
    super();

    this.playable = false; // This screen is playable
    this.backgrounds = [];
    this.isCurrent = false; // Is the screen being used now

    this.gui = new GUI.GuiElement(this); // Different Gui for each scene
    this.clock = new Clock();
    this.input = new INPUT.Controller();
  }

  initialize() {
    super.initialize();

    // Commmon GUI elements in every scene
    let console = new GUI.GuiConsole();
    console.setSize(170, 30);
    console.setPosition(15 + console.size.x / 2, 15 + console.size.y / 2); // left down
    console.order = GUI.ORDENATION.DOWN;
    this.gui.initialize();
    this.gui.attachItem(console, 'console');

    this.clock.initialize();
    this.clock.suscribeOneSecond('FPS', () => {
      if (engine.options.showFps) {
        this.gui.get('console').addText('fps', engine.core.fpsPassed + ' fps');
      }
      engine.core.fpsPassed = 0;
    });

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

  pauseGame() {
    if (this.gui.get('pause') === null) {
      let text = new GUI.GuiText(engine.localization.get('paused'), 500, 30);
      text.setFontColor('#FF2222');
      text.setAlign(GUI.ALIGN.CENTER);
      text.setPosition(engine.core.size.x / 2, engine.core.size.y / 2 + 100);

      this.gui.attachItem(text, 'pause');
    }
  }

  unpauseGame() {
    this.gui.detachItem('pause');
  }
}
