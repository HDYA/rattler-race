/**
 * Created by HDYA-Backfire on 2017-03-23.
 */
$(function () {
    var map1 = new Map($('.map'), 50, 70);
    map1.initiate();
    map1.initiateSnake(new Snake('red', 20, parseInt(Math.random() * 3)));
    map1.initiateSnake(new Snake('yellow', 20, parseInt(Math.random() * 3)));
    map1.initiateSnake(new Snake('green', 20, parseInt(Math.random() * 3)));
    map1.initiateSnake(new Snake('aqua', 20, parseInt(Math.random() * 3)));

    window.onresize = function() {
        map1.resize();
    }
});