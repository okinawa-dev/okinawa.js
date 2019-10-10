Engine.GUI.GuiBubble = function() {
  Engine.GUI.GuiElement.call(this);

  this.position.x = engine.core.size.x / 2;
  this.position.y = engine.core.size.y - 140;

  this.size.x = engine.core.size.x - 40;
  this.size.y = 200;

  this._backgroundColor = 'rgba(0, 0, 0, 0.8)';
  this._borderColor = 'grey';
  this._fontColor = '#FFFFFF'; // white
  this._fontBorderColor = '#000000'; // black
  this._cornerRadius = 1;
  this._borderWidth = 6;

  this._arrowPosition = 0;

  this._text = null;
};

Engine.GUI.GuiBubble.prototype = Object.create(
  Engine.GUI.GuiElement.prototype
);
Engine.GUI.GuiBubble.prototype.constructor = Engine.GUI.GuiBubble;

// Options
Engine.GUI.GuiBubble.ARROW_POSITIONS = {
  LOWER_LEFT: 0,
  LOWER_MIDDLE: 1,
  LOWER_RIGHT: 2,
  UPPER_LEFT: 3,
  UPPER_MIDDLE: 4,
  UPPER_RIGHT: 5
};

Engine.GUI.GuiBubble.prototype.initialize = function(text) {
  Engine.GUI.GuiElement.prototype.initialize.call(this);

  this._text = new Engine.GUI.GuiText();
  this._text.setSize(
    this.size.x - this._borderWidth * 2 - 10,
    this.size.y - this._borderWidth * 2 - 10
  );
  this._text.setPosition(0, 0);

  if (typeof text !== 'undefined') this._text.setText(text);

  this.attachItem(this._text);
};

Engine.GUI.GuiBubble.prototype.activate = function() {
  Engine.GUI.GuiElement.prototype.activate.call(this);
};

Engine.GUI.GuiBubble.prototype.draw = function(ctx) {
  var pos = this.getPosition();
  var size = this.getSize();
  var scale = this.getScaling();

  ctx.fillStyle = this._backgroundColor;
  ctx.fillRect(
    pos.x - (size.x / 2) * scale.x + 1,
    pos.y - (size.y / 2) * scale.y + 1,
    size.x * scale.x - 2,
    size.y * scale.y - 2
  );

  ctx.lineWidth = this._borderWidth;
  if (this._cornerRadius !== 0) {
    ctx.lineJoin = 'round';
    ctx.lineWidth = this._cornerRadius;
  }
  ctx.strokeStyle = this._borderColor;
  ctx.strokeRect(
    pos.x - (size.x / 2) * scale.x,
    pos.y - (size.y / 2) * scale.y,
    size.x * scale.x,
    size.y * scale.y
  );

  var arrowPos = new Engine.MATH.Point();

  switch (this._arrowPosition) {
    case Engine.GUI.GuiBubble.ARROW_POSITIONS.LOWER_LEFT:
      arrowPos.x = this.position.x - this.size.x / 2 + 40;
      arrowPos.y = this.position.y + this.size.y / 2 - 3;
      break;
    case Engine.GUI.GuiBubble.ARROW_POSITIONS.LOWER_MIDDLE:
      arrowPos.x = this.position.x;
      arrowPos.y = this.position.y + this.size.y / 2 - 3;
      break;
    case Engine.GUI.GuiBubble.ARROW_POSITIONS.LOWER_RIGHT:
      arrowPos.x = this.position.x + this.size.x / 2 - 40;
      arrowPos.y = this.position.y + this.size.y / 2 - 3;
      break;
    case Engine.GUI.GuiBubble.ARROW_POSITIONS.UPPER_LEFT:
      arrowPos.x = this.position.x - this.size.x / 2 + 40;
      arrowPos.y = this.position.y - this.size.y / 2 + 3;
      break;
    case Engine.GUI.GuiBubble.ARROW_POSITIONS.UPPER_MIDDLE:
      arrowPos.x = this.position.x;
      arrowPos.y = this.position.y - this.size.y / 2 + 3;
      break;
    default:
    case Engine.GUI.GuiBubble.ARROW_POSITIONS.UPPER_RIGHT:
      arrowPos.x = this.position.x + this.size.x / 2 - 40;
      arrowPos.y = this.position.y - this.size.y / 2 + 3;
      break;
  }

  ctx.fillStyle = this._backgroundColor;
  ctx.beginPath();
  ctx.moveTo(arrowPos.x - 15, arrowPos.y);
  if (this._arrowPosition < 3) ctx.lineTo(arrowPos.x, arrowPos.y + 15);
  else ctx.lineTo(arrowPos.x, arrowPos.y - 16);
  ctx.lineTo(arrowPos.x + 15, arrowPos.y);
  ctx.closePath();
  ctx.fill();

  ctx.strokeStyle = this._borderColor;
  ctx.beginPath();
  if (this._arrowPosition < 3) {
    ctx.moveTo(arrowPos.x - 15, arrowPos.y + 3);
    ctx.lineTo(arrowPos.x, arrowPos.y + 18);
    ctx.lineTo(arrowPos.x + 15, arrowPos.y + 3);
  } else {
    ctx.moveTo(arrowPos.x - 15, arrowPos.y - 4);
    ctx.lineTo(arrowPos.x, arrowPos.y - 19);
    ctx.lineTo(arrowPos.x + 15, arrowPos.y - 4);
  }
  ctx.stroke();

  Engine.GUI.GuiElement.prototype.draw.call(this, ctx);
};

Engine.GUI.GuiBubble.prototype.step = function(dt) {
  Engine.GUI.GuiElement.prototype.step.call(this, dt);
};

Engine.GUI.GuiBubble.prototype.setBackgroundColor = function(color) {
  this._backgroundColor = color;
};
Engine.GUI.GuiBubble.prototype.setBorderColor = function(color) {
  this._borderColor = color;
};
Engine.GUI.GuiBubble.prototype.setBorderWidth = function(width) {
  this._borderWidth = width;
};
Engine.GUI.GuiBubble.prototype.setCornerRadius = function(radius) {
  this._cornerRadius = radius;
};

Engine.GUI.GuiBubble.prototype.setArrowPosition = function(pos) {
  if (
    pos < 0 ||
    pos > Object.keys(Engine.GUI.GuiBubble.ARROW_POSITIONS).length
  )
    return;

  this._arrowPosition = pos;
};

Engine.GUI.GuiBubble.prototype.getText = function() {
  return this._text;
};
