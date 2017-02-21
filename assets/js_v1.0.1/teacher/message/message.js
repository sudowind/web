/**
 * Created by yilong on 2017/1/17.
 */

var curr_page = 0;
$(document).ready(function () {
    gen_scroll_to_end_handler('.main', function () {
        // 加载新的内容
        load_system_message(curr_page);
    });

    function load_system_message(page) {
        $.ajax({
            url: URL_BASE + '/messages/web/message/list',
            xhrFields: {
                withCredentials: true
            },
            type: 'get',
            data: {
                page: page,
                itemPerPage: message.MESSAGE_PER_PAGE
            },
            success: function (data) {
                // console.log(data);
                curr_page += 1;
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

    load_system_message(curr_page);

});