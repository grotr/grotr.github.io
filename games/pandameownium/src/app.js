var Meow = Meow || {};
 
Meow.game = new Phaser.Game(900, 600, Phaser.AUTO, '');

Meow.game.state.add('Boot', Meow.Boot);
Meow.game.state.add('Preload', Meow.Preload);
Meow.game.state.add('Game', Meow.Game);
 
Meow.game.state.start('Boot');
