
// Specific clock for every scene (one different instance in each scene)
// It's not aligned: it means the different subcriptions to the clock are executed in
// different times: two suscriptions to 500ms events would be called 500ms after each 
// subscription, not at the same time

Engine.UnalignedClock = function()
{
  this.clockEvents = {};
}

Engine.UnalignedClock.prototype.initialize = function() 
{
  this.clockEvents = {};
}

Engine.UnalignedClock.prototype.activate = function() 
{
  // The events could be suscribed since game initalization
  // so we do not remove them when the scene is activated
  // this.clockEvents = {};
}

Engine.UnalignedClock.prototype.suscribe = function(id, object, func, time)
{
  if (this.clockEvents[id] != undefined)
    engine.logs.log('UnalignedClock.suscribe', 'Object suscribing to clock event with repeated id ' + id);

  this.clockEvents[id] = { 
    ob : object,
    f : func,
    t : time,
    dt : 0
  };  
}

Engine.UnalignedClock.prototype.unsuscribe = function(id)
{
  delete this.clockEvents[id];
}

Engine.UnalignedClock.prototype.step = function(dt)
{
  var ids = Object.keys(this.clockEvents);

  for (var i = 0, len = ids.length; i < len; i++)
  {
    var item = this.clockEvents[ids[i]];

    item.dt += dt;

    if (item.dt >= item.t)
    {
      // engine.logs.log('UnalignedClock.step', 'Suscribed clock call: ' + ids[i]); // + ' ' + item.f);

      if (item.ob != undefined)
      {
        item.ob[item.f]();
      }
      else
      {
        // Call the suscribed function
        item.f();
      }

      item.dt = 0;
    }
  }
}


// ********************
// ********************
// ********************




Engine.Clock = function()
{
  this.startTime   = 0; // game init
  this.passedTime  = 0; // time passed
 

  this.ticker500    = 0;
  this.listeners500 = {};
  this.ticker1      = 0;
  this.listeners1   = {};
  this.ticker5      = 0;
  this.listeners5   = {};
}

Engine.Clock.prototype.initialize = function() {
  this.startTime = new Date().getTime(); // Init time
}

Engine.Clock.prototype.step = function(dt) {
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

Engine.Clock.prototype.draw = function(ctx) {

}

Engine.Clock.prototype.suscribe500 = function(name, func) {
  this.listeners500[name] = func;
}

Engine.Clock.prototype.suscribeOneSecond = function(name, func) {
  this.listeners1[name] = func;
}

Engine.Clock.prototype.suscribeFiveSeconds = function(name, func) {
  this.listeners5[name] = func;
}

Engine.Clock.prototype.informListeners = function(listenersList) {
  for(ob in listenersList) {
    listenersList[ob](); // call the function

    // // the callback exists
    // if (ob[listenersList[ob]] != undefined ) {
    //   // ob[listenersList[ob]](); // call the function
    //   listenersList[ob].apply();
    // }
  }
}
