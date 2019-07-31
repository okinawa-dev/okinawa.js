import Effect from './effect';

export default class Effects {
  constructor() {
    this.effects = [];
    this.removed = [];
  }

  initialize() {
    // engine.logs.log('Effects::initialize', 'Initializing effects Handler');

    this.effects.length = 0;
  }

  removeEffect(eff) {
    this.removed.push(eff);
  }

  // Reset the list of removed objects
  _resetRemoved() {
    this.removed.length = 0;
  }

  // Remove any objects marked for removal
  _finalizeRemoved() {
    for (let i = 0, len = this.removed.length; i < len; i++) {
      let idx = this.effects.indexOf(this.removed[i]);
      if (idx != -1) {
        this.effects.splice(idx, 1);
      }
    }
  }

  step(dt) {
    this._resetRemoved();

    for (let i = 0, len = this.effects.length; i < len; i++) {
      let eff = this.effects[i];

      eff.step(dt);

      // Effect lasts only the expected lifetime
      if (eff.lifeTime > 0 && eff.lived > eff.lifeTime) {
        this.removeEffect(eff);
      }

      // Effect lasts only one complete loop
      if (eff.maxLoops > 0 && eff.numLoops > eff.maxLoops) {
        this.removeEffect(eff);
      }
    }

    this._finalizeRemoved();
  }

  draw(ctx) {
    for (let i = 0, len = this.effects.length; i < len; i++) {
      this.effects[i].draw(ctx);
    }
  }

  // The coordinates passed are the ones from the center
  addEffect(type, x, y, vx, vy) {
    // var effectH = engine.sprites.sprites[type][3];
    // var effectW = engine.sprites.sprites[type][4];

    let eff = new Effect(type, x, y, vx, vy);
    this.effects.push(eff);

    // Returns the effect to add further changes
    return eff;
  }
}
