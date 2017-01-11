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
    window.open('book.html?book_id=' + $.getUrlParam('book_id'),'_self');
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
    load_pdf_page(1);
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