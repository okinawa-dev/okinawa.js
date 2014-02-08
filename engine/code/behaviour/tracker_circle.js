

Engine.TrackerCircle = function(callback) 
{
  Engine.Tracker.call(this, callback);

  // For circular tracks
  this.circleAngle = 0.1;
  this.circleRadius = 60;
}

Engine.TrackerCircle.prototype = Object.create(Engine.Tracker.prototype);
Engine.TrackerCircle.prototype.constructor = Engine.TrackerCircle;


Engine.TrackerCircle.prototype.initialize = function()
{
  Engine.Tracker.prototype.initialize.call(this);
}

Engine.TrackerCircle.prototype.activate = function()
{
  Engine.Tracker.prototype.activate.call(this);
}

Engine.TrackerCircle.prototype.step = function (dt)
{
  this.circleAngle += this.trackSpeed * dt / engine.core.TIME_PER_FRAME;
  this.position.x = Math.cos(this.circleAngle) * this.circleRadius;
  this.position.y = Math.sin(this.circleAngle) * this.circleRadius;

  // Tracker.step is where the attached items steps are called, so they go 
  // after updating the tracker

  // Call inherited function 
  Engine.Tracker.prototype.step.call(this, dt);
}

Engine.TrackerCircle.prototype.draw = function (ctx) 
{
  // Call inherited function 
  Engine.Tracker.prototype.draw.call(this, ctx); 

  if (engine.options.drawTrackers == true)
  {
    var pos = this.getParentPosition();
    var gradient = ctx.createLinearGradient(pos.x - this.circleRadius, pos.y, 
                                            pos.x + this.circleRadius, pos.y);
    gradient.addColorStop(0, '#009');
    gradient.addColorStop(1, '#900');
    ctx.strokeStyle = gradient;
    // ctx.strokeStyle = '#FF0000';
    ctx.lineWidth = 1;

    ctx.beginPath();
    ctx.arc(pos.x, pos.y, this.circleRadius, 0, 2 * Math.PI, false);
    ctx.closePath();
    ctx.stroke();
  }
}

