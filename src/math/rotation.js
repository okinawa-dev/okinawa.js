// Rotation matrix =
//   | cos(r)  -sin(r) |
//   | sin(r)   cos(r) |

// Inner representation for fast access
//   | a b |
//   | c d |

import Point from './point';

export default class Rotation {
  constructor() {
    this.angle = 0;

    // Matrix for zero degrees rotation
    this.a = 1;
    this.b = 0;
    this.c = 0;
    this.d = 1;
  }

  getAngle() {
    return this.angle;
  }

  rotate(dRot) {
    this.update(this.angle + dRot);
  }

  update(newAngle) {
    this.angle = newAngle;

    this.a = Math.cos(this.angle);
    this.b = -Math.sin(this.angle);
    this.c = Math.sin(this.angle);
    this.d = Math.cos(this.angle);
  }

  transformPosition(point) {
    return new Point(
      point.x * this.a + point.y * this.b,
      point.x * this.c + point.y * this.d,
    );
  }
}
