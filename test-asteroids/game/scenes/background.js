
Game.Background = function()
{ 
  Engine.Background.call(this);

  this.BACKGROUND_SPEED = 8;
  this.BACKGROUND_STARS = 30;

  this.speeds = [];
  this.offsets = [];
  this.parallaxDisplacement = 5;

  this.starfields = [];
}

Game.Background.prototype = Object.create(Engine.Background.prototype);
Game.Background.prototype.constructor = Game.Background;

Game.Background.prototype.initialize = function() 
{
  for(var depth = 0; depth < 3; depth++) 
  {
    // Create a generic background
    this.starfields[depth] = document.createElement('canvas');
    this.starfields[depth].layer = depth; 
    this.starfields[depth].width = engine.core.size.x + (depth + 1) * this.parallaxDisplacement; 
    this.starfields[depth].height = engine.core.size.y;
    this.starfields[depth].ctx = this.starfields[depth].getContext('2d');

    this.speeds[depth] = this.BACKGROUND_SPEED + (depth + 1) * 7;
    this.offsets[depth] = 0;

    // fill the deepest layer with black background
    if (depth == 0)
    {
      this.starfields[depth].ctx.fillStyle = '#000';
      this.starfields[depth].ctx.fillRect(0,0, this.starfields[depth].width, this.starfields[depth].height);
    }

    this.starfields[depth].ctx.fillStyle = '#FFF';
    this.starfields[depth].ctx.globalAlpha = (depth + 1) * 2/10;

    // Now draw a bunch of random 2 pixel
    // rectangles onto the offscreen canvas
    for(var i = 0; i < this.BACKGROUND_STARS; i++) 
    {
      this.starfields[depth].ctx.fillRect(
                        Math.floor(Math.random() * this.starfields[depth].width),
                        Math.floor(Math.random() * this.starfields[depth].height),
                        depth + 1,  
                        depth + 1);
    } 
  }  
}

Game.Background.prototype.step = function(dt) 
{
  // Call inherited function 
  // Engine.Background.prototype.step.call(this, dt);

  for(var depth = 0; depth < 3; depth++) 
  {
    this.offsets[depth] += this.speeds[depth] / dt;
    this.offsets[depth] = this.offsets[depth] % this.starfields[depth].height;
  }
}

Game.Background.prototype.draw = function(ctx) 
{
  // Call inherited function 
  // Engine.Background.prototype.draw.call(this, ctx);

  for(var depth = 0; depth < 3; depth++) 
  {
    var intOffset = Math.floor(this.offsets[depth]);
    var remaining = this.starfields[depth].height - intOffset;
    var maxWidth  = this.starfields[depth].width;

    // Parallax offset of each layer in the background
    var parallaxOffset;

    // No player or one the three first screens (preloader, menu or initial animation)
    if ((engine.game.player == undefined) || (engine.currentScene <= 2))
    {
      parallaxOffset = (depth + 1) * this.parallaxDisplacement * (engine.core.size.x / 2) / engine.core.size.x;
    }
    else
    {
      var playerDisplacement = engine.game.player.getAvatar().getPosition().x;

      parallaxOffset = Math.round((depth + 1) * this.parallaxDisplacement * playerDisplacement / engine.core.size.x);
      
      if (parallaxOffset < 0) 
        parallaxOffset = 0;
      else if (parallaxOffset + engine.core.size.x > maxWidth)
        parallaxOffset = maxWidth - engine.core.size.x;
    }

    // Draw the top half of the starfield
    if(intOffset > 0) 
    {
      ctx.drawImage(this.starfields[depth],
                0 + parallaxOffset, remaining,
                engine.core.size.x, intOffset,
                0, 0,
                engine.core.size.x, intOffset);
    }

    // Draw the bottom half of the starfield
    if(remaining > 0) 
    {
      ctx.drawImage(this.starfields[depth],
              0 + parallaxOffset, 0,
              engine.core.size.x, remaining,
              0, intOffset,
              engine.core.size.x, remaining);
    }
  }
}
