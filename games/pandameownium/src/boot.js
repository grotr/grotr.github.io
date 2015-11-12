var Meow = Meow || {};

Meow.Boot = function(){};

Meow.Boot.prototype = {

  preload: function() {
    this.load.image('loading', 'assets/img/loading.png');
  },

  create: function() {
    this.game.stage.backgroundColor = '#121212';

    this.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
    this.scale.pageAlignHorizontally = true;
    this.scale.pageAlignVertically = true;
    this.scale.setScreenSize(true);

    this.game.physics.startSystem(Phaser.Physics.ARCADE);

    this.state.start('Preload');
  }
};