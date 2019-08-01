import engine from './engine';

export default class Player {
  constructor() {
    engine.logs.log('Player::initialize', 'Initializing player object');
    this.avatar = null;
  }

  getAvatar() {
    return this.avatar;
  }

  setAvatar(item) {
    this.avatar = item;
  }

  initialize() {}

  activate() {}

  step() {}

  draw() {
    // This object is not drawn, its avatar should be
    // added as an attached item inside any screen
    return;
  }
}
