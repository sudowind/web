/**
 * Created by wind on 2016/10/10.
 */

// 左右导航栏的回调函数
function left_bar_cb() {
    $('#tasks_button').attr('class', 'side-button-selected left-side-button');
}

var button_ids = ['intro', 'comment', 'note'];
var today_start_at = 0;

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

//添加书库之后确认日期的点击事件
$('.modal-footer .btn').one("click",function(){
    $('#myModal').modal('hide');
    $(".book-image .btn").html("已添加“阅读任务”");

});

$('#online_read').click(function () {
    $.ajax({
        url: URL_BASE + '/tasks/web/task/student/current/{0}/onlineStatus'.format($.getUrlParam('task_id')),
        type: 'put',
        xhrFields: {
            withCredentials: true
        },
        data: {
            isOnline: true
        },
        success: function () {
            window.open('../../reading_v1.0.1.html?book_id=' + $.getUrlParam('book_id') + '&task_id=' + $.getUrlParam('task_id'), '_self');
        },
        error: error_handler()
    });
<<<<<<< HEAD
    //判断书籍类型
    $.ajax({
        url: URL_BASE + '/books/web/book/{0}/content'.format($.getUrlParam('book_id')),
        xhrFields: {
            withCredentials: true
        },
        type: 'get',
        data: {
            page: 0
        },
        success: function (data) {
            if (data.status == 'withTxt') {
                window.open('../../reading_v1.0.1.html?book_id=' + $.getUrlParam('book_id') + '&task_id=' + $.getUrlParam('task_id'), '_self');
            } else if(data.status == 'withPdf'){
                window.open('../../reading_pdf_v1.0.1.html?book_id=' + $.getUrlParam('book_id') + '&task_id=' + $.getUrlParam('task_id'), '_self');
            }
        }
    });
=======
>>>>>>> 1e156f581b77f49ff8cdf5c197e5a63eda7a9234
});

$('#user_note').bind('input propertychange', function () {
    if ($(this).val().length > 0) {
        $('#submit_note').removeClass('disabled button-disabled').addClass('button-able');
    }
    else {
        $('#submit_note').addClass('disabled button-disabled').removeClass('button-able');
    }
});

$('#record_button').click(function () {

    if ($('#start_read_time').val() && $('#finish_read_time').val() && $('#today_page').val()) {

        var start_time = new Date();
        var start_time_array = $('#start_read_time').val().split(':');
        start_time.setHours(start_time_array[0]);
        start_time.setMinutes(start_time_array[1]);
        start_time.setSeconds(0);
        var start_time_stamp = start_time.setMilliseconds(0);
        // var start_time_stamp = start_time.setMinutes(start_time_array[1]);
        var end_time = new Date();
        var end_time_array = $('#finish_read_time').val().split(':');
        end_time.setHours(end_time_array[0]);
        end_time.setMinutes(end_time_array[1]);
        end_time.setSeconds(0);
        var end_time_stamp = end_time.setMilliseconds(0);
        // var end_time_stamp = end_time.setMinutes(end_time_array[1]);
        var curr_page = $('#today_page').val();

        if (Number(curr_page) > Number($('#page_count').html().split('&nbsp;')[2])) {
            my_tip.alert('填写页码数不能超过本书总页码数!');
            return;
        }

        if (start_time_stamp > end_time_stamp) {
            my_tip.alert('开始阅读时间必须小于结束阅读时间！');
            return;
        }

        if (Number(curr_page) <= today_start_at) {
            my_tip.alert('阅读页码应大于起始阅读页码');
            return;
        }

        $.ajax({
            xhrFields: {
                withCredentials: true
            },
            type: 'POST',
            url: URL_BASE + '/tasks/web/task/student/current/' + $.getUrlParam('task_id') + '/record',
            contentType: 'application/json',
            data: JSON.stringify({
                "createTime": 0,
                "currentPage": Number(curr_page),
                "endTime": end_time_stamp,
                "id": 0,
                "onlineStatus": "1",
                "startTime": start_time_stamp,
                "taskId": 0
            }),
            success: function () {
                // my_tip.alert('haha');
                load_progress();
                my_tip.alert('记录成功！');
            },
            error: error_handler({400: function(){
                my_tip.alert('阅读结束时间不能超过当前时间！');
            }})
        });
    }
    else {
        my_tip.alert('请填写阅读起始时间和阅读页码！');
    }
});

function load_progress() {
    var task_id = $.getUrlParam('task_id');
    if (task_id) {
        $.ajax({
            xhrFields: {
                withCredentials: true
            },
            type: 'GET',
            url: URL_BASE + '/tasks/web/task/' + task_id,

            success: function (data) {
                var curr_page = data.currentPage;
                var total_page = data.totalPage;
                var percent = Math.round(curr_page * 100.0 / total_page);
                $('.plan').find('span').html(percent);
                $('.progress-bar').css('width', percent.toString() + '%');
                $('#today_page').attr('placeholder', curr_page).attr('min', curr_page).attr('max', total_page).val(curr_page);
                today_start_at = curr_page;

            },
            error: error_handler()
        });
    }
}