/**
 * Created by wind on 2016/10/9.
 */

function load(src) {

    $('#page_footer').load(src + 'footer.html');
    $('#left_bar').load(src + 'student/left_bar.html', function() {
        if (typeof left_bar_cb != 'undefined') {
            left_bar_cb();
        }
    });

    $('#right_bar').load(src + 'student/right_bar.html', function() {
        if (typeof right_bar_cb != 'undefined') {
            right_bar_cb();
        }
    });
}
