/**
 * Created by wind on 2016/10/10.
 */

// 左右导航栏的回调函数
function left_bar_cb() {
    $('#tasks_button').attr('class', 'side-button-selected left-side-button');
}

var button_ids = ['intro', 'comment', 'note'];

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
    window.open('reading.html?book_id=' + $.getUrlParam('book_id') + '&task_id=' + $.getUrlParam('task_id'), '_self');
});

$('#offline_read').click(function () {
    window.open('read_offline.html?book_id=' + $.getUrlParam('book_id') + '&task_id=' + $.getUrlParam('task_id'), '_self');
});

function load_page() {
    var id = $.getUrlParam('book_id');
    if (id == null) {
        // 如果url中没有给id，应该导向别的页面
        // my_tip.alert('gaga');
    }
    $.ajax({
        xhrFields: {
            withCredentials: true
        },
        type: 'GET',
        url: URL_BASE + '/books/web/book/' + id,
        success: function(data) {
            // my_tip.alert(data.id);
            fill_data(data);
        },
        error: ajax_error_handler
    });
    $.ajax({
        type: 'GET',
        xhrFields: {
            withCredentials: true
        },
        url: URL_BASE + '/tasks/web/task/' + $.getUrlParam('task_id'),
        success: function (data) {
            if (data.status == 3) {
                $('#offline_read').html('继续线下阅读');
                $('#online_read').html('转线上阅读');
            }
        },
        error: ajax_error_handler
    });
}
