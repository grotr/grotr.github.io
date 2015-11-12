Player = {
    _sprite: null,
    _healthbar: null,
    _strength: 0,
    _level: 0,
    _dead: null,

    init: function(game) {
        this._level = 1;
        this._strength = 10;
        this._dead = false;

        this._sprite = game.add.sprite(32, game.world.height - 165, 'sky');
        game.physics.arcade.enable(this._sprite);

        this._sprite.health = 100;

        this._healthbar = game.add.sprite(10, 10, 'health');
        this._healthbar.cropEnabled = true;

        this._sprite.body.bounce.y = 0;
        this._sprite.body.gravity.y = 400;

        this._sprite.body.collideWorldBounds = true;

        this._sprite.body.width = 40;
        this._sprite.body.height = 128;

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

    getAction: function() {
        if (Enemy._killed == 5 && this._level == 1) {
            this._level = 2;
            this.updateAnimations();
            this._sprite.health += 25;
            powerup.play();
        }
        else if (Enemy._killed == 10 && this._level == 2) {
            this._level = 3;
            this.updateAnimations();
            this._sprite.health += 25;
            powerup.play();
        }
        else if (Enemy._killed == 15 && this._level == 3) {
            this._level = 4;
            this.updateAnimations();
            this._sprite.health += 25;
            powerup.play();
        }

        if (!this._sprite.animations.getAnimation('punch').isPlaying) {
            this._sprite.body.width = 40;
        }
    
        if (cursors.down.isDown && !this._sprite.animations.getAnimation('punch').isPlaying && this._sprite.body.touching.down) {
            this._sprite.animations.play('block');
        }
        else if (spacebar.isDown)
        {
            this._sprite.body.width = 70;
            if (game.physics.arcade.intersects(this._sprite.body, Enemy.getSprite().body) &&
                spacebar.downDuration(30)) {
                registerHit();
            }
            this._sprite.body.width = 70;
            this._sprite.animations.play('punch');          
    
        }    else if (cursors.right.isDown && !this._sprite.animations.getAnimation('punch').isPlaying) {
            this._sprite.body.velocity.x = 200;
    
            this._sprite.animations.play('walk');
        }
        else if (cursors.left.isDown && !this._sprite.animations.getAnimation('punch').isPlaying) {
            this._sprite.body.velocity.x = -200;
    
            this._sprite.animations.play('walk');
        }
        else
        {
            if (!this._sprite.animations.getAnimation('punch').isPlaying) {
                this._sprite.animations.play('idle');
            }
        }
    
        if (cursors.up.isDown && this._sprite.body.touching.down)
        {
            this._sprite.body.velocity.y = -150;
        }
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
        var health = 100;

        game.add.text(game.world.centerX, game.world.centerY, "GAME OVER", text_style).anchor.setTo(0.5, 0.5);;
    },

    isDead: function() {
        return this._dead;
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
