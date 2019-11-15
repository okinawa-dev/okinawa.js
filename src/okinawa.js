import Options from './options';
import Logs from './logs';
import Core from './core';
import Device from './device';
import Effects from './effects/effects';
import Particles from './effects/particles';
import Sprites from './handlers/sprites';
import Sounds from './handlers/sounds';
import Fonts from './handlers/fonts';
import Clock from './clocks/clock';
import Localization from './localization/localization';
import * as INPUT from './input/input';
import * as GUI from './gui/gui';
import * as MATH from './math/math';
import Scenes from './scenes/scenes';
import Preloader from './scenes/preloader';
import Player from './player';
import Engine from './engine';
import Init from './init';

let okinawa = {
  Options,
  Logs,
  Core,
  Device,
  Effects,
  Particles,
  Sprites,
  Sounds,
  Fonts,
  Clock,
  Localization,
  Scenes,
  Preloader,
  Player,
  INPUT,
  GUI,
  MATH,
  Engine,
  Init
};

export default okinawa;
