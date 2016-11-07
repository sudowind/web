///**
// * Created by wind on 2016/10/10.
// */
//function submit_comment() {
//    // alert($('#user_comment').val());
//    $('#myModal').modal('show');
//    setTimeout(function(){ $('#myModal').modal('hide'); }, 1000);
//};
////简介与评论之间的tab切换函数
//function tab_comment(){
//    $('.book-comment').css("display","none");
//    $('.book-detail-content').css("display","block");
//    $('.nav-button').css("background","#fb9e1d");
//    $('.nav-button-two').css("background","#fff");
//    $('.comments').css("color","#000000");
//    $('.introduce').css("color","#ffffff");
//    $('.nav-button img').attr("src","../../../assets/img/student/book/intro_selected.png");
//    $('.nav-button-two img').attr("src","../../../assets/img/student/book/comment_unselected.png");
//
//}
//function tab_introduce(){
//    $('.book-comment').css("display","block");
//    $('.book-detail-content').css("display","none");
//    $('.nav-button').css("background","#fff");
//    $('.nav-button-two').css("background","#fb9e1d");
//    $('.comments').css("color","#ffffff");
//    $('.introduce').css("color","#000000");
//    $('.nav-button img').attr("src","../../../assets/img/student/book/intro_unselected.png");
//    $('.nav-button-two img').attr("src","../../../assets/img/student/book/comment_selected.png");
//}
////添加书库之后确认日期的点击事件
//$('.modal-footer .btn').one("click",function(){
//    $('#myModal').modal('hide');
//    $(".book-image .btn").html("已添加“阅读任务”");
//
//});
//

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

$('#add_to_task').click(function () {

    $.ajax({
        xhrFields: {
            withCredentials: true
        },
        type: 'POST',
        url: 'http://debian8-01.internal.enjoyreading.com:8083/tasks/web/task',
        data: JSON.stringify({bookId: $.getUrlParam('book_id'), startTime: -1, endTime: -1}),
        // dataType: "json",
        contentType: "application/json",
        success: function (data) {
            $('#add_to_task').html('已添加到“阅读任务”');
        }
    });

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
        url: 'http://debian8-01.internal.enjoyreading.com:8081/books/web/book/' + id,
        success: function(data) {
            // my_tip.alert(data.id);
            fill_data(data);
        }
    });
}