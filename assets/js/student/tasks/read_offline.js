/**
 * Created by wind on 2016/10/10.
 */

// 左右导航栏的回调函数
function left_bar_cb() {
    $('#tasks_button').attr('class', 'side-button-selected left-side-button');
}

var button_ids = ['intro', 'comment', 'note'];

function on_button_click(e) {
    // alert($(e).attr('id'));
    if ($(e).attr('value') == '0') {
        for (var i = 0; i < button_ids.length; ++i) {
            var curr_id = button_ids[i] + '_button';
            if (curr_id != $(e).attr('id')) {
                $('#'+ curr_id + ' div').css('color', '#000000');
                $('#'+ curr_id).attr('value', '0').css('background', '#f9f9f9');
                $('#'+ curr_id + ' img').attr('src', '../../../assets/img/student/book/' + button_ids[i] + '_unselected.png');
                $('#' + button_ids[i] + '_part').css('display', 'none');
            }
            else {
                $('#'+ curr_id + ' div').css('color', '#ffffff');
                $('#'+ curr_id).attr('value', '1').css('background', '#fb9e1d');
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

$('#user_note').bind('input propertychange', function () {
    if ($(this).val().length > 0) {
        $('#submit_note').removeClass('disabled button-disabled').addClass('button-able');
    }
    else {
        $('#submit_note').addClass('disabled button-disabled').removeClass('button-able');
    }
});

$('.progress-input').bind('input propertychange', function () {
    // alert(1);
    if ($('#start_read_time').val() && $('#finish_read_time').val() && $('#today_page').val()) {
        $('#record_button').removeClass('disabled button-disabled').addClass('button-able');
    }
    else {
        $('#record_button').addClass('disabled button-disabled').removeClass('button-able');
    }
});


$('#record_button').click(function () {
    $('#alert_modal').modal('show');
});


