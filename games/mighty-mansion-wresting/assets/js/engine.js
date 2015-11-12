/**
 *  Major Mansion Wrestling
 *  Copyright (c) 2015 Blake Grotewold <hello@grotewold.me>
 *  License: Mozilla Public License, version 2.0
 */
var game = new Phaser.Game(540, 400, Phaser.AUTO, '', {preload: preload,
                                                       create: create,
                                                       update: update});

function preload() {

    this.load.audio('background_music', ['assets/audio/background.mp3',
                                        'assets/audio/background.ogg']);
    this.load.audio('powerup_sound', ['assets/audio/powerup.mp3',
                                      'assets/audio/powerup.ogg']);
    this.load.audio('punch_sound', ['assets/audio/punch.mp3',
                                    'assets/audio/punch.ogg']);
    this.load.audio('death_sound', ['assets/audio/death.mp3',
                                    'assets/audio/death.ogg']);
    game.load.image('background', 'assets/img/background.png');
    game.load.image('day_cycle', 'assets/img/day_cycle.png');
    game.load.image('floor', 'assets/img/floor.png');
    game.load.image('health', 'assets/img/health.png');
    game.load.spritesheet('sky', 'assets/img/player.png', 80, 128);
    game.load.spritesheet('enemy', 'assets/img/opponents.png', 80, 128);
}

var day;
var day_delta = .05;
var music;
var cursors;
var spacebar;
var platforms;

function create() {
    this.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
    this.scale.pageAlignHorizontally = true;
    this.scale.pageAlignVertically = true;
    this.scale.setScreenSize(true);

    this.game.physics.startSystem(Phaser.Physics.ARCADE);

    day = game.add.tileSprite(270, 400, 810, 800, 'day_cycle');

    day.anchor.setTo(0.5, 0.5);

    var bg = game.add.tileSprite(0, 0, 540, 400, 'background');
    bg.fixedToCamera = true;

    platforms = game.add.group();
    platforms.enableBody = true;

    var floor = platforms.create(0, game.world.height - 30, 'floor');
    floor.body.immovable = true;
    floor.body.width *= 2;
    var title_text = 'Major Mansion Wrestling';
    text_style = { font: "23px Audiowide", fill: "#FFFFFF", align: "center" }
    game.time.events.add(1000, function(){
        title = game.add.text(game.world.centerX, 5, title_text, text_style);
        title.anchor.setTo(0.5, 0);

        kills = game.add.text(game.world.centerX, 30, '', text_style);
        kills.anchor.setTo(0.5, 0);
    }, this);

    Enemy.init(game);
    Player.init(game);

    this.music = game.add.audio('background_music', .3, true);
    punch = game.add.audio('punch_sound', .3, false);
    powerup = game.add.audio('powerup_sound', .3, false);
    death = game.add.audio('death_sound', .3, false);

    this.music.play('', 0, .05, true);

    cursors = game.input.keyboard.createCursorKeys();
    spacebar = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
    day.angle = 60;
}

function registerHit(sprite1, sprite2) {
    if (game.physics.arcade.distanceBetween(Player.getSprite(),Enemy.getSprite()) > 70) {
        if (Player.getSprite().animations.getAnimation('punch').isPlaying && 
           Enemy.getSprite().animations.getAnimation('block').isPlaying) {
            Enemy.move('right', 200);
            Enemy.damage(Player.getStrength()/5);
        }
        else if (Player.getSprite().animations.getAnimation('punch').isPlaying && 
                Enemy.getSprite().animations.getAnimation('punch').isPlaying) {
            Enemy.move('right', 400);
            Player.move('left', 400);
            Enemy.damage(Player.getStrength()/2);
            Player.damage(Enemy.getStrength()/2);
        }
        else if (Player.getSprite().animations.getAnimation('block').isPlaying && 
                Enemy.getSprite().animations.getAnimation('punch').isPlaying) {
            Player.move('left', 200);
            Player.damage(Enemy.getStrength()/5);
        }
        else if (Player.getSprite().animations.getAnimation('punch').isPlaying) {
            Enemy.move('right', 300);
            if (Player.getSprite().body.touching.down) {
                Enemy.damage(Player.getStrength());
            }
            else {
                Enemy.damage(Player.getStrength()*2);
            }
        }
        else if (Enemy.getSprite().animations.getAnimation('punch').isPlaying) {
            Player.move('left', 300);
            if (Player.getSprite().body.touching.down) {
                Player.damage(Enemy.getStrength());
            }
            else {
                Player.damage(Enemy.getStrength()*2);
            }
        }
    }
}

function update() {

    day.angle += day_delta;

    game.physics.arcade.collide(Player.getSprite(), platforms);
    game.physics.arcade.collide(Enemy.getSprite(), platforms);

    Player.getHealthbar().width = (Player.getHealth() / 100.0) * 100;

    Enemy.getHealthbar().width = (Enemy.getHealth() / 100.0) * 100;

    Player.getSprite().body.velocity.x *= 0.7;
    Enemy.getSprite().body.velocity.x *= 0.7;

    Player.getAction();
    Enemy.getAction();
}
