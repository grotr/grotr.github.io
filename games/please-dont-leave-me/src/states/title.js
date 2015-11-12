'use strict';

function Title() {
    // Empty
}

Title.prototype = {

    create: function () {
        var music = this.game.add.audio('bg',1, true);

        music.play();

        this.baby = this.add.sprite(
            this.game.width  / 3,
            this.game.height / 3,
            'baby'
        )

        this.baby.anchor.setTo(0.5, 0.5);

       this.baby.animations.add('color');
       this.baby.animations.play('color', 12, true);

       this.me = this.add.sprite(this.game.width / 3 * 2, this.game.height / 3, 'me')
       this.me.anchor.setTo(0.5, 0.5);

       this.me.animations.add('color');
       this.me.animations.play('color', 12, true);

       this.cursors = this.game.input.keyboard.createCursorKeys();

       this.style = { font: "14px Arial", fill: "#ff0044", align: "center" };
    },

    update: function() {
    if (this.cursors.right.isDown)
    {
       this.me.x += .5;
    }

    if (this.me.x > 200) {
        var text = this.game.add.text(this.game.world.centerX, this.game.world.centerY, "you lose", this.style);
    }
    }

};

module.exports = Title;
