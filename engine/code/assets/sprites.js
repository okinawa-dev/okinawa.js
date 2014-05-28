 
Engine.Sprites = function()
{
  // Information related to each sprite, as it was configured in the preloader, indexed by 
  // the sprite id/name
  // sprites[spriteName] = [imagePath, xStart, yStart, width, height, frames, initFrame, speed]
  this.sprites = {};

  // List of Image() objects used in the game, indexed by original URL
  // images[path] = object;
  this.images  = {};
}

Engine.Sprites.SPRITEINFO = {
  PATH : 0,
  XSTART : 1,
  YSTART : 2,
  WIDTH : 3,
  HEIGTH : 4,
  FRAMES : 5,
  INITFRAME : 6,
  FRAMESPEED : 7
}

Engine.Sprites.prototype.initialize = function() 
{ 
  // engine.logs.log('engine.sprites.initialize', 'Initializing sprites Handler');

  this.sprites.length = 0;
  this.images.length = 0;
}

Engine.Sprites.prototype.step = function(dt, object) 
{
  var fps       = this.sprites[object.spriteName][Engine.Sprites.SPRITEINFO.FRAMESPEED];
  var frames    = this.sprites[object.spriteName][Engine.Sprites.SPRITEINFO.FRAMES];
  var initFrame = this.sprites[object.spriteName][Engine.Sprites.SPRITEINFO.INITFRAME];

  // If the item wants to be rendered at different frame speed
  if (object.forceFrameSpeed != 0)
    fps = object.forceFrameSpeed;

  // if frames > 1 -> animation
  if (frames > 1)
  {
    var now = new Date().getTime();

    // If the animation just started
    if (object.timeLastFrame == 0)
      object.timeLastFrame = now;

    // If time enough has passed to change the currentFrame
    if (now - object.timeLastFrame > 1000 / fps)
    {
      var preFrame = object.currentFrame;

      object.currentFrame++;
      
      if (object.currentFrame >= initFrame + frames)
        object.currentFrame = initFrame;

      object.timeLastFrame = now;

      // If the animation restarts, increment loop counter
      if (preFrame == frames - 1) {
        object.numLoops += 1;
        if (object.eventAnimationRestart != undefined)
          object.eventAnimationRestart();
      }
    }
  }
}

Engine.Sprites.prototype.draw = function(ctx, object) 
{
  if (object.getVisible() == false)
    return;

  // sprites[i] -> [imagePath, xStart, yStart, width, height, frames, initFrame, speed]
  var image     = this.sprites[object.spriteName][Engine.Sprites.SPRITEINFO.PATH];
  var xStart    = this.sprites[object.spriteName][Engine.Sprites.SPRITEINFO.XSTART];
  var yStart    = this.sprites[object.spriteName][Engine.Sprites.SPRITEINFO.YSTART];
  var width     = this.sprites[object.spriteName][Engine.Sprites.SPRITEINFO.WIDTH];
  var height    = this.sprites[object.spriteName][Engine.Sprites.SPRITEINFO.HEIGTH];
  var frames    = this.sprites[object.spriteName][Engine.Sprites.SPRITEINFO.FRAMES];

  var position = object.getPosition();

  // Set transparency
  ctx.globalAlpha = object.globalAlpha;

  if (object.rotation.getAngle() != 0)
  {
    ctx.save();

    ctx.translate(position.x, position.y);
    ctx.rotate(object.rotation.getAngle());

    ctx.drawImage(this.images[image],
                  xStart + object.currentFrame * width, yStart, 
                  width, height, 
                  -width/2 * object.scaling.x, -height/2 * object.scaling.y,
                  width * object.scaling.x, height * object.scaling.y);

    ctx.restore();
  }
  // Draw without rotation
  else
  {
    ctx.drawImage(this.images[image],
                  xStart + object.currentFrame * width, yStart, 
                  width, height, 
                  position.x - width / 2 * object.scaling.x, position.y - height / 2 * object.scaling.y,
                  width * object.scaling.x, height * object.scaling.y);
  }

  // restore, just in case
  ctx.globalAlpha = 1;
}

Engine.Sprites.prototype.imageExists = function(path)
{
  return this.images.hasOwnProperty(path);
}

Engine.Sprites.prototype.spriteExists = function(name)
{
  return this.sprites.hasOwnProperty(name);
}

Engine.Sprites.prototype.addImage = function(path, object)
{
  this.images[path] = object;
}

Engine.Sprites.prototype.addSprite = function(name, path, xStart, yStart, width, height, frames, initFrame, speed)
{
  this.sprites[name] = [path, xStart, yStart, width, height, frames, initFrame, speed];
}

// Returns the object to be painted in the context
Engine.Sprites.prototype.getImage = function(spriteName)
{
  // this.sprites[spriteName][0] -> full path from the spriteName
  return this.images[this.sprites[spriteName][Engine.Sprites.SPRITEINFO.PATH]];
}

Engine.Sprites.prototype.getImageFromPath = function(path)
{
  return this.images[path];
}

Engine.Sprites.prototype.getSpriteData = function(spriteName)
{
  var ret = this.sprites[spriteName];

  if (ret != undefined)
      return ret;

  return null;
}

Engine.Sprites.prototype.getSpriteInfo = function(spriteName, value)
{
  var ret = this.sprites[spriteName];

  if (ret != undefined)
  {
    var info = ret[value];

    if (info != undefined)
      return info;
  }

  return null;
}

Engine.Sprites.prototype.getSpriteSize = function(spriteName)
{
  var ret = this.sprites[spriteName];
  var w = 0;
  var h = 0;

  if (ret != undefined)
  {
    w = ret[ Engine.Sprites.SPRITEINFO.WIDTH ];
    h = ret[ Engine.Sprites.SPRITEINFO.HEIGTH ];
  }

  return new Engine.MATH.Point(w,h);    
}

