import engine from './engine';

// Specific clock for every scene (one different instance in each scene)
// It's not aligned: it means the different subcriptions to the clock are executed in
// different times: two suscriptions to 500ms events would be called 500ms after each
// subscription, not at the same time

export class UnalignedClock {
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
        'Object suscribing to clock event with repeated id ' + id
      );
    }

    this.clockEvents[id] = {
      ob: object,
      f: func,
      t: time,
      dt: 0
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

// ********************
// ********************
// ********************

export class Clock {
  constructor() {
    this.startTime = 0; // game init
    this.passedTime = 0; // time passed

    this.ticker500 = 0;
    this.listeners500 = {};
    this.ticker1 = 0;
    this.listeners1 = {};
    this.ticker5 = 0;
    this.listeners5 = {};
  }

  initialize() {
    this.startTime = new Date().getTime(); // Init time
  }

  step(dt) {
    this.ticker1 += dt;
    this.ticker5 += dt;
    this.ticker500 += dt;

    if (this.ticker1 >= 1000) {
      this.informListeners(this.listeners1);
      this.ticker1 = 0;
    }

    if (this.ticker5 >= 5000) {
      this.informListeners(this.listeners5);
      this.ticker5 = 0;
    }

    if (this.ticker500 >= 500) {
      this.informListeners(this.listeners500);
      this.ticker500 = 0;
    }
  }

  draw() {}

  suscribe500(name, func) {
    this.listeners500[name] = func;
  }

  suscribeOneSecond(name, func) {
    this.listeners1[name] = func;
  }

  suscribeFiveSeconds(name, func) {
    this.listeners5[name] = func;
  }

  informListeners(listenersList) {
    for (let ob in listenersList) {
      listenersList[ob](); // call the function

      // // the callback exists
      // if (ob[listenersList[ob]] != undefined ) {
      //   // ob[listenersList[ob]](); // call the function
      //   listenersList[ob].apply();
      // }
    }
  }
}
