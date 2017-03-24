/**
 * Created by HDYA-Backfire on 2017-03-23.
 */

var BORDER_COLOR = 'blue';
var BACKGROUND_COLOR = 'black';

function Map($map, rows, columns) {
    this.map = $map;
    this.rows = rows;
    this.columns = columns;
    this.cells = {};
    this.snakes = [];
}

Map.prototype.deleteSnake = function (currentSnake) {
    if (!currentSnake || !currentSnake.positions) {
        return;
    }
    for (var currentPosition in currentSnake.positions) {
        this.cells[currentPosition[0]][currentPosition[1]]
            .removeAttr('class')
            .css('background-color', 'none');
    }
};

Map.prototype.initiateSnake = function (currentSnake) {
    if (!currentSnake || !currentSnake.length || !currentSnake.direction) {
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
                        .css('background-color', 'none');
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
