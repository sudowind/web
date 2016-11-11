/**
 * Created by yilong on 2016/10/12.
 */

var has_load_book = false;

function left_bar_cb() {
    $('#tasks_button').attr('class', 'side-button-selected left-side-button');
}

$(".book .sort .read").click(function(){
    $(".book .sort .read").addClass("index");
    $(".book .sort .reading").removeClass("index");
    $(".list").hover(
        function(){
            $(this).find(".list-book .remove ").css({"display":"block"});
        },
        function(){
            $(this).find(".list-book .remove ").css({"display":"none"});
        }
    );
    $(".check").css("display","block");
    $(".list-book .reading").css("display","none");
    load_book(1, 2, 0, 8);
});
$(".book .sort .reading").click(function(){
    $(".book .sort .reading").addClass("index");
    $(".book .sort .read").removeClass("index");
    $(".list").off("mouseenter mouseleave");
    $(".check").css("display","none");
    $(".list-book .reading").css("display","block");
    load_book(1, 2, 0, 8);
});

function load_book(task_status, reporter_id, page, item_per_page) {
    var html = '';
    $.ajax({
        xhrFields: {
            withCredentials: true
        },
        type: 'GET',
        url: 'http://debian8-01.internal.enjoyreading.com:8083/tasks/web/task/student/current/list',
        data: {
            // taskStatus: task_status,
            reporterId: reporter_id,
            page: page,
            itemPerPage: item_per_page
        },
        success: function(data) {
            for (var i = 0; i < data.data.length; ++i) {
                html += fill_book(data.data[i]);
            }
            $('#book_list').html(html);
            $('.book-meta-info').each(function() {
                var obj = $(this);
                var id = obj.find('.book-name').attr('book-id');
                $.ajax({
                    type: 'GET',
                    url: 'http://debian8-01.internal.enjoyreading.com:8081/books/web/book/' + id,
                    success: function(book_data) {
                        // my_tip.alert(data.id);
                        // alert(obj.attr('value'));
                        obj.find('.book-name').html(book_data.name);
                        obj.find('.level-score').html(book_data.levelScore);

                    }
                });
            });
            if(!has_load_book) {
                has_load_book = true;
                $('#book_pagination').createPage({
                    pageCount: data.totalPage,
                    current: 1,
                    backFn: function(p) {
                        load_book(curr_type, p);
                    }
                });
            }
        }
    });
}

function fill_book(data) {
    return '<div class="list">' +
        '<div class="list-book">' +
        '<div class="image">' +
        '<img src=../../../assets/img/1.png alt=""/>' +
        '<div class="book-meta-info">' +
        '<span class="level-score"></span>' +
        '<div class="book-name" book-id="' + data.bookId + '" task-id="' + data.id + '"></div></div>' +
        '</div>' +
        '' +
        '<!--进度条部分-->' +
        '<div class="progress">' +
        '<div class="progress-bar progress-bar-striped active" role="progressbar" aria-valuenow="45" aria-valuemin="0" aria-valuemax="100" style="width: 20%">' +
        '<span class="sr-only">45% Complete</span>' +
        '</div>' +
        '</div>' +
        '<p class="plan">进度<span>0</span>%</p>' +
        '<div class="pages"><span>1</span>页/<span>999</span>页</div>' +
        '<div class="reading">' +
        '<p  class="continue-read">' +
        '<a href="read.html?book_id=' + data.bookId + '&task_id=' + data.id + '"><span>继续阅读</span></a>' +
        '</p>' +
        '<p class="appraisal">' +
        '<a href="test.html"><span>做测评</span></a>' +
        '</p>' +
        '</div>' +
        '<div class="check" style="display: none";>' +
        '<a href="book.html"><p>查看</p></a>' +
        '</div>' +
        '<div class="remove">' +
        '<img src="../../../assets/img/student/tasks/remove.png" alt=""/>' +
        '</div>' +
        '</div>' +
        '</div>';
}

$('.add-task').click(function () {
    window.open('../library/index.html', '_self');
});

$('.grade').find('span').click(function () {
    $(this).siblings('span').removeClass('index');
    $(this).addClass('index');
});
