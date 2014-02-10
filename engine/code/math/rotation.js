
// Rotation matrix = 
//   | cos(r)  -sin(r) |
//   | sin(r)   cos(r) |

// Inner representation for fast access
//   | a b |
//   | c d |

Engine.MATH.Rotation = function() 
{
  this.angle = 0;

  // Matrix for zero degrees rotation
  this.a = 1;
  this.b = 0;
  this.c = 0;
  this.d = 1;
}

Engine.MATH.Rotation.prototype.getAngle = function()
{
  return this.angle;
}

Engine.MATH.Rotation.prototype.rotate = function(dRot)
{
  this.update(this.angle + dRot);
}

Engine.MATH.Rotation.prototype.update = function(newAngle)
{
  this.angle = newAngle;

  this.a = Math.cos(this.angle);
  this.b = -Math.sin(this.angle);
  this.c = Math.sin(this.angle);
  this.d = Math.cos(this.angle);
}

Engine.MATH.Rotation.prototype.transformPosition = function(point)
{
  return new Engine.MATH.Point(point.x * this.a + point.y * this.b, point.x * this.c + point.y * this.d);
}
