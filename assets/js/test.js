/**
 * Created by wind on 2016/10/20.
 */

function left_bar_cb() {
    $('#tasks_button').attr('class', 'side-button-selected left-side-button');
}

var EXAM_STATUS = {};
var question_type = {
    1: false,
    2: false,
    3: false
};
var questions = {
    1: [],
    2: [],
    3: []
};
var question_answer = {};

var question_id = 0;

var id2answer = {};

function init_value() {
    $('.question').remove();
    questions = {
        1: [],
        2: [],
        3: []
    };
    question_answer = {};
    question_id = 0;
}

function generate_question(data) {
    // 以下两个变量控制
    var selectable = '';
    var click = '';
    if (window.location.href.indexOf('test.html') > 0) {
        selectable = 'selectable';
        click = 'onclick="select_option(this);"'
    }
    var html = '';
    question_id += 1;
    question_answer[data.questionId] = {
        questionId: data.questionId,
        type: data.type,
        answer: null
    };
    switch (data.type) {
        case 1:
            question_type[1] = true;
            // 单选题
            var options = '';
            for (var i = 0; i < data.content.options.length; ++i) {
                options += '<div class="select-option ' + selectable + '" value="' + data.content.options[i].id + '" ' + click + '>' + String.fromCharCode(0x41 + i) + '. ' + data.content.options[i].content + '</div>'
            }
            html = '<div class="question" value="' + data.questionId + '">' +
                '<div class="question-res">' +
                '</div>' +
                '<div class="question-content">' +
                '<div class="question-q">' + question_id.toString() + '. ' + data.content.title + '</div>' +
                options +
                '</div>' +
                '</div>';
            break;
        case 2:
            question_type[2] = true;

            // 多选题
            break;
        case 3:
            question_type[3] = true;

            // 填空题
            break;
        default:
            break;
    }
    return html;
}

function generate_answer(data) {
    var html = '';
    question_id += 1;
    //console.log(data);
    switch (data.type) {
        case 1:
            question_type[1] = true;
            // 单选题
            var options = '';
            for (var i = 0; i < data.content.options.length; ++i) {
                if (data.answer.correctId == data.content.options[i].id) {
                    options += '<div class="select-option option-selected" value="' + data.content.options[i].id + '">' + String.fromCharCode(0x41 + i) + '. ' + data.content.options[i].content + '</div>'

                }
                else {
                    if (id2answer[data.questionId].correctId == data.content.options[i].id) {
                        options += '<div class="select-option wrong-answer" value="' + data.content.options[i].id + '">' + String.fromCharCode(0x41 + i) + '. ' + data.content.options[i].content + '</div>'
                    }
                    else {
                        options += '<div class="select-option" value="' + data.content.options[i].id + '">' + String.fromCharCode(0x41 + i) + '. ' + data.content.options[i].content + '</div>'
                    }

                }
            }
            var res = '';
            if (id2answer[data.questionId].correctId == data.answer.correctId) {
                // 表示回答正确
                res = '<img src="../../../assets/img/student/tasks/right.png" alt="">';
            }
            else {
                // 回答错误
                res = '<img src="../../../assets/img/student/tasks/wrong.png" alt="">';
            }
            html = '<div class="question" value="' + data.questionId + '">' +
                '<div class="question-res">' +
                res +
                '</div>' +
                '<div class="question-content">' +
                '<div class="question-q">' + question_id.toString() + '. ' + data.content.title + '</div>' +
                options +
                '<div class="answer">' +
                '<div class="answer-analysis">解析：<br />' + data.answer.reason + '</div><div class="true-answer">正确答案<br />' + String.fromCharCode(0x40 + data.answer.correctId) +'</div><div></div>' +
                '</div>' +
                '</div>' +
                '</div>';
            break;
        case 2:
            question_type[2] = true;

            // 多选题
            break;
        case 3:
            question_type[3] = true;

            // 填空题
            break;
        default:
            break;
    }
    return html;
}

