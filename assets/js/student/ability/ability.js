/**
 * Created by wind on 2017/1/5.
 */
function right_bar_cb() {
    $('#level_test_button').attr('class', 'side-button-selected right-side-button');
}

var curr_index = 0;
var finish_max = 0;
var max_index = 0;
var level_test_question;
var ans = [];
var ids = [];
var exam_id = 0;
var modify_count = [];
var used_time = [];
var start_time;

$(document).ready(function () {
    $.ajax({
        // url: '../../../assets/files/level_test.json',
        url: URL_BASE + '/tasks/web/erTest/meta',
        xhrFields: {
            withCredentials: true
        },
        type: 'get',
        success: function (data) {
            exam_id = data.examId;
            console.log(data);
            level_test_question = data.questions;
            curr_index = 0;
            max_index = level_test_question.length;
            for (var i = 0; i < max_index; ++i) {
                level_test_question[i].id = i + 1;
                ans.push(-1);
                ids.push(level_test_question[i].questionId);
                modify_count.push(-1);
                used_time.push(0);
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
                    // $('.test-header').hide();
                    // $('.question').show();
                    // $('.btn-part').show();
                    // $('#finish_test').hide();
                    // $('#has_done').hide();
                    $('.first').show();
                    $('.test-header').hide();
                    $('.question').hide();
                    $('.btn-part').hide();
                    $('#finish_test').hide();
                    $('#has_done').hide();
                }
            }
            else {



                $('.first').show();
                $('.test-header').hide();
                $('.question').hide();
                $('.btn-part').hide();
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

$('.first .btn').click(function () {
    $('.test-header').show();
    $('.question').show();
    $('.btn-part').show();
    $('.first').hide();
    $('#finish_test').hide();
    $('#has_done').hide();

    $('.count-down').init_count_down({
        total_second: 30 * 60
    });

    var tmp_date = new Date();
    start_time = tmp_date.getTime();
});

function gen_question(question) {
    var selected = ['', '', '', ''];
    if (ans[question.id - 1] > 0)
        selected[ans[question.id - 1] - 1] = 'option-selected';
    return '<div class="question-res">' +
        '</div>' +
        '<div class="question-content" value="{0}">'.format(question.id) +
        '<div class="question-q question-body">{0}. '.format(question.id) + question.content.body + '</div>' +
        '<br />' +
        '<div class="question-q">{0}</div>'.format(question.content.question) +
        '<br />' +
        '<div class="select-option selectable {1}" onclick="select_option(this)" value="{2}">A. {0}</div>'.format(question.content.options[0].content, selected[0], question.content.options[0].id) +
        '<div class="select-option selectable {1}" onclick="select_option(this)" value="{2}">B. {0}</div>'.format(question.content.options[1].content, selected[1], question.content.options[1].id) +
        '<div class="select-option selectable {1}" onclick="select_option(this)" value="{2}">C. {0}</div>'.format(question.content.options[2].content, selected[2], question.content.options[2].id) +
        '<div class="select-option selectable {1}" onclick="select_option(this)" value="{2}">D. {0}</div>'.format(question.content.options[3].content, selected[3], question.content.options[3].id) +
        '</div>';
}

function select_option(e) {
    $(e).siblings().removeClass('option-selected');
    $(e).addClass('option-selected');
    var id = Number($(e).parent().attr('value'));
    ans[id - 1] = Number($(e).attr('value'));
    if (id == max_index) {
        if (total_second < 15 * 60) {
            $('#next').removeClass('disabled');
        }
    }
    else {
        $('#next').removeClass('disabled');
    }
    if (id > finish_max) {
        set_progress(id - 1);
        finish_max = id;
    }
    modify_count[curr_index] += 1;
}

function submit_er_result() {
    var record = [];
    for (var i = 0; i < max_index; ++i) {
        record.push({
            answer: {
                correctId: ans[i]
            },
            questionId: ids[i],
            statisticInfo: {
                modifyCount: modify_count[i],
                usedTime: used_time[i]
            },
            type: 1
        })
    }

    console.log(record);

    $.ajax({
        xhrFields: {
            withCredentials: true
        },
        type: 'post',
        url: URL_BASE + '/tasks/web/erTest/record?examId={0}'.format(exam_id),
        contentType: 'application/json',
        data: JSON.stringify(record),
        success: function (data) {
            $('.er-score').html(data);
            var range_start = data - 100;
            var range_end = data + 50;
            if (range_start < 600)
                range_start = 600;
            if (range_end > 1200)
                range_end = 1200;
            $('#er_range').html('{0}ER~{1}ER'.format(range_start, range_end));

            clearTimeout(t);

            $('.test-header').hide();
            $('.question').hide();
            $('.btn-part').hide();
            $('#finish_test').show();
        }
    });
}

$('#last').click(function () {
    // 先统计时间，再换页
    var tmp_date = new Date();
    var interval = tmp_date.getTime() - start_time;
    start_time = tmp_date.getTime();
    used_time[curr_index] += interval;

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
    var tmp_date = new Date();
    var interval = tmp_date.getTime() - start_time;
    start_time = tmp_date.getTime();
    used_time[curr_index] += interval;

    curr_index += 1;
    if (ans[curr_index] < 0) {
        $(this).addClass('disabled');
    }
    else {
        $(this).removeClass('disabled');
    }
    if (curr_index >= max_index) {
        my_tip.bind('是否确认要提交？', function() {
            submit_er_result();
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

});

function set_progress(id) {
    var percent = (id + 1) * 100 / max_index;
    $('.progress-bar').css('width', '{0}%'.format(percent));
}

//做题倒计时
var total_second = 10;
var t;
function time_count() {
    total_second -= 1;
    if (total_second < 0) {
        clearTimeout(t);

        my_tip.alert('时间到，系统将自动提交您的测评题', {}, function () {
            submit_er_result();
        });
        return;
    }
    if (total_second == 60 * 15) {
        $('#next').removeClass('disabled');
    }
    // console.log(total_second);
    t = setTimeout('time_count()', 1000);
    var min_1 = Math.floor(total_second / 600);
    var min_2 = Math.floor(total_second / 60) % 10;
    var sec_1 = Math.floor((total_second % 60) / 10);
    var sec_2 = (total_second % 60) % 10;
    $('.min1').html(min_1);
    $('.min2').html(min_2);
    $('.sec1').html(sec_1);
    $('.sec2').html(sec_2);
}

(function ($) {
    $.fn.init_count_down = function (options) {
        options = options || {};
        total_second = options.total_second;
        time_count();
    }
})(jQuery);



