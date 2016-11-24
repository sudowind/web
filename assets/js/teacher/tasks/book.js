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
    var number = data.user.id;
    var percentage = data.currentPage * 100.0 / data.totalPage;
    var grade = 90;
    var note_count = data.noteCount;
    $(row_selector).load('../../../include/html/teacher/task_student_table_line.html', function () {
        $(row_selector + ' .student-number').html(number);
        $(row_selector + ' .student-name').html(name);
        $(row_selector + ' .grade').html(grade.toString() + '分');
        $(row_selector + ' .note-count').html(note_count.toString() + '条');
        $(row_selector + ' .progress div').css('width', percentage.toString() + '%');
        $(row_selector + ' .progress-message').html('进度' + percentage + '%');
    });
}

function clear_rows() {
    for (var i = 1; i <= 10; ++i) {
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
        url: URL_BASE + '/tasks/web/task/teacher/current/' + $.getUrlParam('book_id') + '/list',
        data: {
            classId: class_id,
            page: page - 1,
            itemPerPage: 10
        },
        success: function (data) {
            for (var i = 0; i < data.data.length; ++i) {
                load_table_line('#row' + i.toString(), data.data[i]);
            }
            if (!has_load_page) {
                has_load_page = true;
                var page_count = Math.ceil((data.totalItem * 1.0) / data.itemPerPage);
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
            var html = '<p>所带班级：</p>';
            var index = 'index';
            var class_id;
            for (var i = 0; i < data.length; ++i) {
                if (i != 0)
                    index = '';
                else {
                    class_id = data[i].schoolId;
                }
                html += '<span class="' + index + ' option" value="' + data[i].schoolId + '">' + data[i].name + '</span>';
            }
            $('.classes-part').html(html);
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