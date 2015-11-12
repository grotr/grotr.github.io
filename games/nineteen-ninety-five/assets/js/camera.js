function Camera(canvas, resolution, focalLength) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
    this.width = canvas.width = window.innerWidth * 0.5;
    this.height = canvas.height = window.innerHeight * 0.5;
    this.resolution = resolution;
    this.spacing = this.width / resolution;
    this.focalLength = focalLength || 0.8;
    this.range = MOBILE ? 8 : 14;
    this.scale = (this.width + this.height) / 1200;
}

Camera.prototype.render = function(player, map) {
    this.drawCeiling(player.direction, map.skybox);
    this.drawColumns(player, map);
    this.drawMap(1, 1, this.canvas.width * 0.2, map, player);
};

Camera.prototype.drawCeiling = function(direction, sky) {
    var width = sky.width * (this.height / sky.height) * 2;
    var left = (direction / CIRCLE) * -width;
    this.ctx.save();
    this.ctx.drawImage(sky.image, left, 0, width, this.height);
    if (left < width - this.width) {
        this.ctx.drawImage(sky.image, left + width, 0, width, this.height);
    }
};

Camera.prototype.drawSpriteColumn = function(player,map,column,columnProps,sprites) {
    
    var ctx = this.ctx,
        left = Math.floor(column * this.spacing),
        width = Math.ceil(this.spacing),
        angle = this.fov * (column / this.resolution - 0.5),
        columnWidth = this.width / this.resolution,
        sprite,props,obj,textureX,height,projection, mappedColumnObj,spriteIsInColumn,top;

    //todo: make rays check for objects, and return those that it actually hit

    //check if ray hit an object
    //if(!columnProps.objects.length){return;}

    sprites = sprites.filter(function(sprite){
     return !columnProps.hit || sprite.distanceFromPlayer < columnProps.hit;
    });


    for(var i = 0; i < sprites.length; i++){
        sprite = sprites[i];

        //mappedColumnObj = columnProps.objects.filter(function(obj){
        //  return sprite === obj.object;
        //})[0];

        //if(!mappedColumnObj)return;

        //determine if sprite should be drawn based on current column position and sprite width
        spriteIsInColumn =  left > sprite.render.cameraXOffset - ( sprite.render.width / 2 ) && left < sprite.render.cameraXOffset + ( sprite.render.width / 2 );

        //console.log(spriteIsInColumn);

        if(spriteIsInColumn){
            textureX = Math.floor( sprite.texture.width / sprite.render.numColumns * ( column - sprite.render.firstColumn ) );

            this.ctx.fillStyle = 'black';
            this.ctx.globalAlpha = 1;
            //ctx.fillRect(left, top , 10, sprite.render.height);

            var brightness = Math.max(sprite.distanceFromPlayer / this.lightRange - map.light, 0) * 100;

            sprite.texture.image.style.webkitFilter = 'brightness(' + brightness + '%)';
            sprite.texture.image.style.filter = 'brightness(' + brightness  + '%)';
            
            ctx.drawImage(sprite.texture.image, textureX, 0, 1, sprite.texture.height, left, sprite.render.top, width, sprite.render.height);



            

            //debugger;

            //ctx.fillRect(left, sprite.render.top, columnWidth, sprite.render.height);
            //debugger;

        }

        
    }

};

Camera.prototype.drawSprites = function(player,map,columnProps){

    var screenWidth = this.width,
        screenHeight = this.height,
        screenRatio = screenWidth / this.fov,
        resolution = this.resolution;

    //probably should get these and pass them in, but modifying originals for now
    // also this limits size of world

    // calculate each sprite distance to player
    this.setSpriteDistances(map.objects, player);


    var sprites = Array.prototype.slice.call(map.objects)
        .map(function(sprite){

            var distX = sprite.x - player.x,
                distY = sprite.y - player.y,
                width = sprite.width * screenWidth / sprite.distanceFromPlayer,
                height = sprite.height * screenHeight /  sprite.distanceFromPlayer,
                renderedFloorOffset = sprite.floorOffset / sprite.distanceFromPlayer,
                angleToPlayer = Math.atan2(distY,distX),
                angleRelativeToPlayerView = player.direction - angleToPlayer,
                top = (screenHeight / 2) * (1 + 1 / sprite.distanceFromPlayer) - height;

            if(angleRelativeToPlayerView >= CIRCLE / 2){
                angleRelativeToPlayerView -= CIRCLE;    
            }

            var cameraXOffset = ( camera.width / 2 ) - (screenRatio * angleRelativeToPlayerView),
                numColumns = width / screenWidth * resolution,
                firstColumn = Math.floor( (cameraXOffset - width/2 ) / screenWidth * resolution);

            sprite.distanceFromPlayer = Math.sqrt( Math.pow( distX, 2) + Math.pow( distY, 2) );
            sprite.render = {
                width: width,
                height: height,
                angleToPlayer: angleRelativeToPlayerView,
                cameraXOffset: cameraXOffset,
                distanceFromPlayer: sprite.distanceFromPlayer,
                numColumns: numColumns,
                firstColumn: firstColumn,
                top: top
            };

            // temp render red dot at item position
            //camera.ctx.fillStyle = 'red';
            //camera.ctx.fillRect(sprite.render.cameraXOffset, camera.height / 2, 3, 3);

            return sprite;
        })
        // sort sprites in distance order
        .sort(function(a,b){
            if(a.distanceFromPlayer < b.distanceFromPlayer){
                return 1;
            }
            if(a.distanceFromPlayer > b.distanceFromPlayer){
                return -1;
            }
            return 0;
        });

        if(sprites.length > 1 ){
            //debugger;
        }

    this.ctx.save();
    for (var column = 0; column < this.resolution; column++) {
        this.drawSpriteColumn(player,map,column,columnProps[column], sprites);
    }
    this.ctx.restore();
};

