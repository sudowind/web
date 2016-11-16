/**
 * Created by yilong on 2016/10/12.
 */

var has_load_book = false;

function left_bar_cb() {
    $('#tasks_button').attr('class', 'side-button-selected left-side-button');
}

$(".book .sort .read").click(function(){
    load_book(3, getCookie('USER'), 0, 8, function() {
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
    });
});
$(".book .sort .reading").click(function(){
    load_book(1, getCookie('USER'), 0, 8, function() {
        $(".book .sort .reading").addClass("index");
        $(".book .sort .read").removeClass("index");
        $(".list").off("mouseenter mouseleave");
        $(".check").css("display","none");
        $(".list-book .reading").css("display","block");
    });


});

function load_book(task_status, reporter_id, page, item_per_page, cb_func) {
    var html = '';
    $.ajax({
        xhrFields: {
            withCredentials: true
        },
        type: 'GET',
        url: URL_BASE + '/tasks/web/task/student/current/list',
        data: {
            taskStatus: task_status,
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
                    url: URL_BASE + '/books/web/book/' + id,
                    success: function(book_data) {
                        // my_tip.alert(data.id);
                        // alert(obj.attr('value'));
                        obj.find('.book-name').html(book_data.name);
                        obj.find('.level-score').html(book_data.levelScore);

                    }
                });
            });
            $('.remove').click(function () {
                var obj = $(this);
                my_tip.bind('确认要删除这个阅读任务吗？', function() {
                    var task_id = obj.attr('task-id');
                    // alert(task_id);
                    // obj.parent().parent().hide();
                    $.ajax({
                        xhrFields: {
                            withCredentials: true
                        },
                        type: 'POST',
                        url: URL_BASE + '/tasks/web/task/student/current/' + task_id + '/delete',
                        success: function () {
                            obj.parent().parent().hide();
                        }
                    });
                });
            });
            if(!has_load_book) {
                has_load_book = true;
                var page_count = Math.ceil((data.totalItem * 1.0) / data.itemPerPage);
                $('#book_pagination').createPage({
                    pageCount: page_count,
                    current: 1,
                    backFn: function(p) {
                        load_book(curr_type, p);
                    }
                });
            }
            cb_func();
        }
    });
}

function fill_book(data) {
    var curr_page = data.currentPage;
    var total_page = data.totalPage;
    var percent = Math.round(curr_page * 100.0 / total_page);

    return '<div class="list">' +
        '<div class="list-book">' +
        '<div class="image">' +
        '<img src=../../../assets/img/1.png alt=""/>' +
        '<div class="book-meta-info">' +
        '<span class="level-score"></span>' +
        '<div class="book-name" book-id="' + data.bookId + '" task-id="' + data.id + '"></div></div>' +
        '</div>' +
        '<!--进度条部分-->' +
        '<div class="progress">' +
        '<div class="progress-bar progress-bar-striped active" role="progressbar" aria-valuenow="' + percent.toString() + '" aria-valuemin="0" aria-valuemax="100" style="width: ' + percent.toString() + '%">' +
        '<span class="sr-only">' + percent.toString() +'% Complete</span>' +
        '</div>' +
        '</div>' +
        '<p class="plan">进度<span>' + percent.toString() + '</span>%</p>' +
        // '<div class="pages"><span>' + curr_page + '</span>页/<span>' + total_page + '</span>页</div>' +
        '<div class="reading">' +
        '<p  class="continue-read">' +
        '<span onclick="window.open(\'read.html?book_id=' + data.bookId + '&task_id=' + data.id + '\', \'_self\')">继续阅读</span>' +
        '</p>' +
        '<p class="appraisal">' +
        '<span onclick="window.open(\'test.html\', \'_self\');">做测评</span>' +
        '</p>' +
        '</div>' +
        '<div class="check" style="display: none">' +
        '<p onclick="window.open(\'book.html?book_id=' + data.bookId + '&task_id=' + data.id + '\', \'_self\')">查看</p>' +
        '</div>' +
        '<div class="remove" task-id="' + data.id + '">' +
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
