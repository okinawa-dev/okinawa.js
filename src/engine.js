import Options from './options';
import Logs from './logs';
import Core from './core';
import Device from './device';
import Effects from './effects/effects';
import Particles from './effects/particles';
import Sprites from './assets/sprites';
import Sounds from './assets/sounds';
import Clock from './clocks/clock';
import Localization from './localization/localization';
import * as INPUT from './input/input';
import * as GUI from './gui/gui';
import Scenes from './scenes/scenes';
import Preloader from './scenes/preloader';
import Player from './player';

class Engine {
  constructor() {
    this.options = null;
    this.logs = null;
    this.core = null;
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
    this.player = null;
  }

  initialize(canvasElementId, gameObject, callbackFunction) {
    this.options = new Options();
    this.logs = new Logs();
    this.core = new Core();
    this.device = new Device();
    this.effects = new Effects();
    this.particles = new Particles();
    this.sprites = new Sprites();
    this.sounds = new Sounds();
    this.clock = new Clock();
    this.localization = new Localization();
    this.input = new INPUT.Controller();
    this.gui = new GUI.GuiElement();
    this.scenes = new Scenes();
    this.preloader = new Preloader();
    // empty player object, probably it will be crushed by
    // a specific game player object
    this.player = new Player();

    this.logs.log('Engine::initialize', 'Initializing starts...');

    // try {
    //   this.game = new window[gameObject]();
    // } catch (err) {
    //   this.logs.log('Engine::initialize', 'Error instantiating game class');
    //   return;
    // }
    this.game = gameObject;

    if (callbackFunction !== null) {
      this.externalCallback = callbackFunction;
    }

    this.core.initialize(canvasElementId);
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
    let console = new GUI.GuiConsole();
    console.setSize(170, 30);
    console.setPosition(15 + console.size.x / 2, 15 + console.size.y / 2); // left down
    console.order = GUI.ORDENATION.UP;

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
