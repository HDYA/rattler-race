/**
 * Created by HDYA-Backfire on 2017-03-23.
 */
function Snake(color, initialLength, initialDirection) {
    this.color = color || 'red';
    this.length = initialLength || 3;
    this.direction = initialDirection;
    this.positions = [];

    if (!this.direction || this.direction > 3 || this.direction < 0) {
        this.direction = 1;
    }

    this.trunLeft = function () {
        this.direction = (this.direction - 1 + this.DIRECTIONS.length) % this.DIRECTIONS.length;
    };

    this.trunRight = function () {
        this.direction = (this.direction + 1) % this.DIRECTIONS.length;
    };
}

Snake.prototype.DIRECTIONS = [
    [-1, 0], [0, 1], [1, 0], [0, -1]
];