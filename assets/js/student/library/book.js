/**
 * Created by wind on 2016/10/10.
 */

// 左右导航栏的回调函数
function left_bar_cb() {
    $('#library_button').attr('class', 'side-button-selected left-side-button');
}

function submit_comment() {
    // alert($('#user_comment').val());
    $('#myModal').modal('show');
    setTimeout(function(){ $('#myModal').modal('hide'); }, 1000);
}

var button_ids = ['intro', 'comment'];

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
    $(".book-image .btn").html("已添加“阅读中心”");
});

$('#add_to_task').click(function () {

    $.ajax({
        xhrFields: {
            withCredentials: true
        },
        type: 'POST',
        url: URL_BASE + '/tasks/web/task/student/current',
        data: {bookId: $.getUrlParam('book_id')},
        success: function (data) {
            $('#add_to_task').html('已添加到“阅读中心”').addClass('disabled');
        },
        error: ajax_error_handler
    });

});
//在线阅读
$('#online_read').click(function() {
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
                window.open('../../reading_v1.0.1.html?book_id=' + $.getUrlParam('book_id'), '_self');
            } else if(data.status == 'withPdf'){
                window.open('../../reading_pdf_v1.0.1.html?book_id=' + $.getUrlParam('book_id'), '_self');
            }
        }
    });
});

$(document).ready(function () {
    $.ajax({
        type: 'GET',
        xhrFields: {
            withCredentials: true
        },
        url: URL_BASE + '/books/web/book/{0}/content'.format($.getUrlParam('book_id')),
        data: {
            bookId: Number($.getUrlParam('book_id')),
            page: 0
        },
        success: function (data) {
            var online_text = '在线阅读';
            if (data.status == 'empty') {
                online_text = '暂无线上资源';
                $('#online_read').addClass('disabled');
            }
            $('#online_read').html(online_text);
        }
    });
});