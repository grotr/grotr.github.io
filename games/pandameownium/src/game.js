var Meow = Meow || {};

Meow.Game = function() {
};

Meow.Game.prototype = {
  preload: function() {
    this.game.time.advancedTiming = true;
  },

  create: function() {
    this.map = this.game.add.tilemap('level1');
    this.map.addTilesetImage('map_tilesheet', 'gameTiles');
    this.map.addTilesetImage('finish_tilesheet', 'finish');
    var objects = this.map.objects['objectsLayer'];
    this.backgroundlayer = this.map.createLayer('backgroundLayer');
    this.blockedLayer = this.map.createLayer('blockedLayer');

    this.map.setCollisionBetween(1, 100000, true, 'blockedLayer');

    this.backgroundlayer.resizeWorld();

    this.hairballs = this.game.add.group();
    this.hairballs.enableBody = true;

    this.player = this.game.add.sprite(100, 300, 'player');

    this.game.physics.arcade.enable(this.player);

    this.player.anchor.setTo(0.5, 0.5);
    this.player.body.setSize(20, 20, 0, 0);
    this.player.animations.add('idle', [0,1,0,2], 2);
    this.player.animations.add('shoot', [3], 2);
    this.player.body.mass = 5;
    this.player.velocity = 300;
    this.player.walking = {x: false, y: false};
    this.player.body.collideWorldBounds = true;

    Meow.player = this.player;

    this.towers = this.game.add.group();
    this.towers.enableBody = true;

    Meow.towers = this.towers

    Meow.lasers = this.game.add.group();
    Meow.lasers.enableBody = true;

    for (var i = objects.length - 1; i >= 0; i--) {
      this.towers.add(new Tower(this.game, 'tower', objects[i].x, objects[i].y-60))
    };

    for (var i = 0; i < 1000; i++)
    {
      this.hairballs.add(new Hairball(this.game, 'hairball'), true);
    }

    for (var i = 0; i < 50; i++)
    {
      Meow.lasers.add(new Laser(this.game, 'laser'), true);
    }

    this.game.camera.follow(this.player);

    this.cursors = this.game.input.keyboard.createCursorKeys();
    this.wasd = {
      up: this.game.input.keyboard.addKey(Phaser.Keyboard.W),
      down: this.game.input.keyboard.addKey(Phaser.Keyboard.S),
      left: this.game.input.keyboard.addKey(Phaser.Keyboard.A),
      right: this.game.input.keyboard.addKey(Phaser.Keyboard.D),
    };

    this.music = this.game.add.audio('background', 1, true);
    this.cough = this.game.add.audio('cough', 1, false);
    this.exposion = this.game.add.audio('exposion', 1, false);
    this.encourage = this.game.add.audio('encourage', 1, false);
    this.death = this.game.add.audio('death', 1, false);
    this.music.play();
    this.encourage.play();

    this.instructions = this.add.text( 400, 500,
      'Use Arrow Keys or WASD to Move, Aim with mouse.\n' +
      'Click to fire.',
      { font: '20px monospace', fill: '#fff', align: 'center' }
    );
    this.warning = this.add.text( this.game.world.width-500, this.game.world.height-500,
      'REMEMBER: You must kill all towers before completing.',
      { font: '20px monospace', fill: '#fff', align: 'center' }
    );
    this.instructions.anchor.setTo(0.5, 0.5);
    this.warning.anchor.setTo(0.5, 0.5);

    this.game.input.onDown.add(this.playerShoot, this);
    this.startTime = this.game.time.time;
    this.finished = false;
  },

  update: function() {

        this.playerMovement();
    if ((this.player.x >= this.game.world.width-120) && !this.checkForTower() && !this.finised) {
      this.finishLine()
    }

    this.game.physics.arcade.collide(this.player, this.blockedLayer, function() {}, null, this);
    this.game.physics.arcade.collide(this.blockedLayer, Meow.lasers, function(laser, layer) {laser.exists = false;laser.dead = true}, null, this);
    this.game.physics.arcade.collide(this.hairballs, this.blockedLayer, this.ballHit, null, this);
    this.game.physics.arcade.collide(this.hairballs, this.towers, this.towerHit, null, this);
    this.game.physics.arcade.overlap(this.player, this.blockedLayer, this.finishLine, null, this);

    for (var i = Meow.lasers.children.length - 1; i >= 0; i--) {
      this.game.physics.arcade.collide(this.player, Meow.lasers.children[i], this.playerHit, null, this);
    };
    for (var i = Meow.towers.children.length - 1; i >= 0; i--) {
      this.game.physics.arcade.collide(this.player, Meow.towers.children[i], this.playerHit, null, this);
    };
  },

  render: function() {
    this.game.debug.text(this.game.time.fps || '--', 20, 40, "#00ff00", "40px monospace");
  },

  playerHit: function(player, groupItem) {
    this.death.play();
    var emitter = this.game.add.emitter(player.x, player.y, 100);
    emitter.makeParticles('player-part');
    emitter.minParticleSpeed.setTo(-200, -200);
    emitter.maxParticleSpeed.setTo(200, 200);
    emitter.gravity = 0;
    emitter.start(true, 1000, null, 100);
    player.exists = false;
    this.game.time.events.add(1000, function() { this.music.stop();this.state.start('Boot')}, this);
  },

  towerHit: function(hairball, tower) {
    if (hairball.flying) {
      this.exposion.play();
      var emitter = this.game.add.emitter(tower.x, tower.y, 100);
      emitter.makeParticles('tower-part');
      emitter.minParticleSpeed.setTo(-200, -200);
      emitter.maxParticleSpeed.setTo(200, 200);
      emitter.gravity = 0;
      emitter.start(true, 1000, null, 100);
      tower.destroy();

    }
    hairball.flying = false;
  },

  ballHit: function(hairball, blockedLayer) {
    hairball.body.velocity.y *= 0.5
    hairball.body.velocity.x *= 0.5
    hairball.flying = false;
  },

  playerMovement: function() {
    this.player.rotation = this.game.physics.arcade.angleToPointer(this.player);

    if (!this.player.animations.getAnimation('shoot').isPlaying) {
      this.player.animations.play('idle');
    }

    if(this.cursors.up.isDown || this.wasd.up.isDown) {
      this.player.walking.y = true;
      this.player.body.velocity.y = -this.player.velocity;
    }
    else if(this.cursors.down.isDown || this.wasd.down.isDown) {
      this.player.walking.y = true;
      this.player.body.velocity.y = this.player.velocity;
    }
    else {
      this.player.body.velocity.y *= .9;
      this.player.walking.y = false;
    }

    if(this.cursors.right.isDown || this.wasd.right.isDown) {
      this.player.walking.x = true;
      this.player.body.velocity.x = this.player.velocity;
    }
    else if(this.cursors.left.isDown || this.wasd.left.isDown) {
      this.player.walking.x = true;
      this.player.body.velocity.x = -this.player.velocity;
    }
    else {
      this.player.body.velocity.x *= .9;
      this.player.walking.x = false;
    }
  },

  playerShoot: function() {
    if (this.game.time.time < this.nextPlayerShot) { return; }

    this.cough.restart();
    this.player.animations.play('shoot');

    hairball = this.hairballs.getFirstExists(false);
    hairball.reset((this.player.x), (this.player.y));
    hairball.flying = true;
    this.game.physics.arcade.moveToPointer(hairball, 400);

    this.nextPlayerShot = this.game.time.time + 100;
  },

  checkForTower: function(){
    return this.towers.children.length > 0;
  },

  finishLine: function() {
      if (!this.finished) {
        Meow.score = this.game.time.time - this.startTime;
        this.scoreText = this.add.text( this.game.world.width-500, this.game.world.height-100,
        'You finished in '+Meow.score/1000.0+' seconds!',
        { font: '35px monospace', fill: '#00ff00', align: 'center' }
        );
        this.scoreText.anchor.setTo(0.5, 0.5);
      }
      this.finished = true;
  },

  gameOver: function () {
  }
};
