Engine.GUI.GuiMenu = function() {
  Engine.GUI.GuiElement.call(this);

  this._menuOptions = {}; // { id : [ 'text to show on scene', GuiText object, object to inform ] }
  this._menuIds = []; // keys of this._menuOptions

  this.currentOption = 0; // index of _menuOptions currently selected

  this.selector = new Engine.GUI.GuiElement();
  this.selector.setImage('selector');
  this.selector.setPosition(0, -5);
  this.attachItem(this.selector);
};

Engine.GUI.GuiMenu.prototype = Object.create(Engine.GUI.GuiElement.prototype);
Engine.GUI.GuiMenu.prototype.constructor = Engine.GUI.GuiMenu;

Engine.GUI.GuiMenu.prototype.initialize = function() {
  Engine.GUI.GuiElement.prototype.initialize.call(this);
};

Engine.GUI.GuiMenu.prototype.activate = function() {
  Engine.GUI.GuiElement.prototype.activate.call(this);

  this.selector.setBlink(true);

  var scene = this.getParentScene();

  if (scene === null) return;

  scene.input.addKeyListener(
    this,
    'eventKeyPressed',
    [Engine.INPUT.KEYS.UP, Engine.INPUT.KEYS.DOWN, Engine.INPUT.KEYS.ENTER],
    true
  );
};

Engine.GUI.GuiMenu.prototype.draw = function(ctx) {
  var len = this._menuIds.length;

  if (len === 0) return;

  // var pos = this.getPosition();
  var size = this.getSize();
  var yPos = 0;
  var xPos = 0;

  for (var i = 0; i < len; i++) {
    var textInfo = this._menuOptions[this._menuIds[i]];
    var text = textInfo[1];

    text.setPosition(xPos, yPos);
    // text.draw(ctx);

    if (i == this.currentOption)
      this.selector.setPosition(-size.x / 2 - 10, yPos);

    yPos = yPos + 20;
  }

  // Call inherited function
  Engine.GUI.GuiElement.prototype.draw.call(this, ctx);
};

Engine.GUI.GuiMenu.prototype.step = function(dt) {
  // Call inherited function
  Engine.GUI.GuiElement.prototype.step.call(this, dt);
};

Engine.GUI.GuiMenu.prototype.addMenuOption = function(id, text, ob) {
  // this._menuOptions.push( {
  //   id : ident,
  //   text : txt,
  //   guiOb : new Engine.GUI.GuiText(txt, this.size.x, this.size.y),
  //   object : ob
  // } );

  if (typeof this._menuOptions[id] !== 'undefined') {
    if (this._menuOptions[id][0] != text) {
      this._menuOptions[id][0] = text;
      this._menuOptions[id][1].setText(text); // Same GuiText object
    }
    this._menuOptions[id][2] = new Date().getTime();
  } else {
    var txt = new Engine.GUI.GuiText(text, this.size.x, this.size.y);
    txt.setSize(this.size.x, this.size.y);
    // Save time of last text addition
    this._menuOptions[id] = [text, txt, ob];
    this._menuIds = Object.keys(this._menuOptions);

    // So step and draw are autocalled
    this.attachItem(txt, id);
  }
};

Engine.GUI.GuiMenu.prototype.eventKeyPressed = function(keyCode) {
  if (keyCode == Engine.INPUT.KEYS.UP) {
    if (this.currentOption > 0) this.currentOption--;
  } else if (keyCode == Engine.INPUT.KEYS.DOWN) {
    if (this.currentOption < this._menuIds.length - 1) this.currentOption++;
  } else if (keyCode == Engine.INPUT.KEYS.ENTER) {
    var option = this._menuOptions[this._menuIds[this.currentOption]];

    if (typeof option[2] !== 'undefined')
      if (option[2].eventGuiAction)
        option[2].eventGuiAction(
          this.guiId,
          Engine.GUI.EVENTS.SELECTION,
          this._menuIds[this.currentOption]
        );
  }
};