Camera.prototype.setSpriteDistances = function(objects, player){
    for(i = 0; i < objects.length; i++){
        obj = objects[i];
        //if(obj) obj.distanceFromPlayer = 
    }
};

Camera.prototype.drawColumns = function(player, map) {
    this.ctx.save();
    var allObjects = [];
    for (var column = 0; column < this.resolution; column++) {
        var x = column / this.resolution - 0.5;
        var angle = Math.atan2(x, this.focalLength);
        var ray = map.cast(player, player.direction + angle, this.range);
        var columnProps = this.drawColumn(column, ray, angle, map);

        allObjects.push(columnProps);
    }
    this.ctx.restore();
    this.ctx.save();
    this.drawSprites(player,map,allObjects);
    this.ctx.restore();
};

Camera.prototype.drawColumn = function(column, ray, angle, map) {
    var ctx = this.ctx;
    var texture = map.wallTexture;
    var left = Math.floor(column * this.spacing);
    var width = Math.ceil(this.spacing);
    var hit = -1;
    var objects = [];
    var hitDistance;
    while (++hit < ray.length && ray[hit].height <= 0);
    
    for (var s = ray.length - 1; s >= 0; s--) {
        var step = ray[s];
        if (s === hit) {
            var textureX = Math.floor(texture.width * step.offset);
            var wall = this.project(step.height, angle, step.distance);
            ctx.globalAlpha = 1;
            ctx.drawImage(texture.image, textureX, 0, 1, texture.height, left, wall.top, width, wall.height);

            ctx.fillStyle = '#000000';
            ctx.globalAlpha = 0;
            ctx.fillRect(left, wall.top, width, wall.height);
            hitDistance = step.distance;
        } else if(step.object){

            objects.push({
                object: step.object,
                distance: step.distance,
                offset: step.offset,
                angle: angle
            });

        }
    }
    return {
        objects: objects,
        hit: hitDistance
    };
};

Camera.prototype.drawMap = function(x, y, size, map, player) {
    // Draw the map
    var gridElementSize = size / map.size;
    for (var xx = 0; xx < map.size; xx++) {
        for (var yy = 0; yy < map.size; yy++) {
            var color = map.get(xx, yy) ? "rgba(0, 0, 0, 0.5)" : "rgba(255, 255, 255, 0.5)";
            this.ctx.fillStyle = color;
            this.ctx.fillRect(x + xx * gridElementSize, y + yy * gridElementSize, gridElementSize, gridElementSize);
        }
    }
    // Draw the player field of view 
    var playerSize = gridElementSize * 0.7;
    var halfPlayerSize = playerSize * 0.5;
    
    // Draw the player
    this.ctx.fillStyle = "red";
    this.ctx.fillRect(x + player.x * gridElementSize - halfPlayerSize, y + player.y * gridElementSize - halfPlayerSize, playerSize, playerSize);
    this.ctx.fillStyle = "blue";
    this.ctx.fillRect(x + (map.goal[0]+0.5) * gridElementSize - halfPlayerSize, y + (map.goal[1]+0.5) * gridElementSize - halfPlayerSize, playerSize, playerSize);
};

Camera.prototype.project = function(height, angle, distance) {
    var z = distance * Math.cos(angle);
    var wallHeight = this.height * height / z;
    var bottom = this.height / 2 * (1 + 1 / z);
    return {
        top: bottom - wallHeight,
        height: wallHeight
    }; 
};