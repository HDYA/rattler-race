/**
 * Created by HDYA-Backfire on 2017-03-23.
 */
var $layer;

$(function () {
    var map1 = new Map($('.map'), 50, 70);
    window.onresize = function() {
        map1.resize();
    };
    map1.initiate();

    $layer = $('.layer');

    $('#start').click(function() {
        startGame();
        hideLayer();
    });
    $('#local').click(function() {
        startLocalAnimation(map1, 10);
        hideLayer();
    });
    $('#remote').click(function() {
        startLocalAnimation(map1, 10);
        hideLayer();
    });
});

function hideLayer() {
    $layer.hide();
}

function startClock(map) {
    window.setInterval(function () {
        map.moveAllSnake();
    }, 100);
}

function startGame() {
    alert('Sorry, Not Implemented Yet!');
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