/**
 * Created by wind on 2016/10/9.
 */

var URL_BASE = 'http://debian8-01.internal.enjoyreading.com';

function load(src, type) {

    if (typeof type == 'undefined') {
        type = 'student';
    }

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
                error: ajax_error_handler
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
    }
})(jQuery);

function fill_data(data) {
    $('#book_name').find('h3 b').html(data.name);
    $('#display_type').html(data.displayTypeName);
    $('#author').html(data.author);
    $('#publisher').html(data.publisher);
    $('#word_count').html(data.wordCount);
    $('#page_count').html('/&nbsp;&nbsp;' + data.pageCount);
    $('.page-count').html(data.pageCount);
    $('.curr-page').html(data.pageCount);
    $('#isbn').html(data.isbn);
    $('#level_score').html(data.levelScore);
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
            type: 'GET',
            url: URL_BASE + '/books/web/book/' + id,
            success: function (data) {
                // my_tip.alert(data.id);
                fill_data(data);
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
                var start_date = new Date(data.startTime);
                var end_date = new Date(data.endTime);
                $('#start_date').html(start_date.getFullDate());
                $('#end_date').html(end_date.getFullDate());
            },
            error: ajax_error_handler
        });
    }
}

var ajax_error_handler = function(xhr, textStatus, errorThrown) {
    if (xhr.status == 401) {
        window.open('../../login.html', '_self');
    }
};
