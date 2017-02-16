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
    window.open('reading.html?book_id=' + $.getUrlParam('book_id'), '_self');
});

//左上角info
(function init() {
    var join_class = function () {
        $('#join_class_modal').find('.modal-info div:nth-child(5)').html('');
        $('#join_class_modal').modal('show');
    };

    $('.info-class').click(join_class);
    $('.no-top-list .btn').click(join_class);

    $('#send_apply').click(function () {
        var join_code = $('#class_code').val();
        console.log(join_code);
        if (join_code == '')
            return;
        var error_message = $('#join_class_modal').find('.modal-info div:nth-child(5)');
        //检查班级code是否有效
        $.ajax({
            xhrFields: {
                withCredentials: true
            },
            type: 'post',
            url: URL_BASE + '/users/web/join/checkClassJoinCode',
            data: {
                joinCode: join_code
            },
            success: function (data) {
                error_message.html('&nbsp;');
                $.ajax({
                    xhrFields: {
                        withCredentials: true
                    },
                    type: 'post',
                    url: URL_BASE + '/users/web/join/studentJoinClass',
                    data: {
                        joinCode: join_code
                    },
                    success: function (data) {
                        $('#join_class_modal').modal('hide');
                        my_tip.alert('你的加入班级申请已发送，老师审核通过后即可加入班级');
                        check_join_status();
                    },
                    error: error_handler()
                });
            },
            error: error_handler({400: function () {
                error_message.html('班级代码错误，请核对');
            }})
        });

    })

})();
//首页头像更新
function load_info(){
    $.ajax({
        xhrFields: {
            withCredentials: true
        },
        type: 'GET',
        url: URL_BASE + '/users/web/user/current',
        success: function(data) {
            //console.log(data);
            $(".head-img img").attr('src',data.headimg);
            $('.name').html(data.name);
            $('.info-name').html(data.name);
            $('.info-account').append(data.account);
            $('.info-school').html(data.school.name);
            $('.modal-avatar img').attr('src', data.headimg);
            if (data.schoolClass) {
                // 如果有班级
                $('.info-class').html(data.schoolClass.name).off('click').css('cursor', 'text');
                $('.top-list').show();
                $('.no-top-list').hide();
            }
        },
        error: error_handler()
    });
}

function check_join_status() {
    $.ajax({
        xhrFields: {
            withCredentials: true
        },
        type: 'get',
        url: URL_BASE + '/users/web/join/checkJoinClassRequest',
        success: function (data) {
            console.log(data)
            // 应该是两种状态：有 无
            var flag = data.hasRequest;
            if (flag) {
                // 正在审核
                $('.top-list').hide();
                $('.no-top-list').show();
                $('.info-class').html('加入班级<span style="color: #3c97cf">审核中</span>');
                $('.no-top-list .btn').html('正在审核').addClass('disabled');
            }
        },
        error: error_handler()
    });
}