/**
 * Created by yilong on 2017/1/17.
 */

var MESSAGE_BASE = 'http://icing.internal.enjoyreading.com:8090';

$(document).ready(function () {
    gen_scroll_to_end_handler('.main', function () {
        // 加载新的内容
        console.log(1123);
    });

    $.ajax({
        url: URL_BASE + '/messages/web/message/list',
        xhrFields: {
            withCredentials: true
        },
        type: 'get',
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
});