/**
 * Created by HDYA-Backfire on 2017-03-23.
 */
function Snake(color, initialLength, initialDirection, actionOnDeath) {
    this.color = color || ("#" + ("00000" + ((Math.random() * 16777215 + 0.5) >> 0).toString(16)).slice(-6));
    this.length = initialLength || (config.snake.length_minimum + (Math.random() * config.snake.length_variation));
    this.direction = initialDirection || parseInt(Math.random() * (this.DIRECTIONS.length - 1));
    this.actionOnDeath = actionOnDeath || (this.ACTION_ON_DEATHS.REMOVE | this.ACTION_ON_DEATHS.REBORN);
    this.positions = [];
    this.stop = false;

    if (!this.direction || this.direction > 3 || this.direction < 0) {
        this.direction = 1;
    }

    this.turnLeft = function () {
        this.direction = (this.direction - 1 + this.DIRECTIONS.length) % this.DIRECTIONS.length;
    };

    this.turnRight = function () {
        this.direction = (this.direction + 1) % this.DIRECTIONS.length;
    };
}

Snake.prototype.DIRECTIONS = [
    [-1, 0], [0, 1], [1, 0], [0, -1]
];

Snake.prototype.ACTION_ON_DEATHS = {
    REMOVE: 1,
    REBORN: 2,
};