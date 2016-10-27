/**
 * Created by wind on 2016/10/26.
 */
var circles = [];

function init () {
    // TODO 希望对每一个进度环分别进行初始化
    // $('.progress-circle')
}

$('.option').click(function () {
    $(this).siblings().removeClass('index');
    $(this).addClass('index');
});

var bar = new ProgressBar.Circle('#progress_bar', {
    color: '#fb9e1d',
    // This has to be the same size as the maximum width to
    // prevent clipping
    strokeWidth: 12,
    trailWidth: 8,
    easing: 'easeInOut',
    duration: 1400,
    text: {
        autoStyleContainer: false
    },
    from: { color: '#fb9e1d', width: 8 },
    to: { color: '#fb9e1d', width: 12 },
    // Set default step function for all animate calls
    step: function(state, circle) {
        circle.path.setAttribute('stroke', state.color);
        circle.path.setAttribute('stroke-width', state.width);

        var value = Math.round(circle.value() * 100);
        if (value == 0) {
            circle.setText('0%');
        } else {
            circle.setText(value + '%');
        }

    }
});

var bar1 = new ProgressBar.Circle('#progress_bar2', {
    color: '#fb9e1d',
    // This has to be the same size as the maximum width to
    // prevent clipping
    strokeWidth: 12,
    trailWidth: 8,
    easing: 'easeInOut',
    duration: 1400,
    text: {
        autoStyleContainer: false
    },
    from: { color: '#fb9e1d', width: 8 },
    to: { color: '#fb9e1d', width: 12 },
    // Set default step function for all animate calls
    step: function(state, circle) {
        circle.path.setAttribute('stroke', state.color);
        circle.path.setAttribute('stroke-width', state.width);

        var value = Math.round(circle.value() * 100);
        if (value == 0) {
            circle.setText('0%');
        } else {
            circle.setText(value + '%');
        }

    }
});