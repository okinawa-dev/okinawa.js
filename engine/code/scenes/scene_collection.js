
Engine.SceneCollection = function()
{
  this.collection         = null;  // Array in the form scenes[i] = { 'scene': scene, 'name': name }
  this.currentSceneIndex  = null;
  this.currentSceneName   = null;
  this.currentScene       = null;
};

Engine.SceneCollection.prototype.initialize = function()
{
  this.collection         = [];
  this.currentSceneIndex  = 0;
  this.currentSceneName   = '';
  this.currentScene       = null;
};

Engine.SceneCollection.prototype.activate = function()
{
  // Nothing to do here
};

Engine.SceneCollection.prototype.draw = function(ctx)
{
  // Nothing to do here
};

Engine.SceneCollection.prototype.step = function(dt)
{
  // Nothing to do here
};

Engine.SceneCollection.prototype.getCurrentScene = function() 
{ 
  return this.currentScene;
};

// Change an active game scene
// do not use 'this', as this function could be called out
Engine.SceneCollection.prototype.setScene = function(num) 
{ 
  // Old scene
  var oldScene = engine.scenes.currentScene;

  if ((typeof(engine.scenes.currentScene) !== 'undefined') && (engine.scenes.currentScene !== null))
  {
    engine.scenes.currentScene.isCurrent = false;
  }

  engine.core.clearScreen();

  // New scene
  engine.scenes.currentSceneIndex      = num;
  engine.scenes.currentSceneName       = engine.scenes.collection[num].name;
  engine.scenes.currentScene           = engine.scenes.collection[num].scene;
  engine.scenes.currentScene.isCurrent = true;
  engine.scenes.currentScene.activate();
  
  if (typeof(engine.game.player) !== 'undefined')
    engine.game.player.activate();

  engine.logs.log('Engine.ScreenCollection.setScene', 
                  'Set Scene: ' + engine.scenes.currentSceneName + ' (' + engine.scenes.currentSceneIndex + ')');

  engine.external('SCENE_CHANGE', null, null);
};

Engine.SceneCollection.prototype.addScene = function(scene, name)
{
  engine.logs.log('Engine.ScreenCollection.addScene', 'Add Scene: ' + name);

  scene.isCurrent = false;

  this.collection.push( { 'scene': scene, 'name': name } );
};

Engine.SceneCollection.prototype.insertScene = function(scene, name, num)
{
  scene.isCurrent = false;

  this.collection.splice(num, 0, { 'scene': scene, 'name': name });
};

// do not use 'this', as this function could be called out
Engine.SceneCollection.prototype.advanceScene = function() 
{
  // Not able to advance scene
  if (engine.scenes.currentSceneIndex + 1 >= engine.scenes.collection.length)
    return;

  // engine.logs.log('Engine.ScreenCollection.advanceScene', 'Advance Level', this.currentSceneIndex + 1);
  engine.scenes.setScene(engine.scenes.currentSceneIndex + 1);
};

Engine.SceneCollection.prototype.goBackScene = function() 
{
  // Not able to go back
  if (this.currentSceneIndex - 1 < 0)
    return;

  // engine.logs.log('Engine.ScreenCollection.advanceScene', 'Advance Level', this.currentSceneIndex + 1);
  this.setScene(this.currentSceneIndex - 1);
};
