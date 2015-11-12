var Hairball = function (game, key) {
  Phaser.Sprite.call(this, game, 0, 0, key);
  this.texture.baseTexture.scaleMode = PIXI.scaleModes.NEAREST;
  this.anchor.set(0.5);
  this.checkWorldBounds = true;
  this.outOfBoundsKill = true;
  this.exists = false;
  this.flying = false;
};

Hairball.prototype = Object.create(Phaser.Sprite.prototype);
Hairball.prototype.constructor = Hairball;
