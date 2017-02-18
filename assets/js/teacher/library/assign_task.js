/**
 * Created by wind on 2016/10/27.
 */
function left_bar_cb() {
    $('#library_button').attr('class', 'side-button-selected left-side-button');
}

function init() {
    init_class();
}


function on_single_select_click(e) {
    if ($(e).attr('value') == '1') {
        $(e).attr('src', '../../../assets/img/teacher/single_unselected.png');
        $(e).attr('value', '0');
        $('#total_selector').attr('src', '../../../assets/img/teacher/total_unselected.png').attr('value', '0');
    }
    else {
        $(e).attr('src', '../../../assets/img/teacher/single_selected.png');
        $(e).attr('value', '1');
    }
}

$('#total_selector').click(function () {
    if ($(this).attr('value') == '1') {
        $('.single-select').attr('src', '../../../assets/img/teacher/single_unselected.png').attr('value', '0');
        $(this).attr('src', '../../../assets/img/teacher/total_unselected.png');
        $(this).attr('value', '0');
    }
    else {
        $('.single-select').attr('src', '../../../assets/img/teacher/single_selected.png').attr('value', '1');
        $(this).attr('src', '../../../assets/img/teacher/total_selected.png');
        $(this).attr('value', '1');
    }
});

$('#confirm_button').click(function () {
    var elements = $('.single-select');
    var selected_student = [];
    for (var i = 0; i < elements.length; ++i) {
        if ($(elements[i]).attr('value') == '1') {
            selected_student.push($(elements[i]).attr('student_id'));
        }
    }
    var start_time = new Date($('#start_date').val());
    var end_time = new Date($('#end_date').val());
    var book_id = $.getUrlParam('book_id');
    var class_id = $('#class_selector').val();
    if (selected_student.length > 0 && $('#start_date').val() && $('#end_date').val()) {
        if (start_time.getTime() >= end_time.getTime()) {
            my_tip.alert('请确保结束时间晚于开始时间！');
            return;
        }
        // alert(selected_student);
        // my_tip.alert('已将《鸭子骑车记》添加到2015级4班、2013级3班的阅读任务中!');
        $.ajax({
            xhrFields: {
                withCredentials: true
            },
            type: 'post',
            url: URL_BASE + '/tasks/web/task/teacher/current?bookId=' + book_id +
                '&classId=' + class_id +
                '&startTime=' + start_time.getTime() +
                '&endTime=' + end_time.getTime(),
            contentType: 'application/json',
            data: JSON.stringify(selected_student),
            success: function () {
                load_student_info(class_id);
                my_tip.alert('任务布置成功！');
            }
        });
    }
    else if (selected_student.length > 0){
        my_tip.alert('请填写开始时间和结束时间！');
    }
    else {
        my_tip.alert('请选择要分配的学生！');
    }
});


function clear_rows() {
    $('#table_content').find('table tbody').html('');
}

var class_id2name = {};
function load_student_info(class_id) {
    // 初始化分配任务表格
    clear_rows();
    $.ajax({
        xhrFields: {
            withCredentials: true
        },
        type: 'get',
        url: URL_BASE + '/tasks/web/task/teacher/current/' + $.getUrlParam('book_id') + '/list/all',
        data: {
            classId: class_id
        },
        success: function(data) {
            var html = '';
            var finish_count = 0;
            for (var i = 0; i < data.length; ++i) {
                var progress_html = '';
                if (data[i].status == 1) {
                    progress_html = '<td class="progress-part">未布置任务</td>' +
                        '<td><img src="../../../assets/img/teacher/single_unselected.png" alt="" class="single-select" onclick="on_single_select_click(this)" value="0" student_id="' + data[i].user.id + '"></td></tr>';
                }
                else {
                    if (data[i].status == 4) {
                        finish_count += 1;
                    }
                    var percent = Math.ceil(data[i].currentPage * 100.0 / data[i].totalPage);
                    progress_html = '<td class="progress-part">' +
                        '<div class="progress-wrapper">' +
                        '<div class="progress">' +
                        '<div class="progress-bar progress-bar-striped active" role="progressbar" aria-valuenow="45" aria-valuemin="0" aria-valuemax="100" style="width: ' + percent + '%">' +
                        '<span class="sr-only">' + percent + '% Complete</span>' +
                        '</div>' +
                        '</div>' +
                        '<div class="progress-message percent">进度' + percent + '%</div>' +
                        '</div>' +
                        '<!--<div class="progress-message page">200页/200页</div>-->' +
                        '</td><td><img src="../../../assets/img/teacher/single_unselected.png" alt="" class="single-select" onclick="on_single_select_click(this)" value="0" student_id="' + data[i].user.id + '"></td>';
                }
                html += '<tr><td>' + class_id2name[class_id] + '</td>' +
                    '<td>' + data[i].user.name + '</td>' +
                    // '<td>' + rand_ER() + '</td>' +
                    progress_html;
            }
            $('#table_content').find('table tbody').html(html);
            $('#finish_count').find('span').html(finish_count.toString());
        }
    });
}

function init_class() {
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
                class_id2name[data[i].id] = data[i].name;
                html += '<option value="' + data[i].id + '">' + data[i].name + '</option>';
            }
            $('#class_selector').html(html).change(function() {
                load_student_info($(this).val());
            });
            // $('#grade_selector').html(html).change(function() {
            //     // alert($(this).val());
            //     clear_rows();
            //     has_load_page = false;
            //     load_student_info($(this).val(), 1);
            // });
            //
            //
            load_student_info(class_id);
        }
    });
}