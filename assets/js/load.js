/**
 * Created by wind on 2016/10/9.
 */

var URL_BASE = 'http://debian8-01.internal.enjoyreading.com';

function load(src, type) {
    // 加载页眉页脚，绑定事件，然后查询未查看消息数量
    if (typeof type == 'undefined') {
        type = 'student';
    }
    $('#page_header').load(src + type + '/header.html', function () {
        $('.header').css('width', $(window).get(0).innerWidth);
        if (typeof header_cb != 'undefined') {
            header_cb();
        }
        check_unread_message_count();
        $('.exit-button').click(function () {

            $.ajax({
                url: URL_BASE + '/users/open/logout',
                xhrFields: {
                    withCredentials: true
                },
                type: 'POST',
                success: function () {
                    window.open('../../../v1.0.1/login.html', '_self');
                },
                error: ajax_error_handler
            });
        });
    });
    $('#page_footer').load(src + 'footer.html');
    $('#left_bar').load(src + type + '/left_bar.html', function() {
        if (typeof left_bar_cb != 'undefined') {
            left_bar_cb();
        }
        $('.exit-button').click(function () {

            $.ajax({
                url: URL_BASE + '/users/open/logout',
                xhrFields: {
                    withCredentials: true
                },
                type: 'POST',
                success: function () {
                    window.open('../../../html/login.html', '_self');
                },
                error: ajax_error_handler
            });
        });
    });

    $('#right_bar').load(src + type + '/right_bar.html', function() {
        if (typeof right_bar_cb != 'undefined') {
            right_bar_cb();
        }
        if (type != 'student') {
            $.ajax({
                url: URL_BASE + '/users/web/user/current',
                type: 'get',
                xhrFields: {
                    withCredentials: true
                },
                success: function(data) {
                    $('.right-photo img').attr('src', data.headimg);
                    $('#teacher_name').html(data.name);
                },
                error: error_handler()
            })
        }
    });
}

(function ($) {
    $.getUrlParam = function (name) {
        var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
        var r = window.location.search.substr(1).match(reg);
        if (r != null)
            return r[2];
        return null;
    };
    $('head').append(
        '<script>' +
        'var _hmt = _hmt || [];' +
        '(function() {' +
        'var hm = document.createElement("script");' +
        'hm.src = "https://hm.baidu.com/hm.js?95db2e3e5bb28adc42d27b3a3b3ed9f4";' +
        'var s = document.getElementsByTagName("script")[0];' +
        's.parentNode.insertBefore(hm, s);' +
        '})();' +
        '</script>');
})(jQuery);

function fill_data(data) {
    $('.book-info h3').css('font-size', '19px');
    $('#book_name').html(data.name);
    $('#display_type').html(data.displayTypeName);
    $('#author').html(data.author);
    $('#publisher').html(data.publisher);
    $('#word_count').html(data.wordCount);
    $('#page_count').html('/&nbsp;&nbsp;' + data.pageCount);
    $('.page-count').html(data.pageCount);
    $('.curr-page').html(data.pageCount);
    $('#isbn').html(data.isbn);
    $('#level_score').html(data.levelScore +'ER');
    $('#intro_part').html(data['introduction']);
    $('.book-image').find('img').attr('src', data.coverUri);
    $('.img img').attr('src', data.coverUri);
}

function load_page() {
    var id = $.getUrlParam('book_id');
    if (id == null) {
        // 如果url中没有给id，应该导向别的页面
        // my_tip.alert('gaga');
    }
    else {
        $.ajax({
            xhrFields: {
                withCredentials: true
            },
            type: 'GET',
            url: URL_BASE + '/books/web/book/' + id,
            success: function (data) {
                // my_tip.alert(data.id);
                fill_data(data);
                if (data.examStatus == '无题') {
                    $('#test_button').hide().siblings().css('width', '33.33%');
                }
            },
            error: ajax_error_handler
        });
    }

    var task_id = $.getUrlParam('task_id');
    if (task_id != null) {
        $.ajax({
            xhrFields: {
                withCredentials: true
            },
            type: 'GET',
            url: URL_BASE + '/tasks/web/task/' + task_id,
            success: function(data) {
                // my_tip.alert(data.id);
                // do some thing
                var start_date = new Date(data.userCreateTime);
                if (data.finishTime == 0)
                    data.finishTime = data.endTime;
                var end_date = new Date(data.finishTime);
                $('#start_date').html(start_date.getFullDate());
                $('#end_date').html(end_date.getFullDate());
                var process = Math.ceil(data.currentPage * 100.0/ data.totalPage);
                $('.progress-bar').css('width', process.toString() + '%');
                $('.ratio span').html(process.toString());
            },
            error: error_handler()
        });
    }
}

var ajax_error_handler = function(xhr, textStatus, errorThrown) {
    if (xhr.status == 401) {
        window.open('../../login.html', '_self');
    }
};

var error_handler = function () {
    // 错误的处理方法写在函数参数里
    var obj = arguments;
    return function(xhr, textStatus, errorThrown) {
        if (xhr.status == 401) {
            window.open('../../login.html', '_self');
        }
        else {
            if (typeof obj[0][xhr.status] != 'undefined') {
                obj[0][xhr.status]()
            }
        }
    }
};

var window_resize = function () {
    var width = document.body.scrollWidth;
    var height = document.body.scrollHeight;
    $('.header').css('width', width);
    $('.main-container').css('min-height', height - 100)
        .css('margin-left', (width - 1135) / 2);
};

var window_resize_teacher = function () {
    var width = document.body.scrollWidth;
    var height = document.body.scrollHeight;
    $('.header').css('width', width);
    $('.main-container').css('min-height', height - 100)
        .css('margin-left', (width - 1135) / 2);
};

function load_teacher_info() {
    $.ajax({
        url: URL_BASE + '/users/web/user/current',
        type: 'get',
        xhrFields: {
            withCredentials: true
        },
        success: function(data) {
            $('.info-name').html(data.name);
            $('.info-school').html(data.school.name);
            $('.info-account').append(data.account);
            $('.head-img img').attr('src', data.headimg);
            // if (data.classes != null && data.classes.length > 0) {
            //     var html = '';
            //     var i = 0;
            //     for (i = 0; i < data.classes.length; ++i) {
            //         html += '<div class="class_elem">{0}</div>'.format(data.classes[i].name);
            //     }
            //     $('.own-class-info').append(html).show();
            //     $('.no-class').hide();
            // }
            // else {
            //     $('.own-class-info').hide();
            //     $('.no-class').show();
            // }
            // 判断老师是否被认证
            if (data.masterResourceStatus == 3) {
                $('.info-certification').html(
                    '已认证&nbsp;<img src="../../../assets/img/v1.0.1/icon-blue.png">'
                );
                $('.certi-img').show();
            }
        },
        error: error_handler()
    })
}

function check_unread_message_count() {
    $.ajax({
        url: URL_BASE + '/messages/web/message/unchecked/count',
        type: 'get',
        xhrFields: {
            withCredentials: true
        },
        success: function (data) {
            var length = data;
            console.log('未读消息数量：{0}'.format(data));
            if (length > 0 && getCookie('user_type') != '2') {
                $('.badge').html(length);
            }
            else if (length > 0) {
                $('.header .badge').html(length);
            }
        },
        error: error_handler()
    });
}

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