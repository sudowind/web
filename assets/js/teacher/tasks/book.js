/**
 * Created by wind on 2016/10/27.
 */
function left_bar_cb() {
    $('#tasks_button').attr('class', 'side-button-selected left-side-button');
}

function init() {
    for (var i = 0; i <= 10; ++i) {
        load_table_line('#row' + i.toString());
    }
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

var ELEM_PER_PAGE = 10;
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
            if (!has_load_page) {
                has_load_page = true;
                var page_count = Math.ceil((data.length * 1.0) / ELEM_PER_PAGE);
                console.log(page_count);
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

function init_class() {
    $.ajax({
        xhrFields: {
            withCredentials: true
        },
        type: 'get',
        url: URL_BASE + '/users/web/class/teacher/current/list',
        success: function(data) {
            var html = '<td>所带班级：</td><td>';
            var index = 'index';
            var class_id;
            for (var i = 0; i < data.length; ++i) {
                if (data[i].id != $.getUrlParam('class_id'))
                    index = '';
                else {
                    index = 'index';
                    class_id = data[i].id;
                }
                html += '<span class="' + index + ' option" value="' + data[i].id + '">' + data[i].name + '</span>';
            }
            html += '</td>';
            $('.classes-part table tr').html(html);
            $('.option').click(function () {
                $(this).siblings().removeClass('index');
                $(this).addClass('index');
                clear_rows();
                has_load_page = false;
                load_student_info($(this).attr('value'), 1);
                // load_tasks($(this).attr('value'), 1);
            });
            load_student_info(class_id, 1);
        }
    });
}