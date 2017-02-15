/**
 * Created by wind on 2017/1/5.
 */
function right_bar_cb() {
    $('#level_test_button').attr('class', 'side-button-selected right-side-button');
}

var curr_index = 0;
var max_index = 0;
var level_test_question;
var ans = [];

$(document).ready(function () {
    $.ajax({
        url: '../../../assets/files/level_test.json',
        type: 'get',
        success: function (data) {
            console.log(data);
            level_test_question = data;
            curr_index = 0;
            max_index = data.length;
            for (var i = 0; i < max_index; ++i) {
                ans.push(-1);
            }
            var html = gen_question(level_test_question[curr_index]);
            $('.question').html(html);
        },
        error: error_handler()
    });
    // 判断上次考试距离现在有多久
    $.ajax({
        xhrFields: {
            withCredentials: true
        },
        url: URL_BASE + '/tasks/web/erTest/latest',
        type: 'get',
        success: function (data) {
            if (data.hasTest) {
                var last_time = data.erTestRecord.createTime;
                var last = new Date(last_time);
                var now = new Date();
                var days = Math.ceil((now.getTime() - last_time) / 86400000);
                $('.er-score').html(data.erTestRecord.erScore);
                // var next_time = last_time + 60 * 86400000;
                if (days < 60) {
                    $('#last_test_date').html(last.getFullDate('zh'));
                    $('#wait_date').html(60 - days);
                    $('.question').hide();
                    $('.btn-part').hide();
                    $('#finish_test').hide();
                    $('#has_done').show();
                }
                else {
                    $('.question').show();
                    $('.btn-part').show();
                    $('#finish_test').hide();
                    $('#has_done').hide();
                }
            }
            else {
                $('.question').show();
                $('.btn-part').show();
                $('#finish_test').hide();
                $('#has_done').hide();
                //
                // $('.question').hide();
                // $('.btn-part').hide();
                // $('#finish_test').show();
                // $('#has_done').hide();
            }
        },
        error: error_handler()
    });
});

function gen_question(question) {
    var selected = ['', '', '', ''];
    if (ans[question.id - 1] > 0)
        selected[ans[question.id - 1]] = 'option-selected';
    return '<div class="question-res">' +
        '</div>' +
        '<div class="question-content" value="{0}">'.format(question.id) +
        '<div class="question-q question-body">{0}. '.format(question.id) + question.body + '</div>' +
        '<br />' +
        '<div class="question-q">{0}</div>'.format(question.question) +
        '<br />' +
        '<div class="select-option selectable {1}" onclick="select_option(this)" value="0">A. {0}</div>'.format(question.choices[0].content, selected[0]) +
        '<div class="select-option selectable {1}" onclick="select_option(this)" value="1">B. {0}</div>'.format(question.choices[1].content, selected[1]) +
        '<div class="select-option selectable {1}" onclick="select_option(this)" value="2">C. {0}</div>'.format(question.choices[2].content, selected[2]) +
        '<div class="select-option selectable {1}" onclick="select_option(this)" value="3">D. {0}</div>'.format(question.choices[3].content, selected[3]) +
        '</div>';
}

function select_option(e) {
    $(e).siblings().removeClass('option-selected');
    $(e).addClass('option-selected');
    var id = $(e).parent().attr('value');
    ans[id - 1] = $(e).attr('value');
    $('#next').removeClass('disabled');
    set_progress(id - 1);
}

$('#last').click(function () {
    curr_index -= 1;
    if (curr_index < 0)
        curr_index = 0;
    var html = gen_question(level_test_question[curr_index]);
    $('.question').html(html);
    if (ans[curr_index] < 0) {
        $('#next').addClass('disabled');
    }
    else {
        $('#next').removeClass('disabled');
    }
    $('#next').html('下一题');
});
$('#next').click(function () {
    curr_index += 1;
    if (curr_index >= max_index) {
        my_tip.bind('是否确认要提交？', function() {
            $.ajax({
                xhrFields: {
                    withCredentials: true
                },
                type: 'post',
                url: URL_BASE + '/tasks/web/erTest/record',
                success: function (data) {
                    $('.er-score').html(data);
                    var range_start = data - 100;
                    var range_end = data + 50;
                    if (range_start < 600)
                        range_start = 600;
                    if (range_end > 1200)
                        range_end = 1200;
                    $('#er_range').html('{0}ER~{1}ER'.format(range_start, range_end));
                }
            });
            $('.question').hide();
            $('.btn-part').hide();
            $('#finish_test').show();
        });
        return;
    }
    if (curr_index >= max_index - 1) {
        curr_index = max_index - 1;
        $(this).html('提交');
    }
    else {
        $(this).html('下一题');
    }
    var html = gen_question(level_test_question[curr_index]);
    $('.question').html(html);
    if (ans[curr_index] < 0) {
        $(this).addClass('disabled');
    }
    else {
        $(this).removeClass('disabled');
    }
});

function set_progress(id) {
    var percent = (id + 1) * 100 / max_index;
    $('.progress-bar').css('width', '{0}%'.format(percent));
}

//做题倒计时
(function ($) {
    $.fn.init_count_down = function (options) {
        console.log(options);
    }
})(jQuery);