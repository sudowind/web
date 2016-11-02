/**
 * Created by wind on 2016/10/26.
 */
var circles = [];

function left_bar_cb() {
    $('#tasks_button').attr('class', 'side-button-selected left-side-button');
}

function init () {
    load_table_row('#row1');
    load_table_row('#row2');
    load_table_row('#row3');

    var h = Number($('.select-part').height());

    $('.book-part').css('height', (1050 - h).toString());

}

$('.option').click(function () {
    $(this).siblings().removeClass('index');
    $(this).addClass('index');
});

function load_table_row(row_selector) {
    // 从服务器拿到数据之后，将数据填充成表格
    var img_src = '../../../assets/img/1.png';
    var img_name = '诗词里的科学';
    // 应该是对每一行分别填充，每一行都有一个id，通过这个id进行操作
    $(row_selector).load('../../../include/html/teacher/task_table_line.html', function() {
        var bars = new Array(2);
        for (var i = 0; i < bars.length; ++i) {
            bars[i] = new ProgressBar.Circle(row_selector + ' td:nth-child(' + (i + 2).toString() + ') div', {
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
            bars[i].set(Math.random());
        }
    });
}

// 删除一本书
function delete_book() {
    var message = '将《诗词里的科学》从2015级3班、2015级4班的阅读任务中删除？';
    my_tip.alert(message);
}

// 查看书本详情
function go_to_detail() {

}