
Engine.GUI.GuiNumberMenu = function(txt)
{
  Engine.GUI.GuiElement.call(this);

  this._menuOptions = {}; // { id : [ 'text to show on scene', GuiText object, object to inform ] }
  this._menuIds = []; // keys of this._menuOptions

  this._optionsPlaced = false;
};

Engine.GUI.GuiNumberMenu.prototype = Object.create(Engine.GUI.GuiElement.prototype);
Engine.GUI.GuiNumberMenu.prototype.constructor = Engine.GUI.GuiNumberMenu;


Engine.GUI.GuiNumberMenu.prototype.initialize = function()
{
  Engine.GUI.GuiElement.prototype.initialize.call(this);
};

Engine.GUI.GuiNumberMenu.prototype.activate = function()
{
  Engine.GUI.GuiElement.prototype.activate.call(this);

  var scene = this.getParentScene();

  if (scene === null)
    return;

  // Build a list with the keys we will use to select from the menu
  var keyList = [];

  switch (this._menuIds.length)
  {
    case 9:
      keyList.push( Engine.INPUT.KEYS.NINE );
      /* falls through */
    case 8:
      keyList.push( Engine.INPUT.KEYS.EIGHT );
      /* falls through */
    case 7:
      keyList.push( Engine.INPUT.KEYS.SEVEN );
      /* falls through */
    case 6:
      keyList.push( Engine.INPUT.KEYS.SIX );
      /* falls through */
    case 5:
      keyList.push( Engine.INPUT.KEYS.FIVE );
      /* falls through */
    case 4:
      keyList.push( Engine.INPUT.KEYS.FOUR );
      /* falls through */
    case 3:
      keyList.push( Engine.INPUT.KEYS.THREE );
      /* falls through */
    case 2:
      keyList.push( Engine.INPUT.KEYS.TWO );
      /* falls through */
    case 1:
      keyList.push( Engine.INPUT.KEYS.ONE );
      /* falls through */
    default:
      break;
  }

  // Listen to all the keys
  scene.input.addKeyListener( this, 'eventKeyPressed', keyList, true ); 

  // Touch areas
  if (engine.device.isTouchDevice)
  {
    // Be sure every text is in their position
    this.placeOptions();

    for (var i = 0, len = this._menuIds.length; i < len; i++)
    {
      var textInfo = this._menuOptions[this._menuIds[i]];
      var text = textInfo[2];

      scene.input.addClickZone('number_menu_' + this.guiId + '_' + i, 
        text.getPosition(),
        text.getSize(),
        engine.input.convertNumberToKey(i + 1));
    }     
  }
};

Engine.GUI.GuiNumberMenu.prototype.placeOptions = function()
{
  var len = this._menuIds.length;

  if (len === 0)
    return;

  // var pos = this.getPosition();
  var size = this.getSize();
  var yPos = 0;
  var xPos = 0;

  for (var i = 0; i < len; i++)
  {
    var textInfo = this._menuOptions[this._menuIds[i]];
    var text = textInfo[2];

    text.setPosition(xPos, yPos);
    // text.draw(ctx);

    if (engine.device.isTouchDevice === true)
      yPos = yPos + 50;
    else
      yPos = yPos + 20;
  }  

  this._optionsPlaced = true;
};


Engine.GUI.GuiNumberMenu.prototype.draw = function(ctx)
{
  if (this._optionsPlaced === false)
    this.placeOptions();

  // Call inherited function 
  Engine.GUI.GuiElement.prototype.draw.call(this, ctx);
};

Engine.GUI.GuiNumberMenu.prototype.step = function(dt)
{
  // Call inherited function 
  Engine.GUI.GuiElement.prototype.step.call(this, dt);
};

Engine.GUI.GuiNumberMenu.prototype.addMenuOption = function(id, text, ob)
{
  // this._menuOptions.push( { 
  //   id : ident, 
  //   text : txt, 
  //   guiOb : new Engine.GUI.GuiText(txt, this.size.x, this.size.y),
  //   object : ob 
  // } );

  this._optionsPlaced = false;

  if (typeof(this._menuOptions[id]) !== 'undefined')
  {
    if (this._menuOptions[id][0] != text)
    {
      this._menuOptions[id][0] = text;
      this._menuOptions[id][1].setText(text); // Same GuiText object
    }
    this._menuOptions[id][2] = new Date().getTime();
  }
  else
  {
    var position = this._menuIds.length;

    var txt = new Engine.GUI.GuiText( '' + (position + 1) + ' - ' + text, this.size.x, this.size.y);
    txt.setSize(this.size.x, this.size.y);
    // Save time of last text addition
    this._menuOptions[ position.toString() ] = [ id, text, txt, ob ];
    this._menuIds = Object.keys(this._menuOptions);

    // So step and draw are autocalled
    this.attachItem(txt, id);
  }
};

Engine.GUI.GuiNumberMenu.prototype.eventKeyPressed = function(keyCode)
{
  var number = engine.input.convertKeyToNumber(keyCode);

  // Should not happen
  if (number > this._menuIds.length)
    return;

  var id = (number - 1).toString();
  var option = this._menuOptions[ this._menuIds[ id ] ];

  if (typeof(option[3]) !== 'undefined')
    if (option[3].eventGuiAction)
      option[3].eventGuiAction(this.guiId, Engine.GUI.EVENTS.SELECTION, option[0]);

};
