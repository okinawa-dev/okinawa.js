import Options from './options';
import Logs from './logs';
import Core from './core';
import Device from './device';
import Effects from './effects/effects';
import Particles from './effects/particles';
import Sprites from './handlers/sprites';
import Sounds from './handlers/sounds';
import Fonts from './handlers/fonts';
import Scenes from './handlers/scenes';
import Clock from './clocks/clock';
import Localization from './localization/localization';
import * as INPUT from './input/input';
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
    this.fonts = null;
    this.clock = null;
    this.localization = null;
    this.input = null;
    this.controls = null;
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
    this.fonts = new Fonts();
    this.clock = new Clock();
    this.localization = new Localization();
    this.input = new INPUT.Receiver();
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

    if (typeof callbackFunction !== 'undefined') {
      this.externalCallback = callbackFunction;
    }

    this.core.initialize(canvasElementId);
    this.device.initialize();
    this.effects.initialize();
    this.particles.initialize();
    this.sprites.initialize();
    this.sounds.initialize();
    this.clock.initialize();
    this.input.initialize();
    this.localization.initialize();
    this.scenes.initialize();

    this.preloader.playable = false; // Just in case
    this.preloader.initialize();
    this.game.initialize();
  }

  external(eventType, id, message) {
    if (typeof externalCallback !== 'undefined') {
      setTimeout(() => {
        try {
          this.externalCallback(eventType, id, message);
        } catch (err) {
          this.logs.log(
            'Engine::external',
            'Error with external callback with event ' + eventType + ' ' + id,
          );
        }
      }, 1);
    }
  }
}

// singleton pattern
const engine = new Engine();
export default engine;
