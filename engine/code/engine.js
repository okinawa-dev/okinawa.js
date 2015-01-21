
function Engine()
{
  this.options      = null;
  this.logs         = null;
  this.core         = null;
  this.math         = null;
  this.device       = null;
  this.effects      = null;
  this.particles    = null;
  this.sprites      = null;
  this.sounds       = null;
  this.clock        = null;
  this.localization = null;
  this.input        = null;
  this.controls     = null;
  this.gui          = null;
  this.scenes       = null;
  this.preloader    = null;
  this.game         = null;

  this.externalCallback = null;
}

Engine.prototype.initialize = function(canvasElementId, gameClassName, callbackFunction)
{
  this.options      = new Engine.Options();
  this.logs         = new Engine.Logs();
  this.core         = new Engine.Core();
  this.math         = new Engine.MATH.Math();
  this.device       = new Engine.Device();
  this.effects      = new Engine.Effects();
  this.particles    = new Engine.ParticleCollection();
  this.sprites      = new Engine.Sprites();
  this.sounds       = new Engine.Sounds();
  this.clock        = new Engine.Clock();
  this.localization = new Engine.Localization();
  this.input        = new Engine.INPUT.Controller();
  this.gui          = new Engine.GUI.GuiElement();
  this.scenes       = new Engine.SceneCollection();
  this.preloader    = new Engine.Preloader();

  engine.logs.log('Engine.initialize', 'Initializing starts...');

  try {
    this.game = new window[gameClassName]();
  }
  catch(err) {
    engine.logs.log('Engine.initialize', 'Error instantiating game class');
    return;
  }

  if (callbackFunction != null)
    this.externalCallback = callbackFunction;

  this.core.initialize(canvasElementId);
  this.math.initialize();
  this.device.initialize();
  this.effects.initialize();
  this.particles.initialize();
  this.sprites.initialize();
  this.sounds.initialize();

  this.clock.initialize();
  this.clock.suscribeOneSecond('testFPS', function() { 
        if (engine.options.showFps)
          engine.gui.get('console').addText('fps', engine.core.fpsPassed + ' fps');
        engine.core.fpsPassed = 0;
      });

  this.input.initialize();
  this.localization.initialize();

  // TODO maybe remove this from global engine someday
  // Global GUI
  var console = new Engine.GUI.GuiConsole();
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

Engine.prototype.external = function(eventType, id, message)
{
  if (this.externalCallback != null)
  {
    try {
      this.externalCallback(eventType, id, message);
    } 
    catch (err) {
      engine.logs.log('Engine.external', 'Error with external callback with event ' + eventType + ' ' + id);
    }
  }
}
