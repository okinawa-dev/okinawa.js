
Engine.TrackerFollow = function(callback) 
{
  Engine.Tracker.call(this, callback);

  this.targetOb = null;
  this.lastDirection = null; // In case target disappears

  this.trackSpeed = 1;
}

Engine.TrackerFollow.prototype = Object.create(Engine.Tracker.prototype);
Engine.TrackerFollow.prototype.constructor = Engine.TrackerFollow;


Engine.TrackerFollow.prototype.initialize = function()
{
  Engine.Tracker.prototype.initialize.call(this);
}

Engine.TrackerFollow.prototype.activate = function()
{
  Engine.Tracker.prototype.activate.call(this);
}

Engine.TrackerFollow.prototype.setTarget = function(target)
{
  this.targetOb = target;
}

Engine.TrackerFollow.prototype.step = function (dt)
{
  var pos = this.getPosition();
  var targetPos = this.targetOb.getPosition();
  var direction = null;
  var forceDetach = false;

  // The target has been removed from the scene
  if (this.targetOb.getParent() == null)
  {
    direction = this.lastDirection;
    forceDetach = true;
  }
  else
  {
    direction = new Engine.MATH.Point(targetPos.x - pos.x,
                                      targetPos.y - pos.y);

    direction = direction.normalize();
    this.lastDirection = direction;
  }

  if ((forceDetach == false) && (engine.math.pointDistance(pos, targetPos) > 2))
  {
    this.position.x += direction.x * this.trackSpeed;
    this.position.y += direction.y * this.trackSpeed;
  }
  else
  {
    if (this.getParent() != null)
    {
      // Move all children from here to the parent
      for (var i = 0, len = this.getAttachedItems().length; i < len; i++)
      {
        var element = this.getAttachedItems()[i];

        element.position.x += this.position.x;
        element.position.y += this.position.y;

        // Exit speed, so the element does not stop
        element.speed.x = direction.x * this.trackSpeed;
        element.speed.y = direction.y * this.trackSpeed;

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

Engine.TrackerFollow.prototype.draw = function (ctx) 
{
  // Call inherited function 
  Engine.Tracker.prototype.draw.call(this, ctx); 

  if (engine.options.drawTrackers == true)
  {
    var pos = this.getPosition();
    var targetPos = this.targetOb.getPosition();
    var gradient = ctx.createLinearGradient(pos.x, pos.y, 
                                            targetPos.x, targetPos.y);
    gradient.addColorStop(0, '#009');
    gradient.addColorStop(1, '#900');
    ctx.strokeStyle = gradient;
    // ctx.strokeStyle = '#FF0000';
    ctx.lineWidth = 1;
    
    ctx.beginPath();
    ctx.moveTo(pos.x, pos.y);
    ctx.lineTo(targetPos.x, targetPos.y);
    ctx.stroke();
  }
}

