
Engine.TrackerSine = function(callback) 
{
  Engine.Tracker.call(this, callback);

  this.position        = new Engine.MATH.Point(0, 0); 
  this.amplitudeVector = new Engine.MATH.Point(10, 10); // { x: 10, y: 10};
  this.frequencyVector = new Engine.MATH.Point(1, 1);   // { x: 1, y: 1};
  // phase in degrees (will be converted to radians)
  this.phaseVector     = new Engine.MATH.Point(0, 0);   // { x: 1, y: 1};

  this.initTime = 0;
}

Engine.TrackerSine.prototype = Object.create(Engine.Tracker.prototype);
Engine.TrackerSine.prototype.constructor = Engine.TrackerSine;


Engine.TrackerSine.prototype.initialize = function()
{
  Engine.Tracker.prototype.initialize.call(this);

  this.initTime = new Date().getTime();
}

Engine.TrackerSine.prototype.activate = function()
{
  Engine.Tracker.prototype.activate.call(this);

  this.initTime = new Date().getTime();
}

Engine.TrackerSine.prototype.step = function (dt)
{
  this.position.x += this.amplitudeVector.x * 
                        Math.sin((new Date().getTime() - this.initTime)/1000 * 
                          this.frequencyVector.x + 
                          this.phaseVector.x/180 * 
                          Math.PI) * (dt / 1000);
  this.position.y += this.amplitudeVector.y * 
                        Math.sin((new Date().getTime() - this.initTime)/1000 * 
                          this.frequencyVector.y + 
                          this.phaseVector.y/180 * 
                          Math.PI) * (dt / 1000);

  // Tracker.step is where the attached items steps are called, so they go 
  // after updating the tracker

  // Call inherited function 
  Engine.Tracker.prototype.step.call(this, dt);
}

Engine.TrackerSine.prototype.draw = function (ctx) 
{
  // Call inherited function 
  Engine.Tracker.prototype.draw.call(this, ctx); 

  if (engine.options.drawTrackers == true)
  {
    var pos = this.getParentPosition();
    ctx.strokeStyle = '#FF0000';
    ctx.lineWidth = 1;

    ctx.beginPath();
    ctx.moveTo(pos.x, pos.y);
    ctx.lineTo(pos.x + this.position.x, pos.y + this.position.y);
    ctx.closePath();
    ctx.stroke();
  }
}

