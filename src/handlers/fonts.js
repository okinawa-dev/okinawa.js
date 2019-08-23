const FONTINFO = {
  FONTOBJECT: 0,
  ORIGINALPATH: 1
};

export default class Fonts {
  constructor() {
    // List of Font() objects used in the game, indexed by id/name
    // fonts[name] = [object, original_path];
    this.fonts = {};
  }

  initialize() {
    // engine.logs.log('engine.fonts.initialize', 'Initializing font Handler');
    this.fonts.length = 0;
  }

  step() {}

  // draw(ctx, object)
  // {
  // }

  fontExists(path) {
    let ids = Object.keys(this.fonts);

    for (let i = 0, len = ids.length; i < len; i++) {
      if (this.fonts[ids[i]][FONTINFO.ORIGINALPATH] == path) {
        return true;
      }
    }

    return false;
  }

  addFont(name, path, object) {
    this.fonts[name] = [object, path];
  }

  get(name) {
    if (typeof this.fonts[name] == 'undefined') {
      return null;
    }

    return this.fonts[name][FONTINFO.FONTOBJECT];
  }
}
