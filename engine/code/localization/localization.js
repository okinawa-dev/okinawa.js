
Engine.Localization = function()
{
  this.fallbackLanguage = "english";
  this.selectedLanguage = "";
  this.stringTables = {};

  this.baseTexts = {
    'english' : 
    {
      'paused'  : 'Paused, press P to continue',
      'loaded'  : 'Loading',
      'items'   : 'items',
      'effects' : 'effects',
      'particles' : 'particles',
      'choose_language' : 'Choose language',
      'english' : 'English',
      'spanish' : 'Spanish'
    },
    'spanish' : 
    {
      'paused'  : 'Pausa, pulsa P para continuar',
      'loaded'  : 'Cargando',
      'items'   : 'elementos',
      'effects' : 'efectos',
      'particles' : 'partículas',
      'choose_language' : 'Escoge el idioma',  
      'english' : 'English',
      'spanish' : 'Español'
    }
  };  
}

Engine.Localization.prototype.initialize = function() 
{ 
  // engine.logs.log('localization.initialize', 'Initializing localization handler');

  // initial lenguage
  this.selectedLanguage = "english"; 

  for (var lang in this.baseTexts) {
    this.stringTables[lang] = [];
    this.addTextsToStringTable(lang, this.baseTexts[lang]);
  }

  // engine.controls.addKeyListener( this, 'eventKeyPressed', [Engine.INPUT.KEYS.L, ] ); // change language
}

// Engine.Localization.prototype.eventKeyPressed = function(keyCode)
// {
//   engine.logs.log('Localization.eventKeyPressed', 'Key Pressed: ' + keyCode);

//   if (keyCode == KEYBOARD.L)
//   {
//     if (this.selectedLanguage == 'spanish')
//       this.selectLanguage('english');
//     else
//       this.selectLanguage('spanish');
//   }
// }

Engine.Localization.prototype.get = function(stringId)
{
  var text = this.stringTables[this.selectedLanguage][stringId];

  if ( text != undefined )
    return text;
  else 
    return this.stringTables[this.fallbackLanguage][stringId];
}

Engine.Localization.prototype.addStringTable = function(language, table) 
{
  this.stringTables[language] = table;
}

Engine.Localization.prototype.setBaseTexts = function(table) 
{
  this.baseTexts = table;
}

Engine.Localization.prototype.addTextsToStringTable = function(language, table)
{
  for (var prop in table)
    this.stringTables[language][prop] = table[prop];
}

Engine.Localization.prototype.selectLanguage = function(language) 
{
  this.selectedLanguage = language;
}
