
Engine.Logs = function()
{
}

Engine.Logs.prototype.log = function (fileName, message, object) 
{
  var result = [];

  if (engine.options.debugInConsole == false)
    return;

  if (engine.options.debugFunctionNames == true)
    result.push(fileName);

  if (Array.isArray(message))
    result.push(message.join(' '));
  else
    result.push(message);
  if (object)
    result.push(object);

  if ((engine.options.debugInHtml == true) && (engine.core.canvas != undefined))
  {
    var e = document.createElement('div');
    e.innerHTML = result;
    engine.core.canvas.parentNode.appendChild(e);
  }
  // Old IE, console is not initialized by default
  else if (typeof console === "undefined" || typeof console.log === "undefined")
  {
    // Do nothing?
  }
  else
  {
    console.log(result);
  }
}
