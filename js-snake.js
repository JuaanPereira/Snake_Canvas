var SNAKE = {}; /* Global variable which contains all the game functions and the init.*/
var frame_interval, score = 0;

SNAKE.equalCoordinates = function (coord1, coord2) {

    return coord1[0] === coord2[0] && coord1[1] === coord2[1];

}

SNAKE.checkCoordinateInArray = function (coord, arr) {

    var isInArray = false;

    $.each(arr, function (index, item) {

        if (SNAKE.equalCoordinates(coord, item)) {

            isInArray = true;

        }

    });

    return isInArray;
};

SNAKE.game = (function () {

    var canvas, context, snake_e, fruit, timeout, rip, timer;

    /* Setting up the dimensions of the board and the size its content will have */
    SNAKE.width = 500;
    SNAKE.height = 500;
    SNAKE.blockSize = 15;

    /* We need the dimensions of the board in blocks so we can check up the collisions later */
    SNAKE.widthInBlocks = SNAKE.width / SNAKE.blockSize;
    SNAKE.heightInBlocks = SNAKE.height / SNAKE.blockSize;

    function init() {  /* Game gets "init'd"*/

        var $canvas = $("#board") /* Getting the canvas element and setting up the dimensions */

        $canvas.attr("width", SNAKE.width);
        $canvas.attr("height", SNAKE.height);

        timer = new Timer();

        timer.start();

        timer.addEventListener("secondsUpdated", function (e){

            $("#timer").html(timer.getTimeValues().toString());

        });

        /* 0.1 seconds of delay between each frame that will pass when game gets looped */
        frame_interval = 250;
        canvas = $canvas[0];
        context = canvas.getContext("2d");

        snake_e = SNAKE.snake_element();
        fruit = SNAKE.fruit();

        keyEvents();
        gameLoop();

    }

    function gameLoop() {

        rip = false; /* This will handle your defeat */

        context.clearRect(0, 0, SNAKE.width, SNAKE.height); /* When a loop begins, we clear up the board, and draw up the new stuff that loop will include, like this we are making an "update" effect */
        snake_e.advance(fruit)
        drawing();

        context.fillStyle = '#000000';
        context.fillRect(0, 0, SNAKE.width, SNAKE.height);

        if (snake_e.checkCollision()) {

            rip = true;
            gameOver();

        }

        if (rip != true) {

            /* functions to move and draw the snake */
            snake_e.advance(fruit);
            snake_e.draw(context);
            fruit.draw(context);

            timeout = setTimeout(gameLoop, frame_interval); /* Time that will pass between every loop */

        }

    }

    function drawing() { /* draws every drawable element */

        snake_e.draw(context);
        fruit.draw(context);

    }

    function gameOver() {

        context.save();
        context.font = 'bold 30px sans-serif';
        context.fillStyle = '#ff1aff';
        context.textAlign = 'center';
        context.textBaseline = 'middle';
        context.strokeStyle = 'white';
        context.lineWidth = 2;
        
        var centreX = SNAKE.width / 2;
        var centreY = SNAKE.width / 2;
        
        context.strokeText('You lost.', centreX, centreY - 10);
        context.fillText('You lost.', centreX, centreY - 10);
        context.font = 'bold 15px sans-serif';
        context.strokeText('Press space to restart', centreX, centreY + 15);
        context.fillText('Press space to restart', centreX, centreY + 15);
        
        frame_interval = 250;
        score = 0;
        timer.stop();

        context.restore();

    }

    function keyEvents() {

        var directions = { /* Setting up an array that contains the key code and a reference as string */

            87: "up",
            83: "down",
            65: "left",
            68: "right",

            38: "arr-up",
            37: "arr-left",
            40: "arr-down",
            39: "arr-right"

        };

        $(document).keydown(function (event) { /* gets the pressed key */

            var key_pressed = event.which; /* saves the pressed key */
            var direction = directions[key_pressed]; /* storing the direction user pressed on kboard*/

            if (key_pressed) {

                snake_e.setDirection(direction);
                event.preventDefault(); /* makes the keys able to be called again */

            } 
            
            if(rip && key_pressed == 32){ /* restarts the game when we press space bar */
                
                clearTimeout(timeout);

                $("#timer").text("00:00:00");              
                $("#score").text("0");

                timer.reset();
                SNAKE.game.init();

            }

        });

        $(SNAKE).bind("fruitEaten", function(event, snakePositions){

            fruit.setNewPosition(snakePositions); /* after we eat a fruit, we set the fruit in a new position */

        });


    }

    return { init: init }

})();

