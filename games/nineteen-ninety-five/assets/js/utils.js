var CIRCLE = Math.PI * 2;
var MOBILE = /Android|webOS|iPhone|iPad|iPod|BlackBerry/i.test(navigator.userAgent);

function Controls() {
    this.codes  = {
        // ARROWS
        38: 'forward', 40: 'backward',
        37: 'left', 39: 'right',

        // WASD
        87: 'forward', 83: 'backward',
        65: 'left', 68: 'right',
        81: 'stepLeft', 69: 'stepRight'
    };

    this.states = {
        'forward': false, 'backward': false,
        'left': false, 'right': false,
        'stepLeft': false, 'stepRight': false
    };

    document.addEventListener('keydown', this.onKey.bind(this, true), false);
    document.addEventListener('keyup', this.onKey.bind(this, false), false);
    document.addEventListener('touchstart', this.onTouch.bind(this), false);
    document.addEventListener('touchmove', this.onTouch.bind(this), false);
    document.addEventListener('touchend', this.onTouchEnd.bind(this), false);
    document.addEventListener('mousemove', this.onMouseMovement.bind(this), false);
    document.body.onclick = document.body.requestPointerLock ||
                            document.body.mozRequestPointerLock ||
                            document.body.webkitRequestPointerLock;
}

Controls.prototype.onTouch = function(e) {
    var t = e.touches[0];
    this.onTouchEnd(e);
    if (t.pageY < window.innerHeight * 0.5) this.onKey(true, { keyCode: 38 });
    else if (t.pageX < window.innerWidth * 0.5) this.onKey(true, { keyCode: 37 });
    else if (t.pageY > window.innerWidth * 0.5) this.onKey(true, { keyCode: 39 });
};

Controls.prototype.onTouchEnd = function(e) {
    this.states = {
        'forward': false, 'backward': false,
        'left': false, 'right': false,
        'sideLeft': false, 'sideRight': false
    };
    e.preventDefault();
    e.stopPropagation();
};

Controls.prototype.onKey = function(val, e) {
    var state = this.codes[e.keyCode];
    if (typeof state === 'undefined') return;
    this.states[state] = val;
    e.preventDefault && e.preventDefault();
    e.stopPropagation && e.stopPropagation();
};

Controls.prototype.onMouseMovement = function (e) {
    var x = (e.movementX || e.mozMovementX || e.webkitMovementX || 0);
    if(x > 0) { player.rotate(Math.PI / 40); }
    if(x < 0) { player.rotate(-Math.PI / 40); }
};

function Bitmap(src, width, height) {
    this.image = new Image();
    this.image.src = src;
    this.width = width;
    this.height = height;
}