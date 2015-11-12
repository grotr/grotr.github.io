var Tower = function (game, key, x, y) {
  this.game = game;
  Phaser.Sprite.call(this, game, x+30, y+30, key);
  this.texture.baseTexture.scaleMode = PIXI.scaleModes.NEAREST;
  this.anchor.set(0.5);
  this.scale.setTo(1.5);

  game.physics.arcade.enable(this);

  this.body.moves = false;
  this.preparingShot = false;
  this.nextTowerLock = this.game.time.time+6000;
  this.nextTowerShoot = 0;
  this.dead = false;
};

Tower.prototype = Object.create(Phaser.Sprite.prototype);
Tower.prototype.constructor = Tower;

Tower.prototype.update = function() {
	if (this.game.time.time >= this.nextTowerLock) {

		this.playerx = Meow.player.x;
		this.playery = Meow.player.y;
		this.nextTowerLock = this.game.time.time+6000;
		this.nextTowerShoot = this.game.time.time+1000;
		this.preparingShot = true;
	}
	else if (this.preparingShot) {
		if (this.game.time.time > this.nextTowerShoot) {
			this.fire();
		}
	}
	else{
		this.rotation = (this.game.physics.arcade.angleBetween(this, Meow.player));
	}
};

Tower.prototype.fire = function() {
	laser = Meow.lasers.getFirstExists(false);
	if (laser && !this.dead) {
		laser.reset(this.x, this.y);
		this.game.physics.arcade.moveToXY(laser, this.playerx, this.playery, 800);
		this.preparingShot = false;
	}

};