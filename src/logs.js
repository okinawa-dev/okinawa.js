import engine from './engine';

export default class Logs {
  constructor() {}

  log(fileName, message, object) {
    let result = [];

    if (engine.options.debugInConsole === false) {
      return;
    }

    if (engine.options.debugFunctionNames === true) {
      result.push(fileName);
    }

    if (Array.isArray(message)) {
      result.push(message.join(' '));
    } else {
      result.push(message);
    }

    if (object) {
      result.push(object);
    }

    if (
      engine.options.debugInHtml === true &&
      engine.core.canvas !== undefined
    ) {
      let e = document.createElement('div');
      e.innerHTML = result;
      engine.core.canvas.parentNode.appendChild(e);
    }
    // Old IE, console is not initialized by default
    else if (
      typeof window.console === 'undefined' ||
      typeof window.console.log === 'undefined'
    ) {
      // Do nothing?
    } else {
      window.console.log(result);
    }
  }
}
