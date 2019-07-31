export class Logs {
  constructor(engine) {
    // references to the external objects
    this._engine = engine;
  }

  log(fileName, message, object) {
    let result = [];

    if (this._engine.options.debugInConsole === false) {
      return;
    }

    if (this._engine.options.debugFunctionNames === true) {
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
      this._engine.options.debugInHtml === true &&
      this._engine.core.canvas !== undefined
    ) {
      let e = document.createElement('div');
      e.innerHTML = result;
      this._engine.core.canvas.parentNode.appendChild(e);
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
