
Game.Player = function()
{ 
  Engine.Player.call(this);

  this.avatar = null;

  // for shooting
  this.timeLastShot = 0;

  this.isTurningLeft = false;
  this.isTurningRight = false;
  this.isThrusting = false;

  this.rotationSpeed = Math.PI/50;
  this.flightSpeed = 0.05; // More than 0.3 -> impossible to control
}

Game.Player.prototype = Object.create(Engine.Player.prototype);
Game.Player.prototype.constructor = Game.Player;

// Will be called after creation of this object
Game.Player.prototype.initialize = function()
{
  Engine.Player.prototype.initialize.call(this);

  this.avatar = new Game.ITEMS.Starship('starship');

  this.avatar.initialize();
}

Game.Player.prototype.activate = function()
{
  Engine.Player.prototype.activate.call(this);

  this.timeLastShot = 0;
  this.isTurningLeft = false;
  this.isTurningRight = false;
  this.isThrusting = false;

  // activate will be called everytime we change to a new scene,
  // so we should ask to the input controller of the new scene to inform us about
  // new key events

  this.getAvatar().getParentScene().input.addKeyListener(this, 'eventKeyPressed', [ Engine.INPUT.KEYS.SPACEBAR ]);
}

Game.Player.prototype.eventKeyPressed = function(keyCode)
{
  if (keyCode == Engine.INPUT.KEYS.SPACEBAR)
  {
    var now = new Date().getTime();

    // Enough time between shots
    if (now - this.timeLastShot > engine.options.shotPeriodicity)
    {
      this.avatar.shoot();
      this.timeLastShot = now;
    }
  }
}

Game.Player.prototype.step = function(dt)
{
  // If the avatar is not attached to a playable scene,
  // nothing to do
  if ((this.getAvatar().getParentScene() != undefined) &&
      (this.getAvatar().getParentScene().playable == false))
    return;

  // ------------------------------------------------
  //  Continuous keys (without events)
  // ------------------------------------------------

  if ( engine.input.isKeyPressed(Engine.INPUT.KEYS.LEFT) )
    this.isTurningLeft = true;
  else
    this.isTurningLeft = false;
  
  if ( engine.input.isKeyPressed(Engine.INPUT.KEYS.RIGHT) ) 
    this.isTurningRight = true; 
  else
    this.isTurningRight = false;
  
  if ( engine.input.isKeyPressed(Engine.INPUT.KEYS.UP) ) 
    this.isThrusting = true;
  else
    this.isThrusting = false;

  // ------------------------------------------------
  //  Rotation
  // ------------------------------------------------

  if (this.isTurningLeft == true)
    this.avatar.vRot = -this.rotationSpeed;
  else if (this.isTurningRight == true)
    this.avatar.vRot = this.rotationSpeed;
  else
    this.avatar.vRot = 0;    

  // ------------------------------------------------
  //  Thrusting
  // ------------------------------------------------

  if (this.isThrusting == true)
  {
    var dir = engine.math.angleToDirectionVector(this.avatar.rotation.getAngle());

    dir = dir.normalize();

    this.avatar.speed.x += dir.x * this.flightSpeed;
    this.avatar.speed.y += dir.y * this.flightSpeed;
  }

  // ------------------------------------------------
  //  Check Scene limits
  // ------------------------------------------------
  // To Do: maybe this should be in the scene code?
  
  // Check if we are inside the scene
  // Bounce right side
  if (this.avatar.position.x > engine.core.size.x)
  {
    this.avatar.move(-(this.avatar.size.x / 4), 0);
    this.avatar.speed.x = -this.avatar.speed.x / 2; 
  }
  // Bounce left side
  else if (this.avatar.position.x < 0)
  {
    this.avatar.move(this.avatar.size.x / 4, 0);
    this.avatar.speed.x = -this.avatar.speed.x / 2;
  }

  // Bounce lower side
  if (this.avatar.position.y > engine.core.size.y)
  {
    this.avatar.move(0, -this.avatar.size.y / 4);
    this.avatar.speed.y = -this.avatar.speed.y / 2;
  }
  // Bounce upper side
  else if (this.avatar.position.y < 0)
  {
    this.avatar.move(0, this.avatar.size.y / 4);
    this.avatar.speed.y = -this.avatar.speed.y / 2;
  } 
}