SNAKE.fruit = function () {

    var position = [12, 6]; /* Setting up the fruit's initial position */

    function draw(context) {

        context.save();
        context.fillStyle = "#FFFF00";

        context.beginPath(); /* Making up a cool circle */
        var radius = SNAKE.blockSize / 2;
        var X = position[0] * SNAKE.blockSize + radius;
        var Y = position[1] * SNAKE.blockSize + radius;
        context.arc(X, Y, radius, 0, Math.PI * 2, true);


        context.fill();
        context.restore();

    }

    function random(low, high) { /* algorythm to randomize */

        return Math.floor(Math.random() * (high - low + 1) + low);

    }

    function getRandomPosition(){

        /* Setting up a position contained within the axis from the board's borders, it's - 2 becuase we need to avoid the border itself
        if we put -1 we'd be counting up the block that belongs to the board's border */

        var X = random(1, SNAKE.widthInBlocks - 2); 
        var Y = random(1, SNAKE.heightInBlocks - 2);

        return [X, Y];

    }

    function setNewPosition(snakeBody){

        var newPosition = getRandomPosition();

        if (SNAKE.checkCoordinateInArray(newPosition, snakeBody)) { /* if new position is already covered by the snake, try again */

            return setNewPosition(snakeBody);

        } else {  /* else just get a new position*/

            position = newPosition;

        }
    }

    function getPosition(){

        return position;

    }

    return { draw: draw, setNewPosition: setNewPosition, getPosition: getPosition };

};

SNAKE.snake_element = function () {

    var posArray, direction, nextDirection;

    posArray = []; /* Snake's body will consist of an array that will collect every single part that gets added to it */
    posArray.push([6, 4]);
    posArray.push([5, 4]);

    direction = "right"; /* Just indicating what direction it will start moving to */
    nextDirection = direction;

    function setDirection(newDirection) {

        /* Setting up the allowed directions */

        var allowedDirections;

        switch (direction) {

            case "left":
            case "right":
            case "arr-left":
            case "arr-right":
                allowedDirections = ["up", "down", "arr-up", "arr-down"];
                break;

            case "up":
            case "down":
            case "arr-up":
            case "arr-down":
                allowedDirections = ["left", "right", "arr-left", "arr-right"];
                break;

            default:
                throw ("You can't go this way...");
        }

        if (allowedDirections.indexOf(newDirection > -1)) {

            nextDirection = newDirection;

        }
    }

    function drawSection(contexto, position) {

        var X = SNAKE.blockSize * position[0];

        var Y = SNAKE.blockSize * position[1];

        contexto.fillRect(X, Y, SNAKE.blockSize, SNAKE.blockSize);

    }

    function draw(context) {

        /* draws the snake up */

        context.save();
        context.fillStyle = "#ff1aff";

        for (var i = 0; i < posArray.length; i++) {

            drawSection(context, posArray[i]);

        }

        context.restore();
    }

    function advance(fruit) { /* advancing function + finding a fruit in the meanwhile*/

        var nextPosition = posArray[0].slice();

        direction = nextDirection;

        switch (direction) {

            case "left":
            case "arr-left":
                nextPosition[0] -= 1;
                break;

            case "up":
            case "arr-up":
                nextPosition[1] -= 1;
                break;

            case "right":
            case "arr-right":
                nextPosition[0] += 1;
                break;

            case "down":
            case "arr-down":
                nextPosition[1] += 1;
                break;

            default:
                throw ("You can't do this.");
        }

        oldPosArray = posArray.slice(); /* just saving the old array */
        posArray.unshift(nextPosition);

        if(isEatingFruit(posArray[0], fruit)){

            $(SNAKE).trigger("fruitEaten", [posArray]);

            score = score + 10;

            if(score == 50){

                frame_interval = frame_interval - 50;

            }else if(score == 100){

                frame_interval = frame_interval - 70;

            }else if(score == 150){

                frame_interval = frame_interval - 10;

            }

            $("#score").text(score);

        }else{

            posArray.pop();

        }
    }

    function isEatingFruit(head, fruit) {

        return SNAKE.equalCoordinates(head, fruit.getPosition());

    }  

    function retreat() {

        posArray = previousPosArray;

    }

    function checkCollision() { /* checks if the snake has collisioned against the walls or against its own body */

        var againstWall = false;
        var againstHimself = false;

        var head = posArray[0]; /* We need to save the head of the snake APART otherwise it won't work */
        var body = posArray.slice(1); /* Rest of body */

        var SnakeX = head[0];
        var SnakeY = head[1];

        var minX = 1;
        var minY = 1;

        var maxX = SNAKE.widthInBlocks - 1; /* Getting the max size of the map until it reachs the border from the X axis */
        var maxY = SNAKE.heightInBlocks - 1; /* Same with Y axis */

        var outsideHorizontalBounds = SnakeX < minX || SnakeX >= maxX; /* Getting the bounds from both axises */
        var outsideVerticalBounds = SnakeY < minY || SnakeY >= maxY;

        if (outsideHorizontalBounds || outsideVerticalBounds) {

            againstWall = true;

        }

        againstHimself = SNAKE.checkCoordinateInArray(head, body); /* We check up if the snake has collisioned on himself */

        return againstWall || againstHimself; /* returning what happened at any case */

    }

    return { draw: draw, advance: advance, retreat: retreat, setDirection: setDirection, checkCollision: checkCollision };

};

$(document).ready(function () {

    SNAKE.game.init();

});