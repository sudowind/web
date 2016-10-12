/**
 * Created by wind on 2016/10/9.
 */
$('#page_footer').load('../../../include/html/footer.html');
$('#left_bar').load('../../../include/html/student/left_bar.html', function() {
    if (typeof left_bar_cb != 'undefined') {
        left_bar_cb();
    }
});

$('#right_bar').load('../../../include/html/student/right_bar.html', function() {
    if (typeof right_bar_cb != 'undefined') {
        right_bar_cb();
    }
});
