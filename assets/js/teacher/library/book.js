/**
 * Created by wind on 2016/10/27.
 */
//简介与评论之间的tab切换函数

function left_bar_cb() {
    $('#library_button').attr('class', 'side-button-selected left-side-button');
}

var button_ids = ['intro', 'comment', 'test', 'student'];

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
    // for (var i = 0; i <= 8; ++i) {
    //     load_table_line('#row' + i.toString());
    // }
    init_class();
    $.ajax({
        xhrFields: {
            withCredentials: true
        },
        type: 'get',
        url: URL_BASE + '/books/web/book/{0}/content'.format($.getUrlParam('book_id')),
        data: {
            page: 0
        },
        success: function (data) {

            if (data.status == 'empty') {
                $('#online_read').html('暂无线上资源').addClass('disabled');
            }
        },
        error: error_handler()
    })
}

function load_table_line (row_selector, data) {
    var name = data.user.name;
    var number = data.user.id;
    var percentage = Math.ceil(data.currentPage * 100.0 / data.totalPage);
    var grade = 90;
    var note_count = data.noteCount;
    var task_id = data.id;
    $(row_selector).load('../../../include/html/teacher/task_student_table_line.html', function () {
        $(row_selector + ' .student-number').html(number);
        $(row_selector + ' .student-name').html(name);
        $(row_selector + ' .grade').html(grade.toString() + '分');
        $(row_selector + ' .note-count').html(note_count.toString() + '条');
        $(row_selector + ' .progress div').css('width', percentage.toString() + '%');
        $(row_selector + ' .progress-message').html('进度' + percentage + '%');
        $(row_selector + ' .go-detail').click(function() {
            window.open('../report/detail.html?book_id=' + $.getUrlParam('book_id') + '&student_id=' + number + '&task_id=' + task_id, '_self');
        });
    });
}

$('#add_to_task').click(function() {
    window.open('assign_task.html?book_id=' + $.getUrlParam('book_id'), '_self');
});
$('#online_read').click(function() {
    window.open('../../reading_v1.0.1.html?book_id=' + $.getUrlParam('book_id'), '_self');
});

function clear_rows() {
    for (var i = 0; i < 10; ++i) {
        $('#row' + i.toString()).html('');
    }
}

var ELEM_PER_PAGE = 8;
var has_load_page = false;
function load_student_info(class_id, page) {
    clear_rows();
    $.ajax({
        xhrFields: {
            withCredentials: true
        },
        type: 'get',
        url: URL_BASE + '/tasks/web/task/teacher/current/' + $.getUrlParam('book_id') + '/list',
        data: {
            classId: class_id
        },
        success: function (data) {
            var start_id = (page - 1) * ELEM_PER_PAGE;
            var end_id = start_id + ELEM_PER_PAGE;
            if (end_id > data.length)
                end_id = data.length;
            for (var i = 0; i < end_id - start_id; ++i) {
                load_table_line('#row' + i.toString(), data[start_id + i]);
            }
            var finish_count = 0;
            for (var i = 0; i < data.length; ++i) {
                if (data[i].status == 4) {
                    finish_count += 1;
                }
            }
            $('#read_count').find('span').html(finish_count.toString());
            if (!has_load_page) {
                has_load_page = true;
                var page_count = Math.ceil((data.length * 1.0) / ELEM_PER_PAGE);
                $('#student_pagination').createPage({
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

function init_class() {
    // 初始化班级option
    $.ajax({
        xhrFields: {
            withCredentials: true
        },
        type: 'get',
        url: URL_BASE + '/users/web/class/teacher/current/list',
        success: function(data) {
            var html = '';
            var index = 'index';
            var class_id;
            for (var i = 0; i < data.length; ++i) {
                if (i != 0)
                    index = '';
                else {
                    class_id = data[i].id;
                }
                html += '<option value="' + data[i].id + '">' + data[i].name + '</option>';
            }
            $('#grade_selector').html(html).change(function() {
                // alert($(this).val());
                clear_rows();
                has_load_page = false;
                load_student_info($(this).val(), 1);
            });


            load_student_info(class_id, 1);
        }
    });
}