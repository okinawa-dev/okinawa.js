const SOUNDINFO = {
  AUDIOOBJECT: 0,
  ORIGINALPATH: 1,
};

export default class Sounds {
  constructor() {
    // List of Audio() objects used in the game, indexed by id/name
    // sounds[name] = [object, original_path];
    this.sounds = {};
  }

  initialize() {
    // engine.logs.log('engine.sounds.initialize', 'Initializing sound Handler');
    this.sounds.length = 0;
  }

  step() {}

  // draw(ctx, object)
  // {
  // }

  soundExists(path) {
    let ids = Object.keys(this.sounds);

    for (let i = 0, len = ids.length; i < len; i++) {
      if (this.sounds[ids[i]][SOUNDINFO.ORIGINALPATH] == path) {
        return true;
      }
    }

    return false;
  }

  addSound(name, path, object) {
    this.sounds[name] = [object, path];
  }

  get(name) {
    if (typeof this.sounds[name] == 'undefined') {
      return null;
    }

    let sound = this.sounds[name][SOUNDINFO.AUDIOOBJECT];

    // if already playing, clone the Audio object and use the new copy
    if (sound.currentTime > 0) {
      sound = sound.cloneNode();
    }

    return sound;
  }

  // Play the sound now
  play(name) {
    let sound = this.get(name);

    if (sound !== null) {
      // Sound already playing
      if (sound.currentTime > 0) {
        sound.currentTime = 0;
      }
      sound.play();
    }
  }
}
