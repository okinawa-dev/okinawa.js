/*
 *  Base object
 *  Everything on screen should inherit from here
 */

Engine.Item = function()
{
  this.spriteName = null;

  // If false, will not be rendered by the spriteHandler
  this._visible  = true;

  this.position = new Engine.MATH.Point();
  this.size     = new Engine.MATH.Point();
  this.scaling  = new Engine.MATH.Point(1, 1);  

  this.speed    = new Engine.MATH.Point();
  this.maxVel   = 0; // maximum speed
  this.accel    = 0; // acceleration 

  this.vRot     = 0; // rotation speed
  this.maxVRot  = 0; // max rotation speed
  this.accelRot = 0; // rotation accel
  this.rotation = new Engine.MATH.Rotation();

  this.globalAlpha     = 1;

  this.maxRadius       = 0;  // object radius
  this.collisionRadius = 0;  // smaller radius for collsions

  // If isAnimated == true, the object itself would call the spriteHandler to ask 
  // for its new frame, etc
  this.isAnimated      = false;
  this.currentFrame    = 0;  // for animations
  // this.numFrames       = 1;
  this.numLoops        = 1;  // times the animation has been repeated
  // for animations (last time when frame changed)
  this.forceFrameSpeed = 0;  // 0 == spriteHandler will use default animation speed
  this.timeLastFrame   = 0;  // new Date().getTime();    

  // Object hierarchy on the screen
  this._attachedItems  = [];   // objects attached to current position
  this._removedItems   = [];   // objects to be removed at the end of step() 
  this._parent         = null; // object this item is attached to
};

Engine.Item.prototype.initialize = function()
{
};

Engine.Item.prototype.activate = function()
{
  for (var i = 0, len = this._attachedItems.length; i < len; i++) 
  {
    var what = this._attachedItems[i];
    what.activate();
  }
};

Engine.Item.prototype.getVisible = function() { return this._visible; };
Engine.Item.prototype.setVisible = function(value) { this._visible = value; };

Engine.Item.prototype.getParent = function() { return this._parent; };
Engine.Item.prototype.setParent = function(parent)
{
  this._parent = parent;
};

Engine.Item.prototype.getParentScene = function()
{
  var p = this;
  while ((typeof(p) !== 'undefined') && (p !== null))
  {
    if (Engine.Scene.prototype.isPrototypeOf(p))
      return p;
    else
      p = p.getParent();
  }

  return null;
};

Engine.Item.prototype.getAttachedItems = function() { return this._attachedItems; };
Engine.Item.prototype.attachItem = function(what)
{
  // this._attachedItems[this._attachedItems.length] = what;
  this._attachedItems.push(what);
  what.setParent(this);
};

Engine.Item.prototype.detachItem = function(what)
{
  var scene = this.getParentScene();

  // stop listening to input events
  scene.input.removeListeners(what);

  var list = what.children();

  for (var i = 0, len = list.length; i < len; i++) 
    scene.input.removeListeners(list[i]);

  this._removedItems.push(what);
  what.setParent(null);
  // delete this.items[index]; // mark the position as undefined, does not change the array size
  // this.items.splice(index, 1);
};

Engine.Item.prototype.detachAllItems = function()
{
  for (var i = 0, len = this._attachedItems.length; i < len; i++) 
  {
    var what = this._attachedItems[i];
    
    // recursive !!
    what.detachAllItems();
    // what._finalizeRemoved();

    this.detachItem(what);
  }

  this._finalizeRemoved();
};

Engine.Item.prototype.children = function() 
{ 
  var chs = [];

  for (var i = 0, len = this._attachedItems.length; i < len; i++)
  {
    chs = chs.concat(this._attachedItems[i]);
    chs = chs.concat(this._attachedItems[i].children());
  }

  return chs; 
};

Engine.Item.prototype._resetItems = function()
{
  this._attachedItems.length = 0;
};

// Reset the list of removed items
Engine.Item.prototype._resetRemoved = function() 
{
  this._removedItems.length = 0; 
};

// Remove any items marked for removal
Engine.Item.prototype._finalizeRemoved = function() 
{
  for (var i = 0, len = this._removedItems.length; i < len; i++) 
  {
    var what = this._removedItems[i];
    var idx = this._attachedItems.indexOf(what);
    
    if(idx != -1) 
    {
      // what.detachAllItems();
      this._attachedItems.splice(idx, 1);
    }
  }
  // Reset the list of removed objects
  this._resetRemoved();
};

Engine.Item.prototype.setImage = function(spriteName)
{
  this.spriteName = spriteName;

  this.size = engine.sprites.getSpriteSize(spriteName);
};

Engine.Item.prototype.getOrigin = function()
{
  var center = this.getPosition();

  return new Engine.MATH.Point(center.x - this.size.x/2, center.y - this.size.y/2);
};

Engine.Item.prototype.getPosition = function()
{
  var result = new Engine.MATH.Point();
  var parentPosition = new Engine.MATH.Point();
  var transformedPosition = new Engine.MATH.Point();
  
  if (this._parent !== null)
  {
    parentPosition = this._parent.getPosition();
    transformedPosition = this._parent.rotation.transformPosition(this.position);
    result.x = transformedPosition.x + parentPosition.x;
    result.y = transformedPosition.y + parentPosition.y;
  }
  else
  {
    result.x = this.position.x;
    result.y = this.position.y;    
  }

  return result;
};

Engine.Item.prototype.setPosition = function(x, y)
{
  this.position.x = x;
  this.position.y = y;  
};

Engine.Item.prototype.getSize = function() { return this.size; };
Engine.Item.prototype.setSize = function(x, y)
{
  this.size.x = x;
  this.size.y = y;  
};

