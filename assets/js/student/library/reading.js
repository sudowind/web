/**
 * Created by yilong on 2017/1/11.
 */
$(".unopen").click(function(){
    $(".section").css("display","block");
    $(".cover").css("display","block");
});
$(".section-retract").click(function(){
    $(".section").css("display","none");
    $(".cover").css("display","none");
});
$(".title img").click(function(){
    $(this).attr("src","../../../assets/img/student/tasks/label.png");
});
$(".out").on('click',function(){
    // 鍏堝垽鏂鍙�
    var user_type = Number(getCookie('user_type'));

    switch (user_type) {
        case 2:
            if ($.getUrlParam('task_id')) {
                window.open('student/tasks/read.html?book_id={0}&task_id={1}'.format($.getUrlParam('book_id'), $.getUrlParam('task_id')),'_self');
            }
            else {
                window.open('student/library/book.html?book_id={0}'.format($.getUrlParam('book_id')),'_self');
            }
            break;
        case 3:
            window.open('teacher/library/book.html?book_id={0}'.format($.getUrlParam('book_id')),'_self');
            break;
        case 4:
            window.open('school_master/library/book.html?book_id={0}'.format($.getUrlParam('book_id')),'_self');
            break;
    }

});

function left_bar_cb() {
    $('#library_button').attr('class', 'side-button-selected left-side-button');
}


//判断图书类型
function pdf_or_txt(){
    $.ajax({
        url: URL_BASE + '/books/web/book/{0}/content'.format($.getUrlParam('book_id')),
        xhrFields: {
            withCredentials: true
        },
        type: 'get',
        data: {
            page: 0
        },
        success: function (data) {
            if (data.status == 'withTxt') {
                var index_html = '';
                for (var i in data.bookIndex) {
                    index_html += '<div value="{0}" onclick="load_content({0});">{1}</div>'.format(Number(i) + 1, data.bookIndex[i].title);
                }
                $('.slide-menu').html(index_html);
                load_content(1);

            }
        }
    });
}

function load_progress() {
    var task_id = $.getUrlParam('task_id');
    if (task_id) {
        $.ajax({
            xhrFields: {
                withCredentials: true
            },
            type: 'GET',
            url: URL_BASE + '/tasks/web/task/' + task_id,

            success: function (data) {
                var curr_page = data.currentPage;
                var total_page = data.totalPage;
                var percent = Math.round(curr_page * 100.0 / total_page);
                $('.progress-bar').css('width', percent.toString() + '%');
                $('.progress-message').find('span').html(percent);
            },
            error: error_handler()
        });
    }
}