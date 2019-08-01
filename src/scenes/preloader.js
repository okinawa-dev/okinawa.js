/* global Font */

import engine from '../engine';
import Scene from './scene';
import * as GUI from '../gui/gui';
import { addEvent, getProtocolAndHost } from '../utils';
import '../../lib/font.js/Font';

export default class Preloader extends Scene {
  constructor() {
    super();

    this.timeStarted = 0; // timestamp when activate() was called
    this.percentageLoaded = 0; // Percentage of files loaded
    this.incremental = 0; // current loader step in the incrementalLoader function
    this.imageAssets = []; // Assets to load
    this.totalImages = 0; // Number of different images to be loaded
    this.soundAssets = [];
    this.totalFonts = 0; // Number of fonts to be loaded

    this.message = null;
  }

  initialize() {
    super.initialize();
  }

  activate() {
    engine.logs.log('Preloader::activate', 'Loading assets');
    super.activate();

    this.timeStarted = new Date().getTime();

    let i, len, what;

    for (i = 0, len = this.imageAssets.length; i < len; i++) {
      what = this.imageAssets[i];
      this.addImageToLoad(what);
    }

    for (i = 0, len = this.soundAssets.length; i < len; i++) {
      what = this.soundAssets[i];
      this.addSoundToLoad(what);
    }

    this.message = new GUI.GuiText(
      engine.localization.get('loaded') + ' ' + this.percentageLoaded + '%',
      300,
      30
    );
    this.message.setPosition(
      engine.core.size.x / 2,
      engine.core.size.y / 2 + 100
    );
    this.message.setAlign(GUI.ALIGN.CENTER);
    this.message.setVerticalOffset(20);
    // this.message.setFontSize(20);
    this.message.setFontColor('#FF2222');
    this.gui.attachItem(this.message, 'msg_loading');
  }

  addAnimation(data) {
    this.imageAssets.push(data);
  }

  addSprite(data) {
    // Add information for a complete animation spritesheet, with only
    // one image
    data.xStart = 0;
    data.yStart = 0;
    data.frames = 1;
    data.initFrame = 0;
    data.speed = 0;

    this.addAnimation(data);
  }

  addImageToLoad(data) {
    let image = null;

    // Load only new images
    if (!engine.sprites.imageExists(data.path)) {
      image = new Image();

      addEvent('load', image, () => {
        engine.preloader.incrementalLoader();
      });

      // src always have to be set after adding the event listener, due to bug in IE8
      if (engine.options.assetsURLPrefix !== null) {
        image.src = engine.options.assetsURLPrefix + data.path;
      } else {
        image.src = getProtocolAndHost() + data.path;
      }

      this.totalImages++;
      engine.sprites.addImage(data.path, image);
    }

    // Save only new sprites
    if (!engine.sprites.spriteExists(data.name)) {
      engine.sprites.addSprite(
        data.name,
        data.path,
        data.xStart,
        data.yStart,
        data.width,
        data.height,
        data.frames,
        data.initFrame,
        data.speed
      );
    }
  }

  addSound(data) {
    this.soundAssets.push(data);
  }

  addSoundToLoad(data) {
    let sound = null;

    // Load only new images
    if (!engine.sounds.soundExists(data.path)) {
      let path = data.path;

      if (engine.options.assetsURLPrefix !== null) {
        path = engine.options.assetsURLPrefix + path;
      } else {
        path = getProtocolAndHost() + path;
      }

      sound = new Audio(path);
      // sound.src = data.path;
      sound.load();

      addEvent('canplaythrough', sound, () => {
        engine.preloader.incrementalLoader('sound');
      });

      engine.sounds.addSound(data.name, data.path, sound);
    }
  }

  addFont(data) {
    // load a font asynchonously using the Font.js library
    let font = new Font();

    this.totalFonts++;

    font.onerror = err => {
      engine.logs.log('Preloader::addFont', 'Error loading a font: ' + err);
    };
    font.onload = () => {
      engine.logs.log('Preloader::addFont', 'Font loaded');
      engine.preloader.incrementalLoader('font');
    };

    font.fontFamily = data.name;

    if (typeof data.flag != 'undefined') {
      font.src = data.path;
    } else {
      if (engine.options.assetsURLPrefix !== null) {
        font.src = engine.options.assetsURLPrefix + data.path;
      } else {
        font.src = getProtocolAndHost() + data.path;
      }
    }

    engine.fonts.addFont(data.name, data.path, font);
  }

  incrementalLoader() {
    let total = this.totalImages + this.soundAssets.length + this.totalFonts;
    this.incremental += 1;
    this.percentageLoaded = Math.floor((this.incremental * 100) / total);
  }

  draw(ctx) {
    super.draw(ctx);

    // Loading bar
    let barWidth = engine.core.size.x / 3;

    ctx.fillStyle = '#FF2222';
    ctx.fillRect(
      (engine.core.size.x - barWidth) / 2 + 1,
      engine.core.size.y / 2 + 51,
      (this.percentageLoaded * barWidth) / 100,
      15
    );

    ctx.lineWidth = 2;
    ctx.strokeStyle = '#FFEEEE';
    ctx.strokeRect(
      (engine.core.size.x - barWidth) / 2,
      engine.core.size.y / 2 + 50,
      barWidth + 2,
      16
    );
  }

  step(dt) {
    super.step(dt);

    this.message.setText(
      engine.localization.get('loaded') + ' ' + this.percentageLoaded + '%'
    );

    let timeLived = new Date().getTime() - this.timeStarted;

    // At least one second to load resources
    if (this.percentageLoaded >= 100 && timeLived > 1000) {
      engine.core.activate();
      engine.external('LOADED', null, null);
    }
  }
}
