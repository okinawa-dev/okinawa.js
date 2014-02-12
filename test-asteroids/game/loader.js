
Game.Loader = function() 
{
}

// Game.Loader Initialization
Game.Loader.prototype.initialize = function() 
{
  // engine.preloader.addAnimation(anim_name, path, 
  // xStart, yStart, width, height, frames, initFrame, speed)

  engine.preloader.addAnimation({ name: 'starship', path: 'game/images/ship.png', 
                           xStart: 0, yStart: 0, width: 50, height: 50, frames: 1, initFrame: 0, speed: 0 });

  // **************
  //  Enemies 
  // **************
  engine.preloader.addAnimation({ name: 'meteor', path: 'game/images/meteor.png', 
                           xStart: 0, yStart: 0, width: 60, height: 60, frames: 1, initFrame: 0, speed: 0 });

  // **************
  //  Shots
  // **************
  engine.preloader.addAnimation({ name: 'shot', path: 'game/images/shot.png', 
                           xStart: 0, yStart: 0, width: 10, height: 10, frames: 1, initFrame: 0, speed: 0 });

  // **************
  //  Effects
  // **************
  engine.preloader.addAnimation({ name: 'explosion', path: 'game/images/effect.explosion.png', 
                           xStart: 0, yStart: 0, width: 48, height: 47, frames: 11, initFrame: 0, speed: 14 });
  engine.preloader.addAnimation({ name: 'halo', path: 'game/images/effect.halo.png', 
                           xStart: 0, yStart: 0, width: 63, height: 63, frames: 1, initFrame: 0, speed: 0 });

  // First screen: preloader with progress bar
  engine.preloader.addBackground(game.commonBackground);
  engine.preloader.initialize(); // Usually empty
  engine.scenes.addScene(engine.preloader, 'preloader');
  engine.scenes.setScene(0);

  engine.localization.addTextsToStringTable('english', this.localization_en());
  engine.localization.addTextsToStringTable('spanish', this.localization_es());  
  engine.localization.selectLanguage(game.options.defaultLanguage);  
}

Game.Loader.prototype.localization_en = function()
{
  return {
    'game_name'       : 'Game',
    'press_spacebar'  : 'Press the spacebar to start',
    'touch_screen'    : 'Touch the screen to continue',
    'points'          : 'Points',
    'accumulated'     : 'Accumulated points',
    'totals'          : 'Total points',
  }
}

Game.Loader.prototype.localization_es = function()
{
  return {
    'game_name'       : 'Juego',
    'press_spacebar'  : 'Pulsa espacio para comenzar',
    'touch_screen'    : 'Toca la pantalla para continuar',  
    'points'          : 'Puntos',
    'accumulated'     : 'Puntos acumulados',
    'totals'          : 'Puntos totales',
  }
}
