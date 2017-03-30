/**
 * Created by HDYA-Backfire on 2017-03-23.
 */
$(function () {
    var map1 = new Map($('.map'), 50, 70);
    map1.initiate();

    map1.initiateSnake(new Snake('red', 10, parseInt(Math.random() * 3), 3));
    map1.initiateSnake(new Snake('yellow', 10, parseInt(Math.random() * 3), 3));
    map1.initiateSnake(new Snake('green', 10, parseInt(Math.random() * 3), 3));
    map1.initiateSnake(new Snake('aqua', 10, parseInt(Math.random() * 3), 3));
    map1.initiateSnake(new Snake('white', 10, parseInt(Math.random() * 3), 3));
    map1.initiateSnake(new Snake('darkgray', 10, parseInt(Math.random() * 3), 3));
    map1.initiateSnake(new Snake('lightblue', 10, parseInt(Math.random() * 3), 3));
    map1.initiateSnake(new Snake('orange', 10, parseInt(Math.random() * 3), 3));
    map1.initiateSnake(new Snake('violet', 10, parseInt(Math.random() * 3), 3));

    window.onresize = function() {
        map1.resize();
    };

    window.setInterval(function () {
        map1.moveAllSnake();
    }, 100);
});