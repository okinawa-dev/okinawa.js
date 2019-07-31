import Options from './options';
import Logs from './logs';
import Core from './core';
import * as MATH from './math/math';
import Device from './device';
import Effects from './effects/effects';
import Particles from './effects/particles';
import Sprites from './assets/sprites';
import Sounds from './assets/sounds';
import Clock from './clock';
import Localization from './localization/localization';
import * as INPUT from './input/input';
import * as GUI from './gui/gui';

class Engine {
  constructor() {
    this.options = null;
    this.logs = null;
    this.core = null;
    this.math = null;
    this.device = null;
    this.effects = null;
    this.particles = null;
    this.sprites = null;
    this.sounds = null;
    this.clock = null;
    this.localization = null;
    this.input = null;
    this.controls = null;
    this.gui = null;
    this.scenes = null;
    this.preloader = null;
    this.game = null;

    this.externalCallback = null;
  }

  initialize(canvasElementId, gameClassName, callbackFunction) {
    this.options = new Options();
    this.logs = new Logs();
    this.core = new Core();
    this.math = new MATH.Math();
    this.device = new Device();
    this.effects = new Effects();
    this.particles = new Particles();
    this.sprites = new Sprites();
    this.sounds = new Sounds();
    this.clock = new Clock();
    this.localization = new Localization();
    this.input = new INPUT.Controller();
    this.gui = new GUI.GuiElement();

    this.scenes = new Engine.SceneCollection();
    this.preloader = new Engine.Preloader();

    this.logs.log('Engine::initialize', 'Initializing starts...');

    try {
      this.game = new window[gameClassName]();
    } catch (err) {
      this.logs.log('Engine::initialize', 'Error instantiating game class');
      return;
    }

    if (callbackFunction !== null) {
      this.externalCallback = callbackFunction;
    }

    this.core.initialize(canvasElementId);
    this.math.initialize();
    this.device.initialize();
    this.effects.initialize();
    this.particles.initialize();
    this.sprites.initialize();
    this.sounds.initialize();

    this.clock.initialize();
    this.clock.suscribeOneSecond('testFPS', function() {
      if (this.options.showFps) {
        this.gui.get('console').addText('fps', this.core.fpsPassed + ' fps');
      }
      this.core.fpsPassed = 0;
    });

    this.input.initialize();
    this.localization.initialize();

    // TODO maybe remove this from global engine someday
    // Global GUI
    let console = new Engine.GUI.GuiConsole();
    console.setSize(170, 30);
    console.setPosition(15 + console.size.x / 2, 15 + console.size.y / 2); // left down
    console.order = Engine.GUI.ORDENATION.UP;

    this.gui.initialize();
    this.gui.attachItem(console, 'console');

    this.scenes.initialize();

    this.preloader.playable = false; // Just in case
    this.preloader.initialize();
    this.game.initialize();
  }

  external(eventType, id, message) {
    if (this.externalCallback !== null) {
      setTimeout(function() {
        try {
          this.externalCallback(eventType, id, message);
        } catch (err) {
          this.logs.log(
            'Engine::external',
            'Error with external callback with event ' + eventType + ' ' + id
          );
        }
      }, 1);
    }
  }
}

// singleton pattern
const engine = new Engine();
export default engine;
