import Item from '../item';

export default class GuiElement extends Item {
  constructor(parentItem) {
    super(parentItem);
    this.guiId = null;

    if (typeof parentItem !== 'undefined') {
      this.setParent(parentItem);
    } else {
      this.guiId = 'globalGUI';
    }

    this.inputCallbacks = {}; // { keyCode : callback_function }
    this.guiElements = {}; // { "id" : guiElement object}
    this.blink = false;
  }

  initialize() {
    super.initialize();
  }

  activate() {
    super.activate();
  }

  draw(ctx) {
    super.draw(ctx);
  }

  step(dt) {
    super.step(dt);
  }

  setBlink(value) {
    let scene = this.getParentScene();
    if (scene === null) {
      return;
    }

    if (value === true) {
      this.blink = true;
      scene.clock.suscribe(this.guiId + '_clock', this, 'blinkStep', 350);
    } else {
      this.blink = false;
      this.setVisible(true);
      scene.clock.unsuscribe(this.guiId + '_clock');
    }
  }

  blinkStep() {
    if (this.blink === true && this.getVisible() === true) {
      this.setVisible(false);
    } else if (this.blink === true && this.getVisible() === false) {
      this.setVisible(true);
    }
    // Should not happen, ever
    else if (this.blink === false) {
      this.setVisible(true);
    }
  }

  addInputCallback(key, callback) {
    let scene = this.getParentScene();
    if (scene === null) {
      return;
    }

    scene.input.addKeyListener(this, 'eventKeyPressed', [key], true); // true == inform in pause too
    this.inputCallbacks[key] = callback;
  }

  eventKeyPressed(keyCode) {
    // engine.logs.log('Gui.eventKeyPressed', 'Key Pressed: ' + keyCode);

    if (typeof this.inputCallbacks[keyCode] !== 'undefined') {
      this.inputCallbacks[keyCode]();
    }
  }

  getElement(id) {
    let ret = this.guiElements[id];
    if (typeof ret !== 'undefined') {
      return ret;
    }
    return null;
  }

  get(id) {
    return this.getElement(id);
  }

  attachItem(what, id) {
    this.guiElements[id] = what;
    what.guiId = id;
    // this.guiElementsIds = Object.keys(this.guiElements);

    super.attachItem(what);
  }

  detachItem(id) {
    if (typeof id !== 'undefined') {
      super.detachItem(this.get(id));
      delete this.guiElements[id];
      // this.guiElementsIds = Object.keys(this.guiElements);
    }
  }

  detachAllItems() {
    let keys = Object.keys(this.guiElements);

    for (let i = 0, len = keys.length; i < len; i++) {
      // Recursive in-depth
      this.guiElements[keys[i]].detachAllItems();
      this.detachItem(keys[i]);
    }

    this.guiElements = {};
    // this.guiElementsIds = [];

    this._finalizeRemoved();

    // Don't, in GUI the elements are detached by id, not by object
    // super.detachAllItems(this);
  }

  _resetItems() {
    this.attachedItems.length = 0;
    this.guiElements = {};
  }
}