function load_questions(exam_id) {
    // 加载一次考试的题目，首先看学生是否做过
    init_value();
    var user_id;
    if ($.getUrlParam('student_id') == null) {
        user_id = getCookie('USER');
    }
    else {
        user_id = $.getUrlParam('student_id');
    }
    $.ajax({
        xhrFields: {
            withCredentials: true
        },
        type: 'get',
        url: URL_BASE + '/tasks/web/exam/' + exam_id + '/result',
        data: {
            userId: user_id
        },
        success: function (data) {
            if (data.hasResult) {
                // 已经做过这次测试，则加载结果
                // my_tip.alert('已经做过了！');
                var i = 0;
                for (i = 0; i < data.examRecord.answer.length; ++i) {
                    id2answer[data.examRecord.answer[i].questionId] = data.examRecord.answer[i].answer;
                }
                for (i = 0; i < data.questions.length; ++i) {
                    questions[data.questions[i].type].push(data.questions[i]);
                }
                for (i = 1; i <= 3; ++i) {  // 遍历三个类别，i代表类别
                    var html = '';
                    for (var j = 0; j < questions[i].length; ++j) {
                        html += generate_answer(questions[i][j]);
                    }
                    if (question_type[i]) {
                        $('#question_type_' + i.toString()).append(html).removeClass('hide');
                    }
                }
                // 加载成绩环的回调函数
                if (typeof load_answer_cb != 'undefined') {
                    load_answer_cb(data.examRecord.score / 100);
                }
            }
            else {
                // 没有做过这次测试，加载题目
                // my_tip.alert('没有做过！');
                $.ajax({
                    xhrFields: {
                        withCredentials: true
                    },
                    type: 'get',
                    url: URL_BASE + '/tasks/web/exam/' + exam_id + '/question/list',
                    success: function (data) {
                        var i = 0;
                        for (i = 0; i < data.length; ++i) {
                            questions[data[i].type].push(data[i]);
                        }
                        for (i = 1; i <= 3; ++i) {  // 遍历三个类别，i代表类别
                            var html = '';
                            for (var j = 0; j < questions[i].length; ++j) {
                                html += generate_question(questions[i][j]);
                            }
                            if (question_type[i]) {
                                $('#question_type_' + i.toString()).append(html).removeClass('hide');
                            }
                        }
                        $('#test_submit').removeClass('hide');
                    },
                    error: error_handler()
                });
            }
        },
        error: error_handler()
    });
}


function load_exam() {
    // 加载书本内容
    $.ajax({
        xhrFields: {
            withCredentials: true
        },
        type: 'get',
        url: URL_BASE + '/books/web/book/' + $.getUrlParam('book_id'),
        success: function (data) {
            $('#book_name').html(data.name);
        },
        error: error_handler()
    });

//    先加载这本书有哪些题目
    $.ajax({
        xhrFields: {
            withCredentials: true
        },
        type: 'get',
        url: URL_BASE + '/tasks/web/exam/book/' + $.getUrlParam('book_id') + '/list',
        success: function (data) {
            var html = '';
            for (var i = 0; i < data.length; ++i) {
                html += '<option value="' + data[i].id + '">' + data[i].name + '</option>'
                // EXAM_STATUS[data[i].id] =
            }

            if (data[0] == undefined) {
                // my_tip.alert('暂无题目');
                $('#chapter_selector').html('<option>暂无测试题</option>')
            }
            else {
                $('#chapter_selector').html(html).change(function () {
                    load_questions($(this).val());
                });
                var exam_id = data[0].id;
                // 默认加载第一次的测试题
                load_questions(exam_id);
            }
        }
    });
//

}

function select_option(e) {
    $(e).siblings().removeClass('option-selected');
    $(e).addClass('option-selected');
    var id = $(e).parent().parent().attr('value');
    question_answer[id].answer = {correctId: $(e).attr('value')};
}

// 提交题目答案
$('#test_submit').click(function () {
    var res = [];
    for (var key in question_answer) {
        if (question_answer[key].answer == null) {
            my_tip.alert('请完成所有题目再提交！');
            return;
        }
        else {
            res.push(question_answer[key]);
        }
    }
    console.log(res);
    $.ajax({
        xhrFields: {
            withCredentials: true
        },
        type: 'post',
        url: URL_BASE + '/tasks/web/exam/' + $('#chapter_selector').val() + '/record',
        contentType: 'application/json',
        data: JSON.stringify(res),
        success: function(data) {
            my_tip.alert('提交成功！');
            load_questions($('#chapter_selector').val());
        },
        error: ajax_error_handler
    });
});

