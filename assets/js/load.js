/**
 * Created by wind on 2016/10/9.
 */

function load(src, type) {

    if (typeof type == 'undefined') {
        type = 'student';
    }

    $('#page_footer').load(src + 'footer.html');
    $('#left_bar').load(src + type + '/left_bar.html', function() {
        if (typeof left_bar_cb != 'undefined') {
            left_bar_cb();
            $('.exit-button').click(function () {
                $.ajax({
                    url: 'http://debian8-01.internal.enjoyreading.com:8082/users/open/logout',
                    xhrFields: {
                        withCredentials: true
                    },
                    type: 'POST',
                    success: function () {
                        window.open('../../../html/login.html', '_self');
                    }
                });
            });
        }
    });

    $('#right_bar').load(src + type + '/right_bar.html', function() {
        if (typeof right_bar_cb != 'undefined') {
            right_bar_cb();
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
    $('#isbn').html(data.isbn);
    $('#level_score').html(data.levelScore);
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
