var Meow = Meow || {};

Meow.Preload = function(){};

Meow.Preload.prototype = {

  preload: function() {
    this.preloadBar = this.add.sprite(this.game.world.centerX, this.game.world.centerY, 'loading');

    this.preloadBar.anchor.setTo(0.5);

    this.preloadBar.scale.setTo(4,3);

    this.load.setPreloadSprite(this.preloadBar);

    this.load.tilemap('level1', 'assets/tilemaps/level1.json', null, Phaser.Tilemap.TILED_JSON);

    this.load.image('gameTiles', 'assets/img/background.png');
    this.load.image('finish', 'assets/img/finish.png');

    this.game.load.spritesheet('player', 'assets/img/bill+ollie.png', 64, 64);
    this.game.load.image('hairball', 'assets/img/hairball.png');

    this.game.load.spritesheet('tower', 'assets/img/tower.png', 56, 56);
    this.game.load.image('laser', 'assets/img/shot.png');

    this.game.load.image('player-part', 'assets/img/player-part.png');
    this.game.load.image('fart-part', 'assets/img/fart-part.png');
    this.game.load.image('tower-part', 'assets/img/tower-part.png');

    this.load.audio('background', 'assets/audio/background.mp3');
    this.load.audio('exposion', 'assets/audio/enemy_death.wav');
    this.load.audio('laser', 'assets/audio/enemy_gun.wav');
    this.load.audio('death', 'assets/audio/death.wav');
    this.load.audio('cough', 'assets/audio/cough.mp3');
    this.load.audio('encourage', 'assets/audio/encouragement.mp3');
  },

  create: function() {
    this.state.start('Game');
  }

};