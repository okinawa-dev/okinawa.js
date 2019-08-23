export default class Point {
  constructor(a, b) {
    if ('undefined' === typeof a) {
      this.x = 0;
    } else {
      this.x = a;
    }

    if ('undefined' === typeof b) {
      this.y = 0;
    } else {
      this.y = b;
    }
  }

  magnitude() {
    return Math.sqrt(this.x * this.x + this.y * this.y);
  }

  normalize() {
    let magnitude = this.magnitude();
    return new Point(this.x / magnitude, this.y / magnitude);
  }

  equals(p) {
    if (p instanceof Point === false) {
      return false;
    }

    return this.x == p.x && this.y == p.y;
  }
}
