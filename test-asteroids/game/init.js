
// Global objects

var engine = new Engine();

var game = new Game();

// Game initialization

addEvent('load', window, function() {
  engine.initialize('game-canvas');
  game.initialize();
});

