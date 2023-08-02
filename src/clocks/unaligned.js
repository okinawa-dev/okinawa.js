import engine from '../engine';

// Specific clock for every scene (one different instance in each scene)
// It's not aligned: it means the different subcriptions to the clock are executed in
// different times: two suscriptions to 500ms events would be called 500ms after each
// subscription, not at the same time

export default class UnalignedClock {
  constructor() {
    this.clockEvents = {};
  }

  initialize() {
    this.clockEvents = {};
  }

  activate() {
    // The events could be suscribed since game initalization
    // so we do not remove them when the scene is activated
    // this.clockEvents = {};
  }

  suscribe(id, object, func, time) {
    if (typeof this.clockEvents[id] !== 'undefined') {
      engine.logs.log(
        'UnalignedClock::suscribe',
        'Object suscribing to clock event with repeated id ' + id,
      );
    }

    this.clockEvents[id] = {
      ob: object,
      f: func,
      t: time,
      dt: 0,
    };
  }

  unsuscribe(id) {
    delete this.clockEvents[id];
  }

  step(dt) {
    let ids = Object.keys(this.clockEvents);

    for (let i = 0, len = ids.length; i < len; i++) {
      let item = this.clockEvents[ids[i]];

      item.dt += dt;

      if (item.dt >= item.t) {
        // engine.logs.log('UnalignedClock::step', 'Suscribed clock call: ' + ids[i]); // + ' ' + item.f);

        if (typeof item.ob !== 'undefined') {
          item.ob[item.f]();
        } else {
          // Call the suscribed function
          item.f();
        }

        item.dt = 0;
      }
    }
  }
}
