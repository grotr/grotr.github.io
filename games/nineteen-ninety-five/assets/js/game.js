function GameLoop() {
    this.frame = this.frame.bind(this);
    this.lastTime = 0;
    this.callback = function() {};
}

GameLoop.prototype.start = function(callback) {
    this.callback = callback;
    requestAnimationFrame(this.frame);
};

GameLoop.prototype.frame = function(time) {
    var seconds = (time - this.lastTime) / 1000;
    this.lastTime = time;
    if (seconds < 0.2) this.callback(seconds);
    requestAnimationFrame(this.frame);
};

var display = document.getElementById('display');
var map = new Map(39);
map.generateMap();
var player = new Player(map.startPos[0], map.startPos[1], Math.PI * 0.3);
var controls = new Controls();
var camera = new Camera(display, MOBILE ? 160 : 320, 1);
var loop = new GameLoop();



loop.start(function frame(seconds) {
    if (Math.floor(map.goal[0]) == Math.floor(player.x) && Math.floor(map.goal[1]) == Math.floor(player.y)) {
        var hero = document.createElement("div");        // Create a <button> element
        var t = document.createTextNode("Winner");       // Create a text node
        hero.appendChild(t);                                // Append the text to <button>
        document.body.appendChild(hero);
    } else {
        map.update(seconds);
        player.update(controls.states, map, seconds);
        camera.render(player, map);
    }
});