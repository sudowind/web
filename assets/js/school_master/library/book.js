/**
 * Created by wind on 2016/10/27.
 */
//简介与评论之间的tab切换函数

function left_bar_cb() {
    $('#library_button').attr('class', 'side-button-selected left-side-button');
}

var button_ids = ['intro', 'comment', 'student'];

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
    window.open('reading.html?book_id=' + $.getUrlParam('book_id'), '_self');
});

function clear_rows() {
    for (var i = 0; i < 10; ++i) {
        $('#row' + i.toString()).html('');
    }
    $('#read_count').find('span').html('0');
}

var ELEM_PER_PAGE = 8;
var has_load_page = false;
function load_student_info(class_id, teacher_id, page) {
    clear_rows();
    $.ajax({
        xhrFields: {
            withCredentials: true
        },
        type: 'get',
        url: URL_BASE + '/tasks/web/task/teacher/' + teacher_id + '/' + $.getUrlParam('book_id') + '/list',
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
                console.log(page_count);
                $('#student_pagination').createPage({
                    pageCount: page_count,
                    current: 1,
                    backFn: function(p) {
                        load_student_info(class_id, teacher_id, p);
                    }
                });
            }
        }
    })
}

function load_teacher(class_id) {
    clear_rows();
    $.ajax({
        xhrFields: {
            withCredentials: true
        },
        type: 'get',
        url: URL_BASE + '/users/web/class/{0}/teachers'.format(class_id),
        success: function (data) {
            var teacher_html = '';
            for (var i = 0; i < data.length; ++i) {
                teacher_html += '<option value="{0}">{1}</option>'.format(data[i].id, data[i].name);
            }
            $('#teacher_selector').html(teacher_html).unbind().change(function () {
                has_load_page = false;
                load_student_info(class_id, $(this).val(), 1);
            });
            if (data.length > 0)
                load_student_info(class_id, data[0].id, 1);
        },
        error: ajax_error_handler
    });
}

function load_class(grade) {
    clear_rows();
    $('#teacher_selector').html('<option></option>');
    $.ajax({
        xhrFields: {
            withCredentials: true
        },
        type: 'get',
        url: URL_BASE + '/users/web/class/grade/{0}/list'.format(grade),
        success: function (data) {
            var class_html = '';
            for (var i = 0; i < data.length; ++i) {
                class_html += '<option value="{0}">{1}</option>'.format(data[i].id, data[i].name);
            }
            $('#class_selector').html(class_html).unbind().change(function () {
                has_load_page = false;
                $('#teacher_selector').html('');
                load_teacher($(this).val());
            });
            if (data.length > 0)
                load_teacher(data[0].id);
        },
        error: ajax_error_handler
    });
}

function init_class() {
    clear_rows();
    var date = new Date();
    var base_year = 1900 - 6 + date.getYear();
    if (date.getMonth() >= 7) {
        base_year += 1;
    }
    var html = '';
    var gn = ['一年级', '二年级', '三年级', '四年级', '五年级', '六年级'];
    for (var i = 0; i < 6; ++i) {
        html += '<option value="{0}">{1}</option>'.format((base_year + i).toString(), gn[i]);
    }
    $('#grade_selector').html(html).unbind().change(function () {
        $('#class_selector').html('<option></option>');
        load_class($(this).val());
    });
    // load_class(base_year);

}