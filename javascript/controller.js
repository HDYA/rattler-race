/**
 * Created by HDYA-Backfire on 2017-03-23.
 */
$(function () {
    var map1 = new Map($('.map'), 50, 70);
    window.onresize = function() {
        map1.resize();
    };
    map1.initiate();

    startLocalAnimation(map1, 10);
});

function startClock(map) {
    window.setInterval(function () {
        map.moveAllSnake();
    }, 100);
}

function startLocalAnimation(map, number) {
    if (isNaN(number)) {
        console.error('Invalid number parameter: ', number);
        return;
    }

    for (var i = 0; i < number; i++) {
        map.initiateSnake(new Snake());
    }

    startClock(map);
}