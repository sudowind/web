/**
 * Created by wind on 2016/10/27.
 */
function left_bar_cb() {
    $('#tasks_button').attr('class', 'side-button-selected left-side-button');
}

var button_ids = ['intro', 'comment', 'student', 'test'];
function on_button_click(e) {
    //alert($(e).attr('id'));
    if ($(e).attr('value') == '0') {
        for (var i = 0; i < button_ids.length; ++i) {
            var curr_id = button_ids[i] + '_button';
            if (curr_id != $(e).attr('id')) {
                $('#'+ curr_id).css('color', '#000000').attr('value', '0').css('background', '#f9f9f9');
                $('#'+ curr_id + ' img').attr('src', '../../../assets/img/student/book/' + button_ids[i] + '_unselected.png');
                $('#' + button_ids[i] + '_part').css('display', 'none');
            }
            else {
                $('#'+ curr_id).css('color', '#ffffff').attr('value', '1').css('background', '#fb9e1d');
                $('#'+ curr_id + ' img').attr('src', '../../../assets/img/student/book/' + button_ids[i] + '_selected.png');
                $('#' + button_ids[i] + '_part').css('display', 'block');
            }
        }
    }
}

function init() {
    load_student_info($.getUrlParam('class_id'), 1);
}

function load_table_line (row_selector, data) {
    var name = data.user.name;
    var account = data.user.account;
    var number = data.user.id;
    var percentage = Math.ceil(data.currentPage * 100.0 / data.totalPage);
    var grade = Math.round(data.examScore * 100, 0);
    if (grade < 0)
        grade = '未做测试';
    else
        grade = grade.toString() + '分';
    var note_count = data.noteCount;
    var task_id = data.id;
    $(row_selector).load('../../../include/html/teacher/task_student_table_line.html', function () {
        $(row_selector + ' .student-number').html(account);
        $(row_selector + ' .student-name').html(name);
        $(row_selector + ' .grade').html(grade);
        $(row_selector + ' .note-count').html(note_count.toString() + '条');
        $(row_selector + ' .progress div').css('width', percentage.toString() + '%');
        $(row_selector + ' .progress-message').html('进度' + percentage + '%');
        $(row_selector + ' .go-detail').click(function() {
            window.open('../report/detail.html?book_id=' + $.getUrlParam('book_id') + '&student_id=' + number + '&task_id=' + task_id, '_self');
        });
    });
}

function clear_rows() {
    for (var i = 0; i < 10; ++i) {
        $('#row' + i.toString()).html('');
    }
}

var has_load_page = false;
function load_student_info(class_id, page) {
    clear_rows();
    $.ajax({
        xhrFields: {
            withCredentials: true
        },
        type: 'get',
        url: URL_BASE + '/tasks/web/task/teacher/' + $.getUrlParam('teacher_id') + '/' + $.getUrlParam('book_id') + '/list',
        data: {
            classId: $.getUrlParam('class_id')
        },
        success: function (data) {
            var start_id = (page - 1) * 10;
            var end_id = start_id + 10;
            if (end_id > data.length)
                end_id = data.length;
            for (var i = 0; i < end_id - start_id; ++i) {
                load_table_line('#row' + i.toString(), data[start_id + i]);
            }
            if (!has_load_page) {
                has_load_page = true;
                var page_count = Math.ceil((data.length * 1.0) / 10);
                $('#teacher_task_pagination').createPage({
                    pageCount: page_count,
                    current: 1,
                    backFn: function(p) {
                        load_student_info(class_id, p);
                    }
                });
            }
        }
    })
}