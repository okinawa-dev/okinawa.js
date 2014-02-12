
Game.Points = function() 
{
  this.totalPoints = 0;
  this.gameInitTime = 0;
}

Game.Points.prototype.initialize = function() 
{
}

Game.Points.prototype.add = function(points)
{
  this.totalPoints += points;

  var scene = engine.scenes.getCurrentScene();

  var guiItem = scene.gui.get('points');

  if (guiItem != undefined)
    guiItem.setText(engine.localization.get('points') + ': ' + this.totalPoints);
}