Engine.Item.prototype.getScaling = function() { return this.scaling; };
Engine.Item.prototype.setScaling = function(x, y)
{
  this.scaling.x = x;
  this.scaling.y = y;  
};

Engine.Item.prototype.getSpeed = function() { return this.speed; };
Engine.Item.prototype.setSpeed = function(x, y)
{
  this.speed.x = x;
  this.speed.y = y;  
};

Engine.Item.prototype.getParentPosition = function()
{
  if (this._parent !== null)
    return this._parent.getPosition();
  else
    return new Engine.MATH.Point();
};

Engine.Item.prototype.getParentSpeed = function()
{
  if (this._parent !== null)
    return this._parent.getSpeed();
  else
    return new Engine.MATH.Point();
};

Engine.Item.prototype.getRadius = function()
{
  return Math.sqrt(Math.pow(this.size.x/2, 2) + Math.pow(this.size.y/2, 2));
};

Engine.Item.prototype.getMagnitude = function() 
{
  return Math.sqrt(this.speed.x * this.speed.x + this.speed.y * this.speed.y);
};

Engine.Item.prototype.move = function(dx, dy)
{
  this.position.x += dx;
  this.position.y += dy;
};

Engine.Item.prototype.rotate = function(dRot)
{
  this.rotation.rotate(dRot);
};

Engine.Item.prototype.setRotation = function(rot)
{
  this.rotation.update(rot);
};

Engine.Item.prototype.getRotation = function()
{  
  if (this._parent !== null)
    return this.rotation.getAngle() + this._parent.getRotation();
  else
    return this.rotation.getAngle();
};

Engine.Item.prototype.draw = function(ctx)
{
  if (this._visible === true)
  {
    for (var i = 0, len = this._attachedItems.length; i < len; i++)
      this._attachedItems[i].draw(ctx);

    if (this.spriteName !== null)
      engine.sprites.draw(ctx, this);

    if (engine.options.drawBoundingBoxes === true)
      this.drawHelper(ctx, 'spriteBox');
    if (engine.options.drawMaxRadius === true)
      this.drawHelper(ctx, 'maxRadius');
    if (engine.options.drawCollisionRadius === true)
      this.drawHelper(ctx, 'collisionRadius');
    if (engine.options.drawOrigins === true)
      this.drawHelper(ctx, 'origin');
    if (engine.options.drawCenters === true)
      this.drawHelper(ctx, 'center');
    if (engine.options.drawDirectionVectors === true)
      this.drawHelper(ctx, 'direction');
  }
};

Engine.Item.prototype.step = function(dt)
{
  if ((this.speed.x !== 0) || (this.speed.y !== 0))
    this.move(this.speed.x * dt / engine.core.TIME_PER_FRAME, this.speed.y * dt / engine.core.TIME_PER_FRAME);
  
  if (this.vRot !== 0)
    this.rotate(this.vRot * dt / engine.core.TIME_PER_FRAME);

  // Advance the necessary frames in the animation if needed
  if ((this.isAnimated === true) && (this.spriteName !== null))
    engine.sprites.step(dt, this);

  for (var i = 0, len = this._attachedItems.length; i < len; i++)
    this._attachedItems[i].step(dt);

  // Remove any objects marked for removal
  this._finalizeRemoved();
};

Engine.Item.prototype.eventAnimationRestart = function() 
{
};

Engine.Item.prototype.drawHelper = function(ctx, what)
{
  var pos = this.getPosition();
  var size = this.getSize();
  var scale = this.getScaling();

  // Draw the collisionRadius
  if ('maxRadius' == what)
  {
    ctx.beginPath();
    ctx.arc(pos.x, pos.y, this.maxRadius, 0 , 2 * Math.PI, false);
    ctx.closePath();
    ctx.lineWidth = 1;
    ctx.strokeStyle = '#FF0000';
    ctx.stroke();
  }
  else if ('collisionRadius' == what)
  {
    ctx.beginPath();
    ctx.arc(pos.x, pos.y, this.collisionRadius, 0 , 2 * Math.PI, false);
    ctx.closePath();
    ctx.lineWidth = 1;
    ctx.strokeStyle = '#FF0000';
    ctx.stroke();
  }
  // Draw the origin
  else if ('origin' == what)
  {
    ctx.fillStyle = '#FF0000';
    ctx.fillRect(pos.x - size.x/2 * scale.x, pos.y - size.y/2 * scale.y, 2, 2);  
  }
  else if ('center' == what)
  {
    ctx.fillStyle = '#FF0000';
    ctx.fillRect(pos.x, pos.y, 2, 2);
  }
  else if ('spriteBox' == what)
  {
    ctx.lineWidth = 1;
    ctx.strokeStyle = '#FF0000';
    ctx.strokeRect(pos.x - size.x/2 * scale.x, 
                   pos.y - size.y/2 * scale.y, 
                   size.x * scale.x, 
                   size.y * scale.y);
  }
  else if ('direction' == what)
  {
    var speed = this.getSpeed();

    ctx.lineWidth = 1;
    ctx.strokeStyle = '#FF0000';
    ctx.beginPath();
    ctx.moveTo(pos.x, pos.y);
    ctx.lineTo(pos.x + speed.x * 10, pos.y + speed.y * 10);
    ctx.stroke();    
  }
};

// By default, when an item collides, it is deleted
// Objects which inherit from Item must implement their own collide method
Engine.Item.prototype.collide = function()
{
  // Delete the attached items
  this.detachAllItems();

  // true if object should be removed, false otherwise
  return true;
};
