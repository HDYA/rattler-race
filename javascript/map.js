/**
 * Created by HDYA-Backfire on 2017-03-23.
 */

var BORDER_COLOR = 'blue';
var BACKGROUND_COLOR = 'black';
var TURN_POSSIBILITY = 0.1;

function Map($map, rows, columns) {
    this.map = $map;
    this.rows = rows;
    this.columns = columns;
    this.cells = {};
    this.snakes = [];
    this.interval = null;
}

Map.prototype.deleteSnake = function (currentSnake) {
    if (!currentSnake || !currentSnake.positions) {
        return;
    }
    var currentPosition;
    for (var currentPositionIndex in currentSnake.positions) {
        currentPosition = currentSnake.positions[currentPositionIndex];
        this.cells[currentPosition[0]][currentPosition[1]]
            .removeAttr('class')
            .css('background-color', 'transparent');
    }
    currentSnake.positions = [];
    for (var currentSnakeIndex in this.snakes) {
        if (this.snakes[currentSnakeIndex] == currentSnake) {
            this.snakes.splice(parseInt(currentSnakeIndex), 1)
        }
    }
};

Map.prototype.initiateSnake = function (currentSnake) {
    if (!currentSnake || !currentSnake.length || currentSnake.direction == undefined || currentSnake.direction == null) {
        console.error('Invalid snake:', currentSnake);
        return;
    }
    var x, y, found;
    var k = 0, previousDirection = 1;
    while (k < currentSnake.length) {
        if (k == 0) {
            x = parseInt(Math.random() * this.rows);
            y = parseInt(Math.random() * this.columns);
            while (this.cells[x][y].hasClass('snake')) {
                x = parseInt(Math.random() * this.rows);
                y = parseInt(Math.random() * this.columns);
            }
            previousDirection = currentSnake.direction;
            found = true;
        } else {
            found = false;
            for (var directionOffset = 0; directionOffset < currentSnake.DIRECTIONS.length; directionOffset++) {
                var actualDirection = (directionOffset + previousDirection) % currentSnake.DIRECTIONS.length;
                if (!this.cells[x + currentSnake.DIRECTIONS[actualDirection][0]][y + currentSnake.DIRECTIONS[actualDirection][1]].hasClass('snake')
                    && !this.cells[x + currentSnake.DIRECTIONS[actualDirection][0]][y + currentSnake.DIRECTIONS[actualDirection][1]].hasClass('border')) {
                    if (actualDirection == 3) {
                        this.cells[x][y].removeClass('vertical-active');
                    } else if (actualDirection == 0) {
                        this.cells[x][y].removeClass('horizon-active');
                    }
                    x += currentSnake.DIRECTIONS[actualDirection][0];
                    y += currentSnake.DIRECTIONS[actualDirection][1];
                    if (actualDirection % 2 == 0) {
                        this.cells[x][y].addClass('vertical-active');
                    } else {
                        this.cells[x][y].addClass('horizon-active');
                    }
                    previousDirection = actualDirection;
                    found = true;
                    break;
                }
            }
            if (!found) {
                for (var t = 0; t < k; t++) {
                    this.cells[currentSnake.positions[t][0]][currentSnake.positions[t][1]]
                        .removeAttr('class')
                        .css('background-color', 'transparent');
                }
                k = 0;
                console.log('Initialization of snake failed, retry..');
                continue;
            }
        }
        this.cells[x][y].addClass('snake');
        this.cells[x][y].css('background-color', currentSnake.color);
        currentSnake.positions.push([x, y]);
        k++
    }
    this.snakes.push(currentSnake);
};

Map.prototype.checkDirection = function(currentSnake, nextDirection) {
    return this.cells[currentSnake.positions[0][0] + currentSnake.DIRECTIONS[nextDirection][0]][currentSnake.positions[0][1] + currentSnake.DIRECTIONS[nextDirection][1]].hasClass('snake')
    || this.cells[currentSnake.positions[0][0] + currentSnake.DIRECTIONS[nextDirection][0]][currentSnake.positions[0][1] + currentSnake.DIRECTIONS[nextDirection][1]].hasClass('border');
};

