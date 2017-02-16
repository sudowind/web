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
            // if (data.status == 3) {
            //     $('#offline_read').html('继续线下阅读');
            //     $('#online_read').html('转线上阅读');
            // }
            var online_text = '';
            var offline_text = '';
            switch (data.onlineStatus) {
                case -1:
                    offline_text = '开始线下阅读';
                    online_text = '开始线上阅读';
                    break;
                case 1:
                    offline_text = '转线下阅读';
                    online_text = '继续线上阅读';
                    break;
                case 2:
                    offline_text = '继续线下阅读';
                    online_text = '转线上阅读';
                    break;
            }
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
                    if (data.status == 'empty') {
                        online_text = '暂无线上资源';
                        $('#online_read').addClass('disabled');
                    }
                    $('#offline_read').html(offline_text);
                    $('#online_read').html(online_text);
                }
            });
        },
        error: error_handler()
    });
}


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
