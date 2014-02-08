
// // Check if some item has been removed (position is undefined)
// // and removes it from the array
// Array.prototype.filterUndefined = function()
// {
//     for(var i = 0; i < this.length; i++)
//     {
//       if (this[i] == undefined)
//       {
//         this.splice(i, 1);
//         i--;
//       }
//     }
// };

// function getGlobalOffset(element)
// {
//   var pos = new Engine.MATH.Point(0, 0);
//   pos.x = element.offsetLeft;
//   pos.y = element.offsetTop;

//   while (element = element.offsetParent)
//   {
//     pos.x += element.offsetLeft;
//     pos.y += element.offsetTop;    
//   }

//   return pos;
// }

// Global addEvent to fix old IE way of attaching events
function addEvent(evnt, elem, func) 
{
  if (elem.addEventListener)  
    // W3C DOM
    elem.addEventListener(evnt, func, false);
  else if (elem.attachEvent) 
    // IE DOM
    elem.attachEvent('on' + evnt, func);
    // If we want to expose the currentTarget (non-existent in older IE)
    // elem.attachEvent('on' + evnt, function(a) { a.currentTarget = elem; func(a); });
  else 
    // Not much to do
    elem['on' + evnt] = func;
}

// Polyfill for the Array.isArray function
Array.isArray || (Array.isArray = function ( a ) {
    return'' + a !== a && {}.toString.call( a ) == '[object Array]'
});

// Polyfill for the Object.create function
Object.create || (Object.create = function ( o ) {
    if (arguments.length > 1) {
        throw new Error('Object.create implementation only accepts the first parameter.');
    }
    function F() {}
    F.prototype = o;
    return new F();
});

// Polyfill for the JS Object.keys function.
// From https://developer.mozilla.org/en-US/docs/JavaScript/Reference/Global_Objects/Object/keys
if (!Object.keys) {
  Object.keys = (function () {
    'use strict';
    var hasOwnProperty = Object.prototype.hasOwnProperty,
        hasDontEnumBug = !({toString: null}).propertyIsEnumerable('toString'),
        dontEnums = [
          'toString',
          'toLocaleString',
          'valueOf',
          'hasOwnProperty',
          'isPrototypeOf',
          'propertyIsEnumerable',
          'constructor'
        ],
        dontEnumsLength = dontEnums.length;

    return function (obj) {
      if (typeof obj !== 'object' && (typeof obj !== 'function' || obj === null)) {
        throw new TypeError('Object.keys called on non-object');
      }

      var result = [], prop, i;

      for (prop in obj) {
        if (hasOwnProperty.call(obj, prop)) {
          result.push(prop);
        }
      }

      if (hasDontEnumBug) {
        for (i = 0; i < dontEnumsLength; i++) {
          if (hasOwnProperty.call(obj, dontEnums[i])) {
            result.push(dontEnums[i]);
          }
        }
      }
      return result;
    };
  }());
}


// Truncate for float numbers
// From http://stackoverflow.com/questions/4912788/truncate-not-round-off-decimal-numbers-in-javascript
// Number.prototype.toFixedDown = function(digits) {
//   var n = this - Math.pow(10, -digits)/2;
//   n += n / Math.pow(2, 53); 
//   return n.toFixed(digits);
// };
