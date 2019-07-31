
Engine.Tracker = function(callback) 
{
  Engine.Item.call(this);

  this.callback = callback;
};

Engine.Tracker.prototype = Object.create(Engine.Item.prototype);
Engine.Tracker.prototype.constructor = Engine.Tracker;


Engine.Tracker.prototype.initialize = function()
{
  Engine.Item.prototype.initialize.call(this);
};

Engine.Tracker.prototype.activate = function()
{
  Engine.Item.prototype.activate.call(this);
};

Engine.Tracker.prototype.step = function (dt)
{
  // Item.step is where the attached items steps are called, so they go 
  // after updating the tracker

  Engine.Item.prototype.step.call(this, dt);
};

Engine.Tracker.prototype.draw = function (ctx) 
{
  Engine.Item.prototype.draw.call(this, ctx); 
};

Engine.Tracker.prototype.forceDetach = function()
{
  if (this.getParent() !== null)
  {
    // Move all children from here to the parent
    for (var i = 0, len = this.getAttachedItems().length; i < len; i++)
    {
      var element = this.getAttachedItems()[i];

      element.position.x += this.position.x;
      element.position.y += this.position.y;

      // Exit speed, so the element does not stop
      // element.speed.x = direction.x * this.trackSpeed;
      // element.speed.y = direction.y * this.trackSpeed;

      this.detachItem(element);
      this.getParent().attachItem(element);
    }

    // Suicide!
    this.getParent().detachItem(this);  
  }
};
