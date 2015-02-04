
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

Engine.MATH.Point.prototype.magnitude = function()
{
  return Math.sqrt(this.x * this.x + this.y * this.y);
}

Engine.MATH.Point.prototype.normalize = function()
{
  var magnitude = this.magnitude();
  return new Engine.MATH.Point(this.x / magnitude, this.y / magnitude);
}

Engine.MATH.Point.prototype.equals = function(p)
{
  if (p instanceof Engine.MATH.Point == false)
    return false;
  
  return ( (this.x == p.x) && (this.y == p.y) );
}
