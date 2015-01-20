
// Global objects

var engine = new Engine();

// Game initialization

addEvent('load', window, function() {
  engine.initialize('game-canvas');
});

