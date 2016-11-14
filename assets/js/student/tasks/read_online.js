/**
 * Created by wind on 2016/10/10.
 */

// 左右导航栏的回调函数
function left_bar_cb() {
    $('#tasks_button').attr('class', 'side-button-selected left-side-button');
}

function submit_comment() {
    // alert($('#user_comment').val());
    $('#myModal').modal('show');
    setTimeout(function(){ $('#myModal').modal('hide'); }, 1000);
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

$('#offline_read').click(function () {
    window.open('read_offline.html?book_id=' + $.getUrlParam('book_id') + '&task_id=' + $.getUrlParam('task_id'), '_self');
});


function submit_note() {

}

$('#user_note').bind('input propertychange', function () {
    if ($(this).val().length > 0) {
        $('#submit_note').removeClass('disabled button-disabled').addClass('button-able');
    }
    else {
        $('#submit_note').addClass('disabled button-disabled').removeClass('button-able');
    }
});

function fill_data(data) {
    $('#book_name').find('h3 b').html(data.name);
    $('#display_type').html(data.displayType);
    $('#author').html(data.author);
    $('#publisher').html(data.publisher);
    $('#word_count').html(data.wordCount);
    $('#isbn').html(data.isbn);
    $('#grade').html(data.grade);
    $('#intro_part').html(data['introduction']);
}

function load_page() {
    var id = $.getUrlParam('book_id');
    if (id == null) {
        // 如果url中没有给id，应该导向别的页面
        // my_tip.alert('gaga');
    }
    $.ajax({
        type: 'GET',
        url: URL_BASE + '/books/web/book/' + id,
        success: function(data) {
            // my_tip.alert(data.id);
            fill_data(data);
        }
    });
}




