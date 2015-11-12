'use strict';

/* jscs:disable */
/* jshint ignore:start */
  // <% STATE_REQUIRE_TOKEN %>
  // Leave the above token in place to enable automatic
  // injection of new states by the generator.
  ;

var game
  , width      = 200
  , height     = 160
  , renderMode = Phaser.AUTO;

game = new Phaser.Game(width, height, renderMode, '');
game.state.add('boot',    Boot);
game.state.add('preload', Preload);
game.state.add('title',   Title);
// <% STATE_ADD_TOKEN %>
// Leave the above token in place to enable automatic
// injection of new states by the generator.

game.state.start('boot');
/* jshint ignore:end */
/* jscs:enable */
