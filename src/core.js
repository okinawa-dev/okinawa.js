import Point from './math/point';
import * as INPUT from './input/input';
import * as GUI from './gui/gui';

export default class Core {
  constructor(engine) {
    // reference to the external object
    this._engine = engine;

    this.FRAMES_PER_SECOND = 60;
    this.TIME_PER_FRAME = 1000 / this.FRAMES_PER_SECOND; // milliseconds

    this.paused = false;
    this.halted = false;

    // Drawing state
    this.canvas = null;
    this.ctx = null;

    this.size = new Point(500, 500);

    // Should use requestAnimationFrame or not
    this.useAnimationFrame = false;
    this.timeLastRender = new Date().getTime(); // Time since last render
    this.timeGameStart = new Date().getTime(); // Init time

    // To count frames per second
    this.fpsPassed = 0; // frames rendered since last time
    this.fps = this.FRAMES_PER_SECOND; // updated only each second
  }

  // Game Initialization
  initialize(canvasElementId) {
    this._engine.logs.log(
      'Engine::Core.initialize',
      'Initializing engine core object'
    );

    this.canvas = document.getElementById(canvasElementId);
    this.size.x = this.canvas.width;
    this.size.y = this.canvas.height;
    this.timeLastRender = new Date().getMilliseconds();

    this.ctx = this.canvas.getContext && this.canvas.getContext('2d');

    if (!this.ctx) {
      this._engine.logs.log(
        'Engine::Core.initialize',
        'Old browser, unable to create canvas context'
      );
      alert('Unable to get canvas context. Old browser?');
      return null;
    }

    this._engine.logs.log(
      'Engine::Core.initialize',
      'UserAgent: ' + this._engine.device.getUserAgent()
    );

    // Sometimes this is slower, I don't know why, and that makes me angry :(
    if (
      this._engine.options.useAnimationFrame === false ||
      window.requestAnimationFrame === null
    ) {
      this.useAnimationFrame = false;
      this._engine.logs.log(
        'Engine::Core.initialize',
        'NOT using requestAnimationFrame'
      );
    } else {
      this.useAnimationFrame = true;
      this._engine.logs.log(
        'Engine::Core.initialize',
        'Modern browser, using requestAnimationFrame'
      );
    }

    // Start main loop
    this.loop();

    return 1;
  }

  // Game Initialization
  activate() {
    this._engine.logs.log('Engine::activate', 'Starting engine');

    this._engine.game.activate();
    this._engine.gui.activate();

    this._engine.scenes.advanceScene();
  }

  eventKeyPressed(keyCode) {
    // this._engine.logs.log('Engine::eventKeyPressed', 'Key Pressed: ' + keyCode);

    if (keyCode == INPUT.KEYS.P && this._engine.options.allowPause === true) {
      if (this.paused) this.unpauseGame();
      else if (this._engine.scenes.getCurrentScene().playable !== false)
        this.pauseGame();
    } else if (
      keyCode == INPUT.KEYS.ESC &&
      this._engine.options.allowHalt === true
    ) {
      if (this.halted) {
        this.halted = false;
        this._engine.logs.log('Engine::eventKeyPressed', 'Engine un-halted');
        // To avoid a jump in animations and movements, as timeLastRender haven has not been
        // updated since last step()
        this.timeLastRender = new Date().getTime();
        this.loop();
      } else {
        this.halted = true;
        this._engine.logs.log('Engine::eventKeyPressed', 'Engine halted');
        this._engine.gui.get('console').addText('halt', 'Engine halted');
        this._engine.gui.draw(this.ctx); // Force draw before halting the loop
      }
    } else if (
      keyCode == INPUT.KEYS.F &&
      this._engine.options.allowFForFps === true
    ) {
      if (this._engine.options.showFps === true)
        this._engine.options.showFps = false;
      else this._engine.options.showFps = true;
    }
  }

  // Game Loop
  loop() {
    var now = new Date().getTime();
    var dt = now - this.timeLastRender;

    if (dt >= this._engine.core.TIME_PER_FRAME) {
      this.timeLastRender = now;
      var sc = this._engine.scenes.getCurrentScene();

      if (this.halted) return;

      // Only the current scene
      if (sc && sc.isCurrent === true) {
        // Only advance game logic if game is not paused
        if (this.paused === false) {
          sc.step(dt);
          if (this._engine.game !== undefined) this._engine.game.step(dt);
          this._engine.effects.step(dt);
          this._engine.particles.step(dt);
        }

        this._engine.clock.step(dt);
        this._engine.gui.step(dt);

        // Render current level
        sc.draw(this.ctx);

        this._engine.effects.draw(this.ctx);
        this._engine.particles.draw(this.ctx);

        // FPS related stuff
        this.fpsPassed++;

        if (this._engine.options.showStatistics === true) {
          if (sc.getAttachedItems().length > 0)
            this._engine.gui
              .get('console')
              .addText(
                'numItems',
                sc.getAttachedItems().length +
                  ' ' +
                  this._engine.localization.get('items')
              );
          if (this._engine.effects.effects.length > 0)
            this._engine.gui
              .get('console')
              .addText(
                'numEffects',
                this._engine.effects.effects.length +
                  ' ' +
                  this._engine.localization.get('effects')
              );
          if (this._engine.particles.particles.length > 0)
            this._engine.gui
              .get('console')
              .addText(
                'numParticles',
                this._engine.particles.particles.length +
                  ' ' +
                  this._engine.localization.get('particles')
              );
        }

        this._engine.gui.draw(this.ctx);
      }

      // If the loop has been executed, wait a full TIME_PER_FRAME until next loop step
      dt = 0;
    }

    if (this.useAnimationFrame === true)
      window.requestAnimationFrame(function() {
        this._engine.core.loop();
      });
    else {
      setTimeout(function() {
        this._engine.core.loop();
      }, this._engine.core.TIME_PER_FRAME - dt);
    }
  }

  clearScreen() {
    this.ctx.clearRect(0, 0, this.size.x, this.size.y);
  }

  pauseGame() {
    if (this._engine.options.allowPause === false) return;

    this.paused = true;

    if (this._engine.gui.get('pause') === null) {
      var text = new GUI.GuiText(
        this._engine.localization.get('paused'),
        500,
        30
      );
      text.setFontColor('#FF2222');
      text.setAlign(GUI.ALIGN.CENTER);
      text.setPosition(this.size.x / 2, this.size.y / 2 + 100);

      this._engine.gui.attachItem(text, 'pause');
    }
  }

  unpauseGame() {
    if (this._engine.options.allowPause === false) return;

    this.paused = false;

    this._engine.gui.detachItem('pause');
  }
}
