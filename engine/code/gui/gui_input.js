
Engine.GUI.GuiInput = function(x, y)
{
  Engine.GUI.GuiText.call(this, '', x, y);

  this._canvasRendering = true;

  this._blinkCursor = false;
  this._lastBlinkTime = 0;

  this._callback = null;
};

Engine.GUI.GuiInput.prototype = Object.create(Engine.GUI.GuiText.prototype);
Engine.GUI.GuiInput.prototype.constructor = Engine.GUI.GuiInput;


Engine.GUI.GuiInput.BLINK_TIME = 500; 

Engine.GUI.GuiInput.prototype.initialize = function()
{
  Engine.GUI.GuiText.prototype.initialize.call(this);
};

Engine.GUI.GuiInput.prototype.activate = function()
{
  Engine.GUI.GuiText.prototype.activate.call(this);

  this.getParentScene().input.addKeyListener(this, '_eventKeyPressed', [ Engine.INPUT.KEYS.ANY_KEY ]);
};

Engine.GUI.GuiInput.prototype.setCallback = function(func)
{
  if (typeof( func ) == 'function')
    this._callback = func;
};

Engine.GUI.GuiInput.prototype._eventKeyPressed = function(keyCode)
{
  if (engine.core.paused)
    return;

  // console.log('INPUT: ' + keyCode + ' ' + String.fromCharCode(keyCode));

  if (((keyCode >= Engine.INPUT.KEYS.A) && (keyCode <= Engine.INPUT.KEYS.Z)) ||
      ((keyCode >= Engine.INPUT.KEYS.ZERO) && (keyCode <= Engine.INPUT.KEYS.NINE)) ||
       (keyCode == Engine.INPUT.KEYS.NTILDE) ||
       (keyCode == Engine.INPUT.KEYS.SPACEBAR))
    this.setText( this.text + String.fromCharCode(keyCode) );

  if (keyCode == Engine.INPUT.KEYS.BACKSPACE)
    this.setText( this.text.substring(0, this.text.length - 1) );

  if (keyCode == Engine.INPUT.KEYS.ENTER)
  {
    var txt = this.text;
    this.setText('');

    if (typeof( this._callback ) == 'function')
      this._callback(txt); 
  }
};

Engine.GUI.GuiInput.prototype.getText = function()
{
  // Call inherited function 
  var txt = Engine.GUI.GuiText.prototype.getText.call(this);

  if (this._blinkCursor === true)
    return txt + '|';

  return txt;
};

Engine.GUI.GuiInput.prototype.draw = function(ctx)
{
  // Call inherited function 
  Engine.GUI.GuiText.prototype.draw.call(this, ctx);
};

Engine.GUI.GuiInput.prototype.step = function(dt)
{
  if (!engine.core.paused)
  {
    var now = new Date().getTime();

    if (now - this._lastBlinkTime > Engine.GUI.GuiInput.BLINK_TIME)
    {
      if (this._blinkCursor === true)
        this._blinkCursor = false;
      else
        this._blinkCursor = true;
      
      this._lastBlinkTime = now;
      this._innerChange = true; // force redraw
    }
  }

  // Call inherited function 
  Engine.GUI.GuiText.prototype.step.call(this, dt);
};

