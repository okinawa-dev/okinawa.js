
Engine.GUI.GuiConsole = function(txt)
{
  Engine.GUI.GuiElement.call(this);

  this._texts = {}; // { id : [ 'text to show on scene', GuiText object, insertionTime ] }
  this._textKeys = []; // keys of this._texts
  this._textsToRemove = [];

  this.order = Engine.GUI.ORDENATION.DOWN;
};

Engine.GUI.GuiConsole.prototype = Object.create(Engine.GUI.GuiElement.prototype);
Engine.GUI.GuiConsole.prototype.constructor = Engine.GUI.GuiConsole;


Engine.GUI.GuiConsole.prototype.initialize = function()
{
  Engine.GUI.GuiElement.prototype.initialize.call(this);
};

Engine.GUI.GuiConsole.prototype.activate = function()
{
  Engine.GUI.GuiElement.prototype.activate.call(this);
};

Engine.GUI.GuiConsole.prototype.draw = function(ctx)
{
  var len = this._textKeys.length;

  if (len === 0)
    return;

  // var pos = this.getPosition();
  var yPos = 0;
  var xPos = 0;

  var now = new Date().getTime();

  for (var i = 0; i < len; i++)
  {
    var textInfo = this._texts[this._textKeys[i]];

    var text = textInfo[1];
    var time = textInfo[2];

    // Delete old messages
    if (time + 2000 < now)
    {
      // just marked as "toRemove"
      this._textsToRemove.push(this._textKeys[i]);
      // this.detachItem(text);
    }
    else
    {
      text.setPosition(xPos, yPos);
      // text.draw(ctx);

      if (this.order == Engine.GUI.ORDENATION.DOWN)
        yPos = yPos + 20;
      else
        yPos = yPos - 20;
    }
  }

  // Call inherited function 
  Engine.GUI.GuiElement.prototype.draw.call(this, ctx);
};

Engine.GUI.GuiConsole.prototype.step = function(dt)
{
  // Call inherited function 
  Engine.GUI.GuiElement.prototype.step.call(this, dt);

  var len = this._textsToRemove.length;

  if (len > 0)
  {
    for (var i = 0; i < len; i++) 
    {
      this.detachItem(this._textsToRemove[i]);
      delete this._texts[this._textsToRemove[i]];
    }

    this._textKeys = Object.keys(this._texts);
    this._textsToRemove = [];
  }
};

Engine.GUI.GuiConsole.prototype.addText = function(key, text)
{
  if (typeof(this._texts[key]) !== 'undefined')
  {
    if (this._texts[key][0] != text)
    {
      this._texts[key][0] = text;
      this._texts[key][1].setText(text); // Same GuiText object
    }
    this._texts[key][2] = new Date().getTime();
  }
  else
  {
    var txt = new Engine.GUI.GuiText(text, this.size.x, this.size.y);
    txt.setSize(this.size.x, this.size.y);
    // Save time of last text addition
    this._texts[key] = [ text, txt, new Date().getTime() ];
    this._textKeys = Object.keys(this._texts);

    this.attachItem(txt, key);
  }
};
