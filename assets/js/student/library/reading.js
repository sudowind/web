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
    // 先判断端口
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

var curr_page = 1;
var total_page = 0;

$('.left .book .up').click(function () {
    curr_page -= 1;
    if (curr_page == 0)
        curr_page = 1;
    load_pdf_page(curr_page);
});

$('.left .book .down').click(function () {
    curr_page += 1;
    if (curr_page > total_page)
        curr_page = total_page;
    load_pdf_page(curr_page);
});

$(document).ready(function () {
    // load_pdf_page(1);
});

function load_pdf_page(page) {
    $.ajax({
        xhrFields: {
            withCredentials: true
        },
        type: 'get',
        url: URL_BASE + '/books/web/book/{0}/content'.format($.getUrlParam('book_id')),
        data: {
            page: page
        },
        success: function (data) {
            // $('#pdf1').html('<iframe src="{0}#toolbar=0&navpanes=0&scrollbar=0"></iframe>'.format(data.url));
            $('iframe').attr('src', '{0}#toolbar=0&navpanes=0&scrollbar=0'.format(data.url));
            total_page = data.totalPage;
        },
        error: error_handler({404: function () {
            console.log('tedst');
        }})
    })
}