Map.prototype.moveSnakeForward = function(currentSnake) {
    if (!currentSnake || !currentSnake.positions || currentSnake.direction == undefined || currentSnake.direction == null || !currentSnake.actionOnDeath) {
        console.error('Invalid snake:', currentSnake);
        return;
    }

    var nextDirection = currentSnake.direction;
    if  (this.checkDirection(currentSnake, nextDirection) || Math.random() < TURN_POSSIBILITY ){
        // Turn
        if (Math.random() > 0.5) {
            nextDirection = (nextDirection + 1) % currentSnake.DIRECTIONS.length;
        } else {
            nextDirection = (nextDirection + 3) % currentSnake.DIRECTIONS.length;
        }
        if (this.checkDirection(currentSnake, nextDirection)){
            nextDirection = (nextDirection + 2) % currentSnake.DIRECTIONS.length;
            if (this.checkDirection(currentSnake, nextDirection)) {
                nextDirection = -1;
            }
        }
    }
    if (nextDirection != -1) {
        var blockToClean = currentSnake.positions.pop();
        this.cells[blockToClean[0]][blockToClean[1]]
            .removeAttr('class')
            .css('background-color', 'transparent');
        if (nextDirection % 2 == 0) {
            this.cells[currentSnake.positions[0][0]][currentSnake.positions[0][1]].addClass('vertical-active');
        } else {
            this.cells[currentSnake.positions[0][0]][currentSnake.positions[0][1]].addClass('horizon-active');
        }
        var nextCell = [currentSnake.positions[0][0] + currentSnake.DIRECTIONS[nextDirection][0], currentSnake.positions[0][1] + currentSnake.DIRECTIONS[nextDirection][1]];
        this.cells[nextCell[0]][nextCell[1]].addClass('snake');
        this.cells[nextCell[0]][nextCell[1]].css('background-color', currentSnake.color);
        currentSnake.positions.unshift(nextCell);
        currentSnake.direction = nextDirection;
    } else {
        if ((currentSnake.actionOnDeath & currentSnake.ACTION_ON_DEATHS.REMOVE) == currentSnake.ACTION_ON_DEATHS.REMOVE) {
            this.deleteSnake(currentSnake);
        }
        if ((currentSnake.actionOnDeath & currentSnake.ACTION_ON_DEATHS.REBORN) == currentSnake.ACTION_ON_DEATHS.REBORN) {
            this.initiateSnake(currentSnake);
        }
    }
};

Map.prototype.moveAllSnake = function() {
    var currentSnake;
    for (var currentSnakeIndex in this.snakes) {
        currentSnake = this.snakes[currentSnakeIndex];
        if (!currentSnake.stop) {
            this.moveSnakeForward(currentSnake);
        }
    }
};

Map.prototype.resize = function() {
    var elementWidth = this.map.width() * 0.9 / (this.columns + 2);
    var elementHeight = this.map.height() * 0.9 / (this.rows + 2);
    var elementHorizonMargin = this.map.width() * 0.1 / (this.columns + 2) / 2;
    var elementVerticalMargin = this.map.height() * 0.1 / (this.rows + 2) / 2;

    $('.map > div')
        .css('width', elementWidth)
        .css('height', elementHeight)
        .css('margin-left', elementHorizonMargin)
        .css('margin-right', elementHorizonMargin)
        .css('margin-top', elementVerticalMargin)
        .css('margin-bottom', elementVerticalMargin);

    $('.map > div.border')
        .css('width', elementWidth + elementHorizonMargin * 2)
        .css('height', elementHeight + elementVerticalMargin * 2)
        .css('margin', 0)
        .css('background-color', BORDER_COLOR);
};

Map.prototype.initiate = function () {
    for (var i = -1; i <= this.rows; i++) {
        this.cells[i] = {};
        for (var j = -1; j <= this.columns; j++) {
            var $newChild = $('<div></div>')
                .append($('<div></div>'))
                .append($('<div></div>'))
                .append($('<div></div>'));
            if (i == -1 || i == this.rows || j == -1 || j == this.columns) {
                $newChild
                    .empty()
                    .addClass('border');
            }
            this.cells[i][j] = $newChild;
            this.map.append($newChild);
        }
    }

    this.resize();
};

