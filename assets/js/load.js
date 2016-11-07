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



