

Engine.TrackerBezier = function(callback) 
{
  Engine.Tracker.call(this, callback);

  // Example of bezier speed
  this.trackSpeed = 1/250;

  // For Bezier tracks
  this.bezierAdvance = 0;

  this.p0 = null;
  this.p1 = null;
  this.p2 = null;
  this.p3 = null;

  // var p0 = { x: -60,  y: -10  };
  // var p1 = { x: -70,  y: -200 };
  // var p2 = { x: -125, y: -200 };
  // var p3 = { x: 100,  y: -350 };

  // this.bezierPoints(p0, p1, p2, p3);
}

Engine.TrackerBezier.prototype = Object.create(Engine.Tracker.prototype);
Engine.TrackerBezier.prototype.constructor = Engine.TrackerBezier;


Engine.TrackerBezier.prototype.initialize = function()
{
  Engine.Tracker.prototype.initialize.call(this);
}

Engine.TrackerBezier.prototype.activate = function()
{
  Engine.Tracker.prototype.activate.call(this);
}

Engine.TrackerBezier.prototype.bezierPoints = function(p0, p1, p2, p3)
{
  this.p0 = p0;
  this.p1 = p1;
  this.p2 = p2;
  this.p3 = p3;

  this.cx = 3 * (this.p1.x - this.p0.x)
  this.bx = 3 * (this.p2.x - this.p1.x) - this.cx;
  this.ax = this.p3.x - this.p0.x - this.cx - this.bx;

  this.cy = 3 * (this.p1.y - this.p0.y);
  this.by = 3 * (this.p2.y - this.p1.y) - this.cy;
  this.ay = this.p3.y - this.p0.y - this.cy - this.by;  
}

Engine.TrackerBezier.prototype.step = function (dt)
{
  var t = this.bezierAdvance;
  this.bezierAdvance += this.trackSpeed * dt / engine.core.TIME_PER_FRAME;

  var oldX = this.position.x;
  var oldY = this.position.y;

  this.position.x = this.ax*(t*t*t) + this.bx*(t*t) + this.cx*t + this.p0.x;
  this.position.y = this.ay*(t*t*t) + this.by*(t*t) + this.cy*t + this.p0.y;

  // inform the attached items we are moving
  for (var i = 0, len = this.getAttachedItems().length; i < len; i++)
  {
    var element = this.getAttachedItems()[i];
    if (this.position.x > oldX)
      element.informEvent(EVENTS.RIGHT);
    else if (this.position.x < oldX)
      element.informEvent(EVENTS.LEFT);
    if (this.position.y > oldY)
      element.informEvent(EVENTS.DOWN);
    else if (this.position.y < oldY)
      element.informEvent(EVENTS.UP);
  }

  // End of the curve
  if (this.bezierAdvance > 1) 
  {
    this.bezierAdvance = 1;

    if (this.getParent() != null)
    {
      // Move all children from here to the parent
      for (var i = 0, len = this.getAttachedItems().length; i < len; i++)
      {
        var element = this.getAttachedItems()[i];

        element.position.x += this.position.x;
        element.position.y += this.position.y;

        this.getParent().attachItem(element);
        this.detachItem(element);
      }

      // Suicide!
      this.getParent().detachItem(this);
    }

    if (this.callback)
      this.callback();
  }

  // Tracker.step is where the attached items steps are called, so they go 
  // after updating the tracker

  // Call inherited function 
  Engine.Tracker.prototype.step.call(this, dt);
}

Engine.TrackerBezier.prototype.draw = function (ctx) 
{
  // Call inherited function 
  Engine.Tracker.prototype.draw.call(this, ctx); 

  if (engine.options.drawTrackers == true)
  {
    var pos = this.getParentPosition();
    var gradient = ctx.createLinearGradient(pos.x + this.p0.x, pos.y + this.p0.y, 
                                            pos.x + this.p3.x, pos.y + this.p3.y);
    gradient.addColorStop(0, '#009');
    gradient.addColorStop(1, '#900');
    ctx.strokeStyle = gradient;
    ctx.fillStyle = null;

    ctx.lineWidth = 1;
    // ctx.strokeStyle = '#FF0000';

    ctx.beginPath();
    ctx.moveTo(pos.x + this.p0.x, pos.y + this.p0.y);
    ctx.bezierCurveTo(pos.x + this.p1.x, pos.y + this.p1.y, 
                      pos.x + this.p2.x, pos.y + this.p2.y, 
                      pos.x + this.p3.x, pos.y + this.p3.y);
    ctx.stroke();
  }
}

