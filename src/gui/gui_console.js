import GuiElement from './gui_element';
import GuiText from './gui_text';
import { ORDENATION } from './gui';

export default class GuiConsole extends GuiElement {
  constructor() {
    super();

    this._texts = {}; // { id : [ 'text to show on scene', GuiText object, insertionTime ] }
    this._textKeys = []; // keys of this._texts
    this._textsToRemove = [];

    this.order = ORDENATION.DOWN;
  }

  initialize() {
    super.initialize();
  }

  activate() {
    super.activate();
  }

  draw(ctx) {
    // Call inherited function
    super.draw(ctx);
  }

  step(dt) {
    let len = this._textKeys.length;

    if (len === 0) {
      return;
    }

    let yPos = 0;
    let xPos = 0;
    let now = new Date().getTime();

    for (let i = 0; i < len; i++) {
      let textInfo = this._texts[this._textKeys[i]];
      let text = textInfo[1];
      let time = textInfo[2];

      // Delete old messages
      if (time + 2000 < now) {
        // just marked as "toRemove"
        this._textsToRemove.push(this._textKeys[i]);
        // this.detachItem(text);
      } else {
        text.setPosition(xPos, yPos);
        // text.draw(ctx);

        if (this.order == ORDENATION.DOWN) {
          yPos = yPos + 20;
        } else {
          yPos = yPos - 20;
        }
      }
    }

    // Call inherited function
    super.step(dt);

    len = this._textsToRemove.length;

    if (len > 0) {
      for (let i = 0; i < len; i++) {
        this.detachItem(this._textsToRemove[i]);
        delete this._texts[this._textsToRemove[i]];
      }

      this._textKeys = Object.keys(this._texts);
      this._textsToRemove = [];
    }
  }

  addText(key, text) {
    if (typeof this._texts[key] !== 'undefined') {
      if (this._texts[key][0] != text) {
        this._texts[key][0] = text;
        this._texts[key][1].setText(text); // Same GuiText object
      }
      this._texts[key][2] = new Date().getTime();
    } else {
      let txt = new GuiText(text, this.size.x, this.size.y);
      txt.setSize(this.size.x, this.size.y);
      // Save time of last text addition
      this._texts[key] = [text, txt, new Date().getTime()];
      this._textKeys = Object.keys(this._texts);

      this.attachItem(txt, key);
    }
  }
}
