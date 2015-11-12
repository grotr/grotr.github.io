function Map(size) {
    this.size = size;
    this.wallGrid = new Array(size);
    for (i=0; i < size; i++) {
        this.wallGrid[i] = new Array(size);
    }
    this.goal = undefined;
    this.skybox = new Bitmap('assets/img/skybox.jpg', 1920, 50);
    this.ceilingTexture = new Bitmap('assets/img/ceiling.png', 33, 33);
    this.floorTexture = new Bitmap('assets/img/floor.png', 64, 64);
    this.wallTexture = new Bitmap('assets/img/wall.png', 128, 128);
    this.startPos = [-1,-1];
    this.objects = [];
}

Map.prototype.get = function(x, y) {
    x = Math.floor(x);
    y = Math.floor(y);
    if (x < 0 || x > this.size - 1 || y < 0 || y > this.size - 1) return -1;
    return this.wallGrid[x][y];
};

Map.prototype.generateMap = function(vector) {
    for (var i = 0; i < this.size; i++) {
        for (var j = 0; j < this.size; j++) {
            this.wallGrid[i][j] = 1;
        }
    }

    var rand1 = Math.floor(Math.random() * (this.size-1));
    while (rand1 % 2 === 0) {
        rand1 = Math.floor(Math.random() * (this.size-1));
    }

    var rand2 = Math.floor(Math.random() * (this.size-1));
    while (rand2 % 2 === 0) {
        rand2 = Math.floor(Math.random() * (this.size-1));
    }

    this.startPos = [rand1+0.5, rand2+0.5];

    this.wallGrid[rand1][rand2] = 0;
    dfs(rand1, rand2);

    function dfs(rand1, rand2) {
        var randDirections = generateRandomDirection();

        for (var i = 0; i < randDirections.length; i++) {
            switch (randDirections[i]) {
                case 1: // UP
                    if (rand1 - 2 > 0) {
                        if (this.map.wallGrid[rand1-2][rand2] !== 0) {
                            this.map.wallGrid[rand1-2][rand2] = 0;
                            this.map.wallGrid[rand1-1][rand2] = 0;
                            dfs(rand1-2, rand2);
                        }
                    }
                    break;

                case 2: // RIGHT
                    if (rand2 + 2 < this.map.size - 1) {
                        if (this.map.wallGrid[rand1][rand2+2] !== 0) {
                            this.map.wallGrid[rand1][rand2+2] = 0;
                            this.map.wallGrid[rand1][rand2+1] = 0;
                            dfs(rand1, rand2 + 2);
                        }
                    }
                    break;

                case 3: // DOWN
                    if (rand1 + 2 < this.map.size - 1) {
                        if (this.map.wallGrid[rand1+2][rand2] !== 0) {
                            this.map.wallGrid[rand1+2][rand2] = 0;
                            this.map.wallGrid[rand1+1][rand2] = 0;
                            dfs(rand1 + 2, rand2);
                        }
                    }
                    break;

                case 4: // LEFT
                    if (rand2 - 2 > 0) {
                        if (this.map.wallGrid[rand1][rand2-2] !== 0) {
                            this.map.wallGrid[rand1][rand2-2] = 0;
                            this.map.wallGrid[rand1][rand2-1] = 0;
                            dfs(rand1, rand2 - 2);
                        }
                    }
                    break;
            }
        }
        if (this.map.goal === undefined)
            this.map.goal = [rand1, rand2];
    }

    this.addObject({
        color: 'brown',
        texture: new Bitmap('assets/img/smiley.png', 64, 64),
        height: 0.7,
        width: 0.225,
        floorOffset: 0,
        speed: 0.1,
    },this.goal[1]+0.5,this.goal[2]+0.5);

    function generateRandomDirection() {
        var randDirections = new Array(4);

        for (var i=0; i<4; i++) {
            randDirections[i] = i+1;
        }
        return shuffle(randDirections);
    }

    //+ Jonas Raoni Soares Silva
    //@ http://jsfromhell.com/array/shuffle [v1.0]
    function shuffle(o){ //v1.0
        for(var j, x, i = o.length; i; j = Math.floor(Math.random() * i), x = o[--i], o[i] = o[j], o[j] = x);
        return o;
    }
};

Map.prototype.cast = function(point, angle, range) {
    var self = this;
    var sin = Math.sin(angle);
    var cos = Math.cos(angle);
    var noWall = { length2: Infinity };
    return ray({ x: point.x, y: point.y, height: 0, distance: 0 });

    function ray(origin) {
        var stepX = step(sin, cos, origin.x, origin.y);
        var stepY = step(cos, sin, origin.y, origin.x, true);
        var nextStep = stepX.length2 < stepY.length2 ?
                       inspect(stepX, 1, 0, origin.distance, stepX.y) :
                       inspect(stepY, 0, 1, origin.distance, stepY.x);
        if (nextStep.distance > range) return [origin];
        return [origin].concat(ray(nextStep));
    }

    function step(rise, run, x, y, inverted) {
        if (run === 0) return noWall;
        var dx = run > 0 ? Math.floor(x + 1) - x : Math.ceil(x - 1) - x;
        var dy = dx * (rise / run);
        return {
            x: inverted ? y + dy : x + dx,
            y: inverted ? x + dx : y + dy,
            length2: dx * dx + dy * dy
        };
    }

    function inspect(step, shiftX, shiftY, distance, offset) {
        var dx = cos < 0 ? shiftX : 0;
        var dy = sin < 0 ? shiftY : 0;
        step.height = self.get(step.x - dx, step.y - dy);
        step.distance = distance + Math.sqrt(step.length2);
        if (shiftX) step.shading = cos < 0 ? 2 : 0;
        else step.shading = sin < 0 ? 2 : 1;
        step.offset = offset - Math.floor(offset);
        return step;
    }
};

Map.prototype.update = function(seconds) {
    if (this.light > 0) this.light = Math.max(this.light - 10 * seconds, 0);
    else if (Math.random() * 5 < seconds) this.light = 2;
};

Map.prototype.addObject = function(object,x,y){
    this.objects.push(new MapObject(object,x,y) );
};

function MapObject(object,x,y){
    for(var prop in object){
        this[prop] = object[prop];
    }
    this.x = x;
    this.y = y;
}
