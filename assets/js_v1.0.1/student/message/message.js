/**
 * Created by yilong on 2017/1/17.
 */
//选择推荐阅读还是系统消息
$(".recommend_read_btn").on('click',function(){
    $(this).addClass('index');
    $(".system_message_btn").removeClass('index');
    $(".recommend_read").css('display','block');
    $(".system_message").css('display','none');
});
$(".system_message_btn").on('click',function(){
    $(this).addClass('index');
    $(".recommend_read_btn").removeClass('index');
    $(".recommend_read").css('display','none');
    $(".system_message").css('display','block');
});

// var MESSAGE_BASE = 'http://icing.internal.enjoyreading.com:8090';

$(document).ready(function () {

    $.ajax({
        url: URL_BASE + '/messages/web/message/unchecked/count',
        xhrFields: {
            withCredentials: true
        },
        type: 'get',
        data: {
            messageTypeId: 3
        },
        success: function (data) {
            if (data <= 0)
                data = '';
            $('.recommend_read_btn .badge').html(data)
        },
        error: error_handler()
    });
    $.ajax({
        url: URL_BASE + '/messages/web/message/unchecked/count',
        xhrFields: {
            withCredentials: true
        },
        type: 'get',
        data: {
            messageTypeId: 2
        },
        success: function (data) {
            if (data <= 0)
                data = '';
            $('.system_message_btn .badge').html(data)
        },
        error: error_handler()
    });

    gen_scroll_to_end_handler('.system_message', function () {
        console.log(1123);
    });

    $.ajax({
        url: URL_BASE + '/messages/web/message/list',
        xhrFields: {
            withCredentials: true
        },
        type: 'get',
        data: {
            messageTypeIds: 2
        },
        success: function (data) {
            console.log(data);
            var html = '';
            for (var i in data) {
                html += message.rend(data[i]);
            }
            $('.system_message').append(html);
            $('.unread').click(function () {
                $(this).removeClass('unread');
                // 告诉服务器此条消息已经阅读
                var id = $(this).attr('value');
                $.ajax({
                    xhrFields: {
                        withCredentials: true
                    },
                    type: 'post',
                    url: URL_BASE + '/messages/web/message/{0}/check'.format(id),
                    data: {
                        newStatus: 1
                    },
                    success: function (data) {
                        console.log(data);
                    },
                    error: error_handler()
                })
            });
        },
        error: error_handler()
    });
    $.ajax({
        url: URL_BASE + '/messages/web/message/list',
        xhrFields: {
            withCredentials: true
        },
        type: 'get',
        data: {
            messageTypeIds: 3
        },
        success: function (data) {
            console.log(data);
            var html = '';
            for (var i in data) {
                html += message.rend(data[i]);
            }
            $('.recommend_read').append(html);
            $('.unread').click(function () {
                $(this).removeClass('unread');
                // 告诉服务器此条消息已经阅读
                var id = $(this).attr('value');
                $.ajax({
                    xhrFields: {
                        withCredentials: true
                    },
                    type: 'post',
                    url: URL_BASE + '/messages/web/message/{0}/check'.format(id),
                    data: {
                        newStatus: 1
                    },
                    success: function (data) {
                        console.log(data);
                    },
                    error: error_handler()
                })
            });
        },
        error: error_handler()
    });
});