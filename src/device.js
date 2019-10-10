// Object to store screen, graphical, and browser auxiliar
// functions that have no other place to be ;)

import engine from './engine';
import * as MATH from './math/math';
import { addEvent } from './utils';

export default class Device {
  constructor() {
    this.canvasGlobalOffset = new MATH.Point();
    this.isTouchDevice = false;

    this.isResizing = false;
    this._clearTimeOutId = null;
  }

  initialize() {
    this.isTouchDevice = this.detectTouchDevice();

    if (this.isTouchDevice) {
      engine.logs.log('Engine::Initialize', 'Touch device detected');
    } else {
      engine.logs.log('Engine::Initialize', 'Touch device NOT detected');
    }

    // Get the offset of the DOM element used to capture the touch events
    this.canvasGlobalOffset = engine.device.getGlobalOffset(
      engine.core.canvas
    );

    addEvent('resize', window, () => {
      engine.device.isResizing = true;

      if (engine.options.showResizeMessage === true) {
        engine.gui.get('console').addText('resize', 'Resizing!');
        // engine.logs.log('Engine::INPUT.Controller.onResize', 'Window resized');
      }

      // Recalculate if window is resized
      engine.device.canvasGlobalOffset = engine.device.getGlobalOffset(
        engine.core.canvas
      );

      clearTimeout(this._clearTimeOutId);
      this._clearTimeOutId = setTimeout(engine.device.doneResizing, 1000);
    });

    if (engine.options.avoidLeavingPage === true) {
      this.avoidLeavingPage();
    }
  }

  doneResizing() {
    engine.device.isResizing = false;

    if (engine.options.showResizeMessage === true) {
      engine.gui.get('console').addText('resize', 'Resizing done');
    }
  }

  activate() {}

  getGlobalScroll() {
    let pos = new MATH.Point(0, 0);

    // All browsers except IE < 9
    if (window.pageYOffset) {
      pos.x = window.pageXOffset;
      pos.y = window.pageYOffset;
    } else {
      // Try to fall back if IE < 9, don't know for sure if this is gonna
      // work fine
      let element = document.getElementsByTagName('html')[0];

      if (element.scrollTop) {
        pos.x = element.scrollLeft;
        pos.y = element.scrollTop;
      }
    }

    return pos;
  }

  // Distance in pixels of a DOM element from the origin of the navigator
  getGlobalOffset(element) {
    let pos = new MATH.Point(0, 0);
    pos.x = element.offsetLeft;
    pos.y = element.offsetTop;

    while ((element = element.offsetParent)) {
      pos.x += element.offsetLeft;
      pos.y += element.offsetTop;
    }

    return pos;
  }

  detectTouchDevice() {
    // eslint undefined error with DocumentTouch
    /* global DocumentTouch */
    if (
      'ontouchstart' in window ||
      (window.DocumentTouch && document instanceof DocumentTouch)
    ) {
      return true;
    }
    return false;
  }

  getUserAgent() {
    return navigator.userAgent;
  }

  avoidLeavingPage() {
    window.onbeforeunload = function() {
      return '';
    };
  }

  // Tricks got from stackoverflow
  // http://stackoverflow.com/questions/3665115/create-a-file-in-memory-for-user-to-download-not-through-server
  createAndDownloadFile(filename, text) {
    // IE
    if (window.navigator.msSaveOrOpenBlob) {
      let blob = new Blob([text], {
        type: 'text/csv;charset=utf-8;'
      });

      window.navigator.msSaveOrOpenBlob(blob, filename);
    }
    // Other browsers
    else {
      let link = document.createElement('a');

      link.setAttribute(
        'href',
        'data:text/plain;charset=utf-8,' + encodeURIComponent(text)
      );
      link.setAttribute('download', filename);

      // In Firefox the element has to be placed inside the DOM
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  }

  // Duplicated in utils.js, as a global function, just for really, really old IEs
  detectIE() {
    let userAgent = navigator.userAgent.toLowerCase();

    if (/msie/.test(userAgent)) {
      return parseFloat(
        (userAgent.match(/.*(?:rv|ie)[/: ](.+?)([ );]|$)/) || [])[1]
      );
    }

    if (navigator.appVersion.indexOf('Trident/') > 0) {
      return 11;
    }

    return -1;
  }

  isIE() {
    // First detect IE 6-10, second detect IE 11
    if (
      navigator.userAgent.indexOf('MSIE') !== -1 ||
      navigator.appVersion.indexOf('Trident/') > 0
    ) {
      return true;
    }

    return false;
  }
}
