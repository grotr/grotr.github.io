Enemy = {
    _sprite: null,
    _healthbar: null,
    _strength: 0,
    _level: 0,
    _aggressive: 0, // 1 is non, 2 is agressive, 3 is extreme
    _dead: null,
    _acting: null,
    _tween: null,
    _killed: 0,
    _blocking: false,

	init: function(game) {
        

        this._level = 1;
        this._strength = 5;
        this._dead = false;
        this._acting = false;
        this._aggressive = 1;

        this._sprite = game.add.sprite(game.world.width - 80, game.world.height - 165, 'enemy');
        this.setupSprite();
        this._tween = game.add.tween(this._sprite)
        this._sprite.health = 100;

        this.updateAnimations();
	},

    setupSprite: function(level, health, strength, aggressive) {
        game.physics.arcade.enable(this._sprite);

        if (level) {
            this._level = level;
        }
        if (health) {
            this._sprite.health = health;
        }
        if (strength) {
            this._strength = strength;
        }
        if (aggressive) {
            this._aggressive = aggressive;
        }

        this._sprite.scale.x *= -1;
        this._sprite.body.width = 40;
        this._sprite.body.offset.x = -40;
        this._sprite.body.gravity.y = 400;

        this._healthbar = game.add.sprite(game.world.width - 10, 10, 'health');
        this._healthbar.anchor.setTo(1, 0);
        this._healthbar.cropEnabled = true;

        this.updateAnimations();

        this._sprite.events.onKilled.add(function() {
            this.die();
        }, this);
    },

    updateAnimations: function() {
        o = ((this._level-1)*8); // frame offset
        this._sprite.animations.add('idle', [0+o], 1);
        this._sprite.animations.add('walk', [1+o, 3+o], 6);
        this._sprite.animations.add('block', [6+o], 1);
        this._sprite.animations.add('punch', [2+o, 3+o, 4+o, 5+o, 5+o, 5+o], 25);
        this._sprite.animations.add('victory', [7+o], 1);
        this._sprite.animations.add('death', [47 , 47, 47, 0+o, 0+o, 0+o, 47, 47, 0+o, 0+o, 47, 0+o, 47, 47, 47, 47, 47, 47, 47, 47], 15, false, true);
    
    },

    move: function(direction, speed) {
        if (direction === 'left') {
            this._sprite.body.velocity.x = -speed;
        }
        else if (direction === 'right') {
            this._sprite.body.velocity.x = speed;
        }
    },

    damage: function(amount) {
        if (this._sprite.health - amount > 0) {
            this._sprite.health -= amount;
            punch.play();
        }
        else {
            this._sprite.health = 0;
            this._sprite.kill();
        }
    },

    die: function() {
        death.play();
        this._killed += 1;
        kills.text = "kills: "+this._killed;
        var health = 100;

        roll = Math.random();
        if (roll < Player._level * .05) {
            this._level = 5;
            health = 200;
            this._aggressive = 3;
        }
        else if (roll < Player._level * .1) {
            this._level = 4;
            health = 125;
            this._aggressive = 3;
        }
        else if (roll < Player._level * .15) {
            this._level = 3;
            health = 125;
            this._aggressive = 2;
        }
        else if (roll < Player._level * .2) {
            this._level = 2;
            this._aggressive = 2;
        }
        else {
            this._aggressive = 1;
            this._level = 1;
        }

        this.updateAnimations();


        this._sprite.reset(game.world.width + 80, game.world.height - 165, health);

        this._tween = game.add.tween(this._sprite)
        this._tween.to({ x:500 }, 1000, Phaser.Easing.Linear.None, true)
        this._tween.start();
    },

    punch: function() {
        this._sprite.body.width = 70;
        if (game.physics.arcade.intersects(this._sprite.body, Enemy.getSprite().body)) {
            registerHit();
        }
        this._sprite.animations.play('punch');
    },

    block: function() {
        this._blocking = true;
        game.time.events.add(Phaser.Timer.SECOND/2, function() { this._blocking = false; }, this);
    },

    jump: function() {
        if (this._sprite.body.touching.down) {
            this._sprite.body.velocity.y = -150;
        }
    },

    step: function(dist) {
        loc = null;
        time = null;
        if (Player._sprite.body.x > this._sprite.body.x) {
            loc = Player._sprite.body.x + 150;
            time = Math.abs(this._sprite.body.x - loc) * 9;
        }
        else if (dist > 300 && this._aggressive == 3) {
            loc = this._sprite.body.x - 200;
            time = Math.abs(this._sprite.body.x - loc) * 9;
        }
        else if (dist > 300 && this._aggressive == 2) {
            loc = this._sprite.body.x - 130;
            time = Math.abs(this._sprite.body.x - loc) * 9;
        }
        else if (dist > 300 && this._aggressive == 1) {
            loc = this._sprite.body.x - 70;
            time = Math.abs(this._sprite.body.x - loc) * 9;
        }
        else if ((dist <= 300 && dist > 150) && this._aggressive == 1) {
            if (Math.floor(dist) % 2 == 0) {
                loc = this._sprite.body.x-28;
            }
            else { 
                loc = this._sprite.body.x+28;
            }
            time = Math.abs(this._sprite.body.x - loc) * 25;
        }
        else if ((dist <= 300 && dist > 150) && this._aggressive == 1) {
            if (Math.floor(dist) % 2 == 0) {
                loc = this._sprite.body.x-28;
            }
            else { 
                loc = this._sprite.body.x+28;
            }
            time = Math.abs(this._sprite.body.x - loc) * 25;
        }
        else if ((dist <= 300 && dist > 120) && this._aggressive == 2) {
            if (Math.floor(dist) % 2 == 0) {
                loc = this._sprite.body.x-28;
            }
            else { 
                loc = this._sprite.body.x+28;
            }
            time = Math.abs(this._sprite.body.x - loc) * 25;
        }
        else if ((dist <= 300 && dist > 100) && this._aggressive == 3) {
            if (Math.floor(dist) % 2 == 0) {
                loc = this._sprite.body.x-28;
            }
            else { 
                loc = this._sprite.body.x+28;
            }
            time = Math.abs(this._sprite.body.x - loc) * 25;
        }
        else if ((game.world.width - this._sprite.body.x < 40)) {
            loc = this._sprite.body.x+(game.world.width- this._sprite.body.x);
            time = Math.abs(this._sprite.body.x - loc) * 25;
        }

        if (loc != null) {
            this._tween = game.add.tween(this._sprite)
            this._tween.to({ x: loc }, time, Phaser.Easing.Linear.None, true)
            this._tween.start();
        }
    },
    

	getAction: function() {
        var roll = Math.random();
        var dist = game.physics.arcade.distanceBetween(Player.getSprite(),this._sprite);

        if (!this._sprite.animations.getAnimation('punch').isPlaying) {
            this._sprite.body.width = 40;
        }

        if (roll > .99 && (this._aggressive == 2 && (dist > 72 && dist < 130))) {
            this.jump()
        }
        else if (roll > .97 && (this._aggressive == 3 && (dist > 72 && dist < 130))) {
            this.jump()
        }

        if (this._blocking) {
            this._sprite.animations.play('block');
        } 
        else if (this._tween.isRunning) {
            this._sprite.animations.play('walk');
        }
        else {
        if ((roll > .99) && (this._aggressive == 1 && (dist > 72 && dist < 130))) {
            this.punch()
        }
        else if ((roll > .98) && (this._aggressive == 2 && (dist > 72 && dist < 160))) {
            this.punch()
        }
        else if ((roll > .97) && (this._aggressive == 3 && (dist > 72 && dist < 160))) {
            this.punch()
        }
        else if ((roll > .94 && roll <= .97) && (this._aggressive == 1 && (dist > 72 && dist < 200))) {
            this.block()
        }
        else if ((roll > .92 && roll <= .94) && (this._aggressive == 2 && (dist > 72 && dist < 160))) {
            this.block()
        }
        else if ((roll > .91 && roll <= .92) && (this._aggressive == 3 && (dist > 72 && dist < 130))) {
            this.block()
        }
        else if ((roll > .86 && roll <= .91) && (this._aggressive == 1)) {
            this.step(dist)
        }
        else if ((roll > .85 && roll <= .91) && (this._aggressive == 2)) {
            this.step(dist)
        }
        else if ((roll > .84 && roll <= .91) && (this._aggressive == 3)) {
            this.step(dist)
        }
        else
        {
            if (!this._sprite.animations.getAnimation('punch').isPlaying) {
                this._sprite.animations.play('idle');
            }
        }
    }
	},

    getSprite: function() {
        return this._sprite;
    },

    getHealthbar: function() {
        return this._healthbar;
    },

    getHealth: function() {
        return this._sprite.health;
    },

    getStrength: function() {
        return this._strength;
    },

    getLevel: function() {
        return this._level;
    }
};
