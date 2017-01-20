/**
 * Created by wind on 2016/11/10.
 */
var TASK_STATUS = {
    1: 'not assigned',
    2: 'not start',
    3: 'reading',
    4: 'completed'
};

Date.prototype.getFullDate = function(type) {
    // 返回date对应的日期字符串
    var year = this.getFullYear().toString();
    var month = (this.getMonth() + 1).toString();
    if (month.length < 2)
        month = '0' + month;
    var day = this.getDate().toString();
    if (day.length < 2)
        day = '0' + day;
    if (type == 'zh') {
        return '{0}年{1}月{2}'.format(year, month, day);
    }
    else
        return '{0}-{1}-{2}'.format(year, month, day);
};

function open_mail_url(mail_address) {
    // 给定邮箱打开邮箱登录界面
    var url = '';
    if (mail_address.indexOf('gmail') >= 0) {
        url = 'http://gmail.google.com';
    }
    else {
        url = 'http://mail.' + mail_address.split('@')[1]
    }
    window.open(url);
}

String.prototype.format = function(args) {
    // string format
    if (arguments.length>0) {
        var result = this;
        if (arguments.length == 1 && typeof (args) == "object") {
            for (var key in args) {
                var reg = new RegExp ("({"+key+"})","g");
                result = result.replace(reg, args[key]);
            }
        }
        else {
            for (var i = 0; i < arguments.length; i++) {
                if(arguments[i]==undefined)
                {
                    return "";
                }
                else
                {
                    var reg = new RegExp ("({["+i+"]})","g");
                    result = result.replace(reg, arguments[i]);
                }
            }
        }
        return result;
    }
    else {
        return this;
    }
};

// 用于图书管理
function set_online_status(is_online) {
    $.ajax({
        xhrFields: {
            withCredentials: true
        },
        type: 'put',
        url: URL_BASE + '/tasks/web/task/student/current/{0}/onlineStatus'.format($.getUrlParam('task_id')),
        data: {
            isOnline: is_online
        },
        error: ajax_error_handler
    })
}

// window.onload = function () {
//     // 测试鼠标绑定事件
//     $(document).mouseup(function(e){
//         var text = document.getSelection().toString();
//         $('#teacher_name').html('{0}'.format(text));
//         if (text.length > 0) {
//             $('.context-menu').remove();
//             $('body .main-body').append('<div class="context-menu" style="background: #ffffff; position: fixed; top: {0}px; left: {1}px">{2}</div>'.format(e.clientY, e.clientX, text));
//         }
//     }).contextmenu(function (e) {
//         $('.context-menu').remove();
//         $('body .main-body').append('<div class="context-menu" style="background: #ffffff; position: fixed; top: {0}px; left: {1}px">haha</div>'.format(e.clientY, e.clientX));
//         return false
//     }).click(function (e) {
//         var text = document.getSelection().toString();
//         if (text.length <= 0)
//             $('.context-menu').remove();
//     });
// };

function safe_divide(a, b) {
    if (b == 0)
        return 0;
    else
        return a / b;
}

function get_current_semester() {
    var now = new Date();
    var curr_month = now.getMonth();
    var start_time = 0;
    var end_time = 0;
    var start = now, end = now;
    //console.log(curr_month);
    if (curr_month >= 2 && curr_month <= 7) {
        start.setMonth(2);
        start_time = start.setDate(0);
        end.setMonth(8);
        end_time = end.setDate(0);
    }
    else {
        if (curr_month > 7) {
            start.setMonth(8);
            start_time = start.setDate(0);
            end.setYear(now.getYear() + 1 + 1900);
            end.setMonth(2);
            end_time = end.setDate(0);
        }
        else {
            start.setYear(now.getYear() - 1 + 1900);
            start.setMonth(8);
            start_time = start.setDate(0);
            end.setMonth(2);
            end_time = end.setDate(0);
        }
    }
    return [start_time, end_time];
}

function rand_ER() {
    return Math.ceil((Math.random() * 600000) % 600) + 600;
}

// 检测一个区域是否滚动到了底部
function gen_scroll_to_end_handler(selector, func) {
    $(selector).scroll(function () {
        var scroll_top = $(this).scrollTop();
        var height = $(this).height();
        var scroll_height = $(this)[0].scrollHeight;
        if (scroll_height == height + scroll_top) {
            func();
        }
    })
}