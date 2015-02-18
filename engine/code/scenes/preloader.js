
Engine.Preloader = function()
{
  Engine.Scene.call(this);

  this.timeStarted      = 0;  // timestamp when activate() was called
  this.percentageLoaded = 0;  // Percentage of files loaded
  this.incremental      = 0;  // current loader step in the incrementalLoader function
  this.imageAssets      = []; // Assets to load
  this.totalImages      = 0;  // Number of different images to be loaded
  this.soundAssets      = []; 

  this.message          = null;
}

Engine.Preloader.prototype = Object.create(Engine.Scene.prototype);
Engine.Preloader.prototype.constructor = Engine.Preloader;

Engine.Preloader.prototype.initialize = function()
{
  Engine.Scene.prototype.initialize.call(this);
}

Engine.Preloader.prototype.activate = function()
{
  engine.logs.log('Preloader.activate', 'Loading assets');

  Engine.Scene.prototype.activate.call(this);

  this.timeStarted = new Date().getTime();

  for (var i = 0, len = this.imageAssets.length; i < len; i++) 
  {
    var what = this.imageAssets[i];

    this.addImageToLoad(what);
  }

  for (var i = 0, len = this.soundAssets.length; i < len; i++) 
  {
    var what = this.soundAssets[i];

    this.addSoundToLoad(what);
  }

  this.message = new Engine.GUI.GuiText(engine.localization.get('loaded') + ' ' + this.percentageLoaded + '%', 300, 30);
  this.message.setPosition(engine.core.size.x/2, engine.core.size.y/2 + 100);
  this.message.setAlign(Engine.GUI.ALIGN.CENTER);
  // this.message.setFontSize(20);
  this.message.setFontColor('#FF2222');
  this.gui.attachItem(this.message, 'msg_loading');
}

Engine.Preloader.prototype.addAnimation = function(data)
{
  this.imageAssets.push(data);
}

Engine.Preloader.prototype.addSprite = function(data)
{
  // Add information for a complete animation spritesheet, with only
  // one image
  data.xStart = 0;
  data.yStart = 0;
  data.frames = 1;
  data.initFrame = 0;
  data.speed = 0;

  this.addAnimation(data);
}

Engine.Preloader.prototype.addImageToLoad = function(data) 
{
  var image = null;

  // Load only new images
  if (!engine.sprites.imageExists(data.path))
  {
    image = new Image();

    addEvent('load', image, function() { 
      engine.preloader.incrementalLoader(); 
    });

    // src always have to be set after adding the event listener, due to bug in IE8
    if (engine.options.assetsURLPrefix != null)
      image.src = engine.options.assetsURLPrefix + data.path;
    else
      image.src = window.location.protocol + '//' + window.location.host + data.path;

    this.totalImages++;

    engine.sprites.addImage(data.path, image);
  }

  // Save only new sprites
  if (!engine.sprites.spriteExists(data.name))
  {
    engine.sprites.addSprite(data.name, data.path, data.xStart, data.yStart, data.width, data.height, data.frames, data.initFrame, data.speed);
  }
}

Engine.Preloader.prototype.addSound = function(data)
{
  this.soundAssets.push(data);
}

Engine.Preloader.prototype.addSoundToLoad = function(data)
{
  var sound = null;

  // Load only new images
  if (!engine.sounds.soundExists(data.path))
  {
    sound = new Audio(data.path);
    // sound.src = data.path;
    sound.load();

    addEvent('canplaythrough', sound, function() { 
      engine.preloader.incrementalLoader('sound'); 
    });

    engine.sounds.addSound(data.name, data.path, sound);
  }
}

Engine.Preloader.prototype.incrementalLoader = function(info)
{
  this.incremental += 1;

  this.percentageLoaded = Math.floor(this.incremental * 100 / (this.totalImages + this.soundAssets.length));
}

Engine.Preloader.prototype.draw = function(ctx)
{
  Engine.Scene.prototype.draw.call(this, ctx);

  // Loading bar
  var barWidth = engine.core.size.x / 3;

  ctx.fillStyle = '#FF2222';
  ctx.fillRect((engine.core.size.x - barWidth) / 2 + 1, engine.core.size.y/2 + 51, this.percentageLoaded * barWidth / 100, 15);

  ctx.lineWidth = 2;
  ctx.strokeStyle = '#FFEEEE';
  ctx.strokeRect((engine.core.size.x - barWidth) / 2, engine.core.size.y/2 + 50, 
                  barWidth + 2, 16);
}

Engine.Preloader.prototype.step = function(dt)
{
  Engine.Scene.prototype.step.call(this, dt);

  this.message.setText( engine.localization.get('loaded') + ' ' + this.percentageLoaded + '%' );

  var timeLived = new Date().getTime() - this.timeStarted;
  
  // At least one second to load resources
  if ((this.percentageLoaded >= 100) && (timeLived > 1000))
  {
    engine.core.activate();
    engine.external('LOADED', null, null);
  }
}
