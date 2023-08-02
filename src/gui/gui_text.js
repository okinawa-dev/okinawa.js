import GuiElement from './gui_element';
import { ALIGN } from './gui';
import * as MATH from '../math/math';

export default class GuiText extends GuiElement {
  constructor(txt, x, y) {
    // TODO: parameters?
    super();

    this.text = txt;
    this.font = 'base,BaseFont,"Courier New"';
    this.fontSize = 20;
    this.fontColor = '#FFFFFF'; // white
    this.fontBorderColor = '#000000'; // black
    this.textAlign = ALIGN.LEFT;

    // to avoid magic numbers which really does not fit with
    // different fonts
    this.verticalOffset = 20;
    this.horizontalOffset = 10;

    if (typeof x === 'undefined' || typeof y === 'undefined') {
      this.size.x = 100;
      this.size.y = 30;
    } else {
      this.size.x = x;
      this.size.y = y;
    }

    // New GuiText version with its own canvas
    this._canvasRendering = true;
    this._innerCanvas = document.createElement('canvas');
    this._innerCanvas.width = this.size.x;
    this._innerCanvas.height = this.size.y;
    this._innerContext = this._innerCanvas.getContext('2d');
    // Should re-render the canvas?
    this._innerChange = true;
  }

  initialize() {
    super.initialize();
  }

  activate() {
    super.activate();
  }

  // Mask Item.getSize
  // getSize()
  // {
  //   var size = super.getSize(this);

  //   // Be sure the size is never zero, or we will have an exception
  //   // when trying to render the innerCanvas
  //   if ((size.x == 0) || (size.y == 0))
  //     return new MATH.Point(100, 30);
  //   else
  //     return size;
  // }

  setSize(x, y) {
    super.setSize(x, y);
    this._innerCanvas.width = this.size.x;
    this._innerCanvas.height = this.size.y;
    this._innerChange = true;
  }

  // Mask Item.getPosition
  // getPosition()
  // {
  //   if (this.getParent() != undefined)
  //   {
  //     return this.getParent().getPosition();
  //   }

  //   return new MATH.Point(0, 0);
  // }

  setText(txt) {
    if (this.text == txt) {
      return;
    }

    this.text = txt;
    this._innerChange = true;
  }

  getText() {
    return this.text;
  }

  // receives global context just to compare values if necessary
  _updateInnerRender(ctx) {
    // let pos = this.getPosition();
    // let size = this.getSize();
    // let scale = this.getScaling();

    let where = new MATH.Point(this.horizontalOffset, this.verticalOffset);

    if (this.textAlign == ALIGN.CENTER) {
      where.x = this.size.x / 2;
    } else if (this.textAlign == ALIGN.RIGHT) {
      where.x = this.size.x - this.horizontalOffset;
    }

    // use global context values
    this._innerContext.lineWidth = ctx.lineWidth;

    this._innerContext.clearRect(0, 0, this.size.x, this.size.y);
    this._innerContext.strokeStyle = this.fontBorderColor;
    this._innerContext.fillStyle = this.fontColor;
    this._innerContext.textAlign = this.textAlign;
    this._innerContext.font = 'bold ' + this.fontSize + 'px ' + this.font;

    // print the full string
    // this._innerContext.strokeText(this.getText(), where.x, where.y);
    // this._innerContext.fillText(this.getText(), where.x, where.y);

    let pieces = this.getText().split('\n');

    for (let i = 0, len = pieces.length; i < len; i++) {
      this._innerContext.strokeText(pieces[i], where.x, where.y);
      this._innerContext.fillText(pieces[i], where.x, where.y);

      where.y += this.verticalOffset; // + this.fontSize;
    }

    this._innerChange = false;
  }

  draw(ctx) {
    if (this.getVisible() === true) {
      let pos = this.getPosition();
      let size = this.getSize();

      if (this._canvasRendering === false) {
        // let scale = this.getScaling();
        let offset = new MATH.Point(
          this.horizontalOffset,
          this.verticalOffset,
        );

        if (this.textAlign == ALIGN.CENTER) {
          offset.x = this.size.x / 2;
        } else if (this.textAlign == ALIGN.RIGHT) {
          offset.x = this.size.x - this.horizontalOffset;
        }

        ctx.strokeStyle = this.fontBorderColor;
        ctx.fillStyle = this.fontColor;
        ctx.textAlign = this.textAlign;
        ctx.font = 'bold ' + this.fontSize + 'px ' + this.font;

        // print the full string
        // ctx.strokeText( this.getText(),
        //                 pos.x - (size.x / 2) + offset.x,
        //                 pos.y - (size.y / 2) + offset.y);

        // ctx.fillText( this.getText(),
        //               pos.x - (size.x / 2) + offset.x,
        //               pos.y - (size.y / 2) + offset.y);

        let pieces = this.getText().split('\n');

        for (let i = 0, len = pieces.length; i < len; i++) {
          ctx.strokeText(
            pieces[i],
            pos.x - size.x / 2 + offset.x,
            pos.y - size.y / 2 + offset.y,
          );

          ctx.fillText(
            pieces[i],
            pos.x - size.x / 2 + offset.x,
            pos.y - size.y / 2 + offset.y,
          );

          offset.y += this.verticalOffset; // + this.fontSize;
        }
      } else {
        if (this._innerChange === true) {
          this._updateInnerRender(ctx);
        }

        ctx.drawImage(
          this._innerCanvas,
          pos.x - this.size.x / 2,
          pos.y - this.size.y / 2,
        );
      }
    }

    // Call inherited function
    super.draw(ctx);
  }

  step(dt) {
    // Call inherited function
    super.step(dt);
  }

  setFont(font) {
    this.font = font;
  }
  setFontSize(size) {
    this.fontSize = size;
  }
  setFontColor(color) {
    this.fontColor = color;
  }
  setFontBorderColor(color) {
    this.fontBorderColor = color;
  }
  setAlign(align) {
    this.textAlign = align;
  }
  setCanvasRendering(value) {
    this._canvasRendering = value;
  }
  setVerticalOffset(offset) {
    this.verticalOffset = offset;
  }
  setHorizontalOffset(offset) {
    this.horizontalOffset = offset;
  }
}
