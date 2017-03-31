/**
 * Created by HDYA-Backfire on 2017-03-23.
 */
var $layer;

$(function () {
    var map1 = new Map($('.map'), config.map.width, config.map.height);
    window.onresize = function() {
        map1.resize();
    };
    map1.initiate();

    $layer = $('.layer');

    $('#start').click(function() {
        startGame();
    });
    $('#local').click(function() {
        startLocalAnimation(map1, config.snake.number);
        hideLayer();
    });
    $('#remote').click(function() {
        var url = '/record';
        if (config.demo.ask_url) {
            url = prompt('Please specify url of instances status hub');
        }
        startRemoteAnimation(map1, url);
        hideLayer();
    });
});

function hideLayer() {
    $layer.hide();
}

function startClock(map) {
    window.setInterval(function () {
        map.moveAllSnake();
    }, config.game.clock);
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

var interval;
var snakes = {};
function startRemoteAnimation(map, url) {
    interval = setInterval(function() {
        $.ajax({
            url: url,
            success: function(data) {
                for(var index in data) {
                    if (snakes[index]) {
                        snakes[index].setStatus(data[index]);
                    } else {
                        var newSnake = new Snake();
                        snakes[index] = newSnake;
                        newSnake.setStatus(data[index]);
                        map.initiateSnake(newSnake);
                    }    
                }
            }
        });
    }, config.demo.query_interval);

    startClock(map);
}