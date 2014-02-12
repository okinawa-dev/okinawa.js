
function Game() 
{
  // Generic
  this.options = null;
  this.loader = null;
  this.player = null;

  // Game specific
  this.commonBackground = null;
  this.points = null;
}

Game.prototype.initialize = function()
{
  // The specific game options could be reached as game.options AND as engine.options
  this.options = new Game.Options();
  engine.options.addOptions(this.options);

  // Common background for every screen
  this.commonBackground = new Game.Background();
  this.commonBackground.initialize()

  this.loader = new Game.Loader();
  this.loader.initialize();

  this.player = new Game.Player();
  this.player.initialize();

  this.points = new Game.Points();
  this.points.initialize();
}

// Game Initialization
Game.prototype.activate = function() 
{
  engine.logs.log('Game.activate', 'Starting game');

  var lvl = new Game.SCENES.Initial();
  lvl.addBackground(this.commonBackground);
  lvl.playable = true;
  lvl.initialize();

  engine.scenes.addScene(lvl, 'start_game'); 

  lvl = new Game.SCENES.Level();
  lvl.addBackground(this.commonBackground);
  lvl.playable = true;
  lvl.initialize();

  engine.scenes.addScene(lvl, 'main_game'); 
}

Game.prototype.step = function(dt)
{
  // Only for logic, the avatar and other elements in the scene
  // will be updated via the scene hierarchy
  this.player.step(dt);
}
