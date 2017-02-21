/**
 * Created by yilong on 2017/1/17.
 */
//选择显示哪种message
var curr_tab = 'task';
$(".recommend_read_btn").on('click',function(){
    curr_tab = 'task';
    $(this).addClass('index');
    $(".system_message_btn").removeClass('index');
    $(".recommend_read").css('display','block');
    $(".system_message").css('display','none');
});
$(".system_message_btn").on('click',function(){
    curr_tab = 'system';
    $(this).addClass('index');
    $(".recommend_read_btn").removeClass('index');
    $(".recommend_read").css('display','none');
    $(".system_message").css('display','block');
});

var sys_curr_page = 0;
var task_curr_page = 0;

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

    gen_scroll_to_end_handler('.main', function () {
        if (curr_tab == 'system')
            load_system_message(sys_curr_page);
        else
            load_task_message(task_curr_page);
    });

    function load_system_message(page) {
        $.ajax({
            url: URL_BASE + '/messages/web/message/list',
            xhrFields: {
                withCredentials: true
            },
            type: 'get',
            data: {
                messageTypeIds: 2,
                page: page,
                itemPerPage: message.MESSAGE_PER_PAGE
            },
            success: function (data) {
                sys_curr_page += 1;
                // console.log(data);
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
                            // console.log(data);
                        },
                        error: error_handler()
                    })
                });
            },
            error: error_handler()
        });
    }

    function load_task_message(page) {
        $.ajax({
            url: URL_BASE + '/messages/web/message/list',
            xhrFields: {
                withCredentials: true
            },
            type: 'get',
            data: {
                messageTypeIds: 3,
                page: page,
                itemPerPage: message.MESSAGE_PER_PAGE
            },
            success: function (data) {
                task_curr_page += 1;
                // console.log(data);
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
                            // console.log(data);
                        },
                        error: error_handler()
                    })
                });
            },
            error: error_handler()
        });
    }

    load_task_message(task_curr_page);
    load_system_message(sys_curr_page);

});