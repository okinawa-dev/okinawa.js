
Engine.MATH = {};

// Object to store mathematical and graphical auxiliar 
// functions that have no other place to be ;)

Engine.MATH.Math = function()
{
};

Engine.MATH.Math.prototype.initialize = function()
{
};

Engine.MATH.Math.prototype.activate = function()
{
};

// Distance between two Engine.MATH.Point objects
Engine.MATH.Math.prototype.pointDistance = function(origin, destination)
{
  if ((typeof(destination.x) == 'undefined') || (typeof(destination.y) == 'undefined') || 
      (typeof(origin.x) == 'undefined') || (typeof(origin.y) == 'undefined'))
    return -1;

  return Math.sqrt(Math.pow(destination.x - origin.x, 2) + Math.pow(destination.y - origin.y, 2));
};


Engine.MATH.Math.prototype.angleToDirectionVector = function(angle)
{
  var result = new Engine.MATH.Point();

  result.x = Math.cos(angle);
  result.y = Math.sin(angle);

  return result;
};
