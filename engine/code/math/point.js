
Engine.MATH.Point = function(a, b) 
{
  if (undefined == a)
    this.x = 0;
  else 
    this.x = a;

  if (undefined == b)
    this.y = 0;
  else 
    this.y = b;
}

// Now in Engine.MATH.Math.pointDistance
// Engine.MATH.Point.prototype.distance = function(destination)
// {
//   if ((destination.x == undefined) || (destination.y == undefined))
//     return 0;

//   return Math.sqrt(Math.pow(destination.x - this.x, 2) + Math.pow(destination.y - this.y, 2));
// }

Engine.MATH.Point.prototype.magnitude = function()
{
  return Math.sqrt(this.x * this.x + this.y * this.y);
}

Engine.MATH.Point.prototype.normalize = function()
{
  var magnitude = this.magnitude();
  return new Engine.MATH.Point(this.x / magnitude, this.y / magnitude);
}

