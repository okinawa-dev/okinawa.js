
// Object to store screen, graphical, and browser auxiliar 
// functions that have no other place to be ;)

Engine.Device = function()
{
  this.canvasGlobalOffset = new Engine.MATH.Point();
  this.isTouchDevice = false;

  this.isResizing = false;
  this._clearTimeOutId = null;
}

Engine.Device.prototype.initialize = function()
{
  this.isTouchDevice = this.detectTouchDevice();

  if (this.isTouchDevice)
    engine.logs.log('Engine.Initialize', 'Touch device detected');
  else
    engine.logs.log('Engine.Initialize', 'Touch device NOT detected');

  // Get the offset of the DOM element used to capture the touch events
  this.canvasGlobalOffset = engine.device.getGlobalOffset(engine.core.canvas);

  addEvent('resize', window, function(event) {

    engine.device.isResizing = true;
    engine.gui.get('console').addText('resize', 'Resizing!'); 
    // engine.logs.log('Engine.INPUT.Controller.onResize', 'Window resized');        

    // Recalculate if window is resized
    engine.device.canvasGlobalOffset = engine.device.getGlobalOffset(engine.core.canvas);

    clearTimeout(this._clearTimeOutId);
    this._clearTimeOutId = setTimeout(engine.device.doneResizing, 1000);

  });

  if (engine.options.avoidLeavingPage == true)
    this.avoidLeavingPage();
}

Engine.Device.prototype.doneResizing = function()
{
  engine.device.isResizing = false;
  engine.gui.get('console').addText('resize', 'Resizing done');   
}

Engine.Device.prototype.activate = function()
{
}

Engine.Device.prototype.getGlobalScroll = function()
{
  var pos = new Engine.MATH.Point(0, 0);

  // All browsers except IE < 9
  if (window.pageYOffset)
  {
    pos.x = window.pageXOffset;
    pos.y = window.pageYOffset;
  }
  else
  {
    // Try to fall back if IE < 9, don't know for sure if this is gonna
    // work fine
    var element = document.getElementsByTagName('html')[0];

    if (element.scrollTop)
    {
      pos.x = element.scrollLeft;
      pos.y = element.scrollTop;
    }
  }

  return pos;
}

// Distance in pixels of a DOM element from the origin of the navigator
Engine.Device.prototype.getGlobalOffset = function(element)
{
  var pos = new Engine.MATH.Point(0, 0);
  pos.x = element.offsetLeft;
  pos.y = element.offsetTop;

  while (element = element.offsetParent)
  {
    pos.x += element.offsetLeft;
    pos.y += element.offsetTop;    
  }

  return pos;
}

Engine.Device.prototype.detectTouchDevice = function()
{
  if (('ontouchstart' in window) || window.DocumentTouch && (document instanceof DocumentTouch))
    return true;
  return false;
}

Engine.Device.prototype.getUserAgent = function()
{
  return navigator.userAgent;
}

Engine.Device.prototype.avoidLeavingPage = function()
{
  window.onbeforeunload = function() {
    return '';
  }
}

// Tricks got from stackoverflow
// http://stackoverflow.com/questions/3665115/create-a-file-in-memory-for-user-to-download-not-through-server
Engine.Device.prototype.createAndDownloadFile = function(filename, text)
{
  // IE
  if (window.navigator.msSaveOrOpenBlob) 
  {
    var blob = new Blob([text],{
        type: 'text/csv;charset=utf-8;',
    });

    window.navigator.msSaveOrOpenBlob(blob, filename)
  }
  // Other browsers
  else
  {
    var link = document.createElement('a');

    link.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text));
    link.setAttribute('download', filename);    

    // In Firefox the element has to be placed inside the DOM
    document.body.appendChild(link)
    link.click();  
    document.body.removeChild(link)  
  }
}


