export default class Localization {
  constructor() {
    this.fallbackLanguage = 'english';
    this.selectedLanguage = '';
    this.stringTables = {};

    this.baseTexts = {
      english: {
        paused: 'Paused, press P to continue',
        loaded: 'Loading',
        items: 'items',
        effects: 'effects',
        particles: 'particles',
        choose_language: 'Choose language',
        english: 'English',
        spanish: 'Spanish'
      },
      spanish: {
        paused: 'Pausa, pulsa P para continuar',
        loaded: 'Cargando',
        items: 'elementos',
        effects: 'efectos',
        particles: 'partículas',
        choose_language: 'Escoge el idioma',
        english: 'English',
        spanish: 'Español'
      }
    };
  }

  initialize() {
    // engine.logs.log('localization.initialize', 'Initializing localization handler');

    // initial lenguage
    this.selectedLanguage = 'english';

    for (let lang in this.baseTexts) {
      this.stringTables[lang] = [];
      this.addTextsToStringTable(lang, this.baseTexts[lang]);
    }

    // engine.controls.addKeyListener( this, 'eventKeyPressed', [Engine.INPUT.KEYS.L, ] ); // change language
  }

  // eventKeyPressed(keyCode)
  // {
  //   engine.logs.log('Localization::eventKeyPressed', 'Key Pressed: ' + keyCode);

  //   if (keyCode == KEYBOARD.L)
  //   {
  //     if (this.selectedLanguage == 'spanish')
  //       this.selectLanguage('english');
  //     else
  //       this.selectLanguage('spanish');
  //   }
  // }

  get(stringId) {
    let text = this.stringTables[this.selectedLanguage][stringId];

    if (typeof text !== 'undefined') {
      return text;
    } else {
      return this.stringTables[this.fallbackLanguage][stringId];
    }
  }

  addStringTable(language, table) {
    this.stringTables[language] = table;
  }

  setBaseTexts(table) {
    this.baseTexts = table;
  }

  addTextsToStringTable(language, table) {
    for (let prop in table) {
      this.stringTables[language][prop] = table[prop];
    }
  }

  selectLanguage(language) {
    this.selectedLanguage = language;
  }
}
