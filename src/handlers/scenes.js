import engine from '../engine';

export default class Scenes {
  constructor() {
    this.collection = null; // Array in the form scenes[i] = { 'scene': scene, 'name': name }
    this.currentSceneIndex = null;
    this.currentSceneName = null;
    this.currentScene = null;
  }

  initialize() {
    this.collection = [];
    this.currentSceneIndex = 0;
    this.currentSceneName = '';
    this.currentScene = null;
  }

  activate() {}
  draw() {}
  step() {}

  getCurrentScene() {
    return this.currentScene;
  }

  setScene(num) {
    // Old scene
    // let oldScene = this.currentScene;

    if (
      typeof this.currentScene !== 'undefined' &&
      this.currentScene !== null
    ) {
      this.currentScene.isCurrent = false;
    }

    engine.core.clearScreen();

    // New scene
    this.currentSceneIndex = num;
    this.currentSceneName = engine.scenes.collection[num].name;
    this.currentScene = engine.scenes.collection[num].scene;
    this.currentScene.isCurrent = true;
    this.currentScene.activate();

    if (typeof engine.player !== 'undefined' && engine.player !== null) {
      engine.player.activate();
    }

    engine.logs.log(
      'Scenes::setScene',
      'Set Scene: ' +
        this.currentSceneName +
        ' (' +
        this.currentSceneIndex +
        ')',
    );

    engine.external('SCENE_CHANGE', null, null);
  }

  addScene(scene, name) {
    engine.logs.log('Scenes::addScene', 'Add Scene: ' + name);
    scene.isCurrent = false;
    this.collection.push({ scene: scene, name: name });
  }

  insertScene(scene, name, num) {
    scene.isCurrent = false;
    this.collection.splice(num, 0, { scene: scene, name: name });
  }

  // do not use 'this', as this function could be called out
  advanceScene() {
    // Not able to advance scene
    if (
      engine.scenes.currentSceneIndex + 1 >=
      engine.scenes.collection.length
    ) {
      return;
    }

    // engine.logs.log('Scenes::advanceScene', 'Advance Level', this.currentSceneIndex + 1);
    engine.scenes.setScene(engine.scenes.currentSceneIndex + 1);
  }

  goBackScene() {
    // Not able to go back
    if (this.currentSceneIndex - 1 < 0) {
      return;
    }

    // engine.logs.log('Scenes::advanceScene', 'Advance Level', this.currentSceneIndex + 1);
    this.setScene(this.currentSceneIndex - 1);
  }
}
