// mathematical and graphical auxiliar
// functions that have no other place to be ;)

import Point from './point';
import Rotation from './rotation';

// Distance between two Engine.MATH.Point objects
function pointDistance(origin, destination) {
  if (
    typeof destination.x == 'undefined' ||
    typeof destination.y == 'undefined' ||
    typeof origin.x == 'undefined' ||
    typeof origin.y == 'undefined'
  ) {
    return -1;
  }

  return Math.sqrt(
    Math.pow(destination.x - origin.x, 2) +
      Math.pow(destination.y - origin.y, 2)
  );
}

function angleToDirectionVector(angle) {
  let result = new Point();

  result.x = Math.cos(angle);
  result.y = Math.sin(angle);

  return result;
}

export { pointDistance, angleToDirectionVector, Point, Rotation };
