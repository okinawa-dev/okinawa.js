import Item from '../item';

export default class Tracker extends Item {
  constructor(callback) {
    super();

    this.callback = callback;
  }

  initialize() {
    super.initialize();
  }

  activate() {
    super.activate();
  }

  step(dt) {
    // Item.step is where the attached items steps are called, so they go
    // after updating the tracker
    super.step(dt);
  }

  draw(ctx) {
    super.draw(ctx);
  }

  forceDetach() {
    if (this.getParent() !== null) {
      // Move all children from here to the parent
      for (let i = 0, len = this.getAttachedItems().length; i < len; i++) {
        let element = this.getAttachedItems()[i];

        element.position.x += this.position.x;
        element.position.y += this.position.y;

        // Exit speed, so the element does not stop
        // element.speed.x = direction.x * this.trackSpeed;
        // element.speed.y = direction.y * this.trackSpeed;

        this.detachItem(element);
        this.getParent().attachItem(element);
      }

      // Suicide!
      this.getParent().detachItem(this);
    }
  }
}
