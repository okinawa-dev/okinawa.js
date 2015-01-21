

function Okinawa(canvasId, gameClassName, callbackFunction) 
{
  // Global variable
  engine = new Engine();

  // Game initialization
  addEvent('load', window, function() {
    // parameters: 
    //   1) canvas DOM element id
    //   2) game class name to be instatiated
    //   3) optional callback function to inform of certain events inside the game  
    engine.initialize(canvasId, gameClassName, callbackFunction);
  });

  return engine;
}
