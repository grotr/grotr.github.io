'use strict';

function Preload() {
    this.preloadSprite = null;
    this.ready = false;

    this.assetsUri = {
        images: 'assets/images/',
        sounds: 'assets/sounds/'
    };
}

Preload.prototype = {

    preload: function () {
        this.preloadSprite = this.add.sprite(
            this.game.width  / 2,
            this.game.height / 2,
            'preloadSprite'
        );
        this.preloadSprite.anchor.setTo(0.5, 0.5);

        this.load.onLoadComplete.addOnce(this.onLoadComplete, this);
        this.load.setPreloadSprite(this.preloadSprite);

        this.preloadImages();
        this.preloadSounds();
    },

    create: function () {
        this.preloadSprite.cropEnabled = false;
    },

    update: function () {
        if (!!this.ready) {
            this.game.state.start('title');
        }
    },

    onLoadComplete: function () {
        this.ready = true;
    },

    // -------------------
    // - Preload Methods -
    // -------------------

    preloadImages: function () {
        // Preload All Images!!!
        this.load.spritesheet('baby', this.assetsUri.images + 'baby.png', 8, 8, 3);
        this.load.spritesheet('me', this.assetsUri.images + 'me.png', 16, 16, 4);
    },

    preloadSounds: function () {
        // Preload All Sounds!!!
        this.load.audio('bg', [this.assetsUri.sounds + 'background.wav']);
    }

};

module.exports = Preload;
