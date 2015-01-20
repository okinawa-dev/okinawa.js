
Engine.SceneCollection = function()
{
  this.collection         = null;  // Array in the form scenes[i] = { 'scene': scene, 'name': name }
  this.currentSceneIndex  = null;
  this.currentSceneName   = null;
  this.currentScene       = null;
}

Engine.SceneCollection.prototype.initialize = function()
{
  this.collection         = [];
  this.currentSceneIndex  = 0;
  this.currentSceneName   = '';
  this.currentScene       = null;
}

Engine.SceneCollection.prototype.activate = function()
{
  // Nothing to do here
}

Engine.SceneCollection.prototype.draw = function(ctx)
{
  // Nothing to do here
}

Engine.SceneCollection.prototype.step = function(dt)
{
  // Nothing to do here
}

Engine.SceneCollection.prototype.getCurrentScene = function() 
{ 
  return this.currentScene;
}

// Change an active game scene
Engine.SceneCollection.prototype.setScene = function(num) 
{ 
  // Old scene
  var oldScene = this.currentScene;

  if ((this.currentScene != undefined) && (this.currentScene != null))
  {
    this.currentScene.isCurrent = false;
  }

  engine.core.clearScreen();

  // New scene
  this.currentSceneIndex      = num;
  this.currentSceneName       = this.collection[num].name;
  this.currentScene           = this.collection[num].scene;
  this.currentScene.isCurrent = true;
  this.currentScene.activate();
  
  if (engine.game.player != undefined)
    engine.game.player.activate();

  engine.logs.log('Engine.ScreenCollection.setScene', 
                  'Set Scene: ' + this.currentSceneName + ' (' + this.currentSceneIndex + ')');
}

Engine.SceneCollection.prototype.addScene = function(scene, name)
{
  engine.logs.log('Engine.ScreenCollection.addScene', 'Add Scene: ' + name);

  scene.isCurrent = false;

  this.collection.push( { 'scene': scene, 'name': name } );
}

Engine.SceneCollection.prototype.insertScene = function(scene, name, num)
{
  scene.isCurrent = false;

  this.collection.splice(num, 0, { 'scene': scene, 'name': name });
}

Engine.SceneCollection.prototype.advanceScene = function() 
{
  // Not able to advance scene
  if (this.currentSceneIndex + 1 >= this.collection.length)
    return;

  // engine.logs.log('Engine.ScreenCollection.advanceScene', 'Advance Level', this.currentSceneIndex + 1);
  this.setScene(this.currentSceneIndex + 1);
}

Engine.SceneCollection.prototype.goBackScene = function() 
{
  // Not able to go back
  if (this.currentSceneIndex - 1 < 0)
    return;

  // engine.logs.log('Engine.ScreenCollection.advanceScene', 'Advance Level', this.currentSceneIndex + 1);
  this.setScene(this.currentSceneIndex - 1);
}

