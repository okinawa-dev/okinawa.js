export default class Clock {
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

  activate() {}

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
