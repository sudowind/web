/**
 * Created by yilong on 2016/10/12.
 */

var has_load_book = false;
var BOOK_STATUS = 2;    // 2表示阅读中，4表示已读完
var TASK_FINISH = 5;
var REPORTER = getCookie('USER');

function left_bar_cb() {
    $('#tasks_button').attr('class', 'side-button-selected left-side-button');
}

var book_handler = function () {
    if (BOOK_STATUS == TASK_FINISH && REPORTER == getCookie('USER')) {
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
    }
    else if (BOOK_STATUS == TASK_FINISH) {
        $(".book .sort .read").addClass("index");
        $(".book .sort .reading").removeClass("index");
        $(".check").css("display","block");
        $(".list-book .reading").css("display","none");
    }
    else {
        $(".book .sort .reading").addClass("index");
        $(".book .sort .read").removeClass("index");
        $(".list").off("mouseenter mouseleave");
        $(".check").css("display","none");
        $(".list-book .reading").css("display","block");
    }
};

$(".book .sort .read").click(function(){
    var reporter_id = $(".grade .index").attr('value');
    if (reporter_id == '0') {
        reporter_id = getCookie('USER');
    }
    has_load_book = false;
    BOOK_STATUS = TASK_FINISH;
    load_book(TASK_FINISH, reporter_id, 0, 8, book_handler);
});
$(".book .sort .reading").click(function(){
    var reporter_id = $(".grade .index").attr('value');
    if (reporter_id == '0') {
        reporter_id = getCookie('USER');
    }
    has_load_book = false;
    BOOK_STATUS = 2;
    load_book(2, reporter_id, 0, 8, book_handler);
});

var is_load_time = false;
function load_book(task_status, reporter_id, page, item_per_page, cb_func) {
    REPORTER = reporter_id;
    var html = '';
    is_load_time = (task_status != TASK_FINISH && reporter_id != getCookie('USER'));
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
            //console.log(data.data[0].endTime)
            console.log(data.data);
            data.data.sort(function (a, b) {
                return a.userCreateTime < b.userCreateTime;
            });
            console.log(data.data);

            for (var i = 0; i < data.data.length; ++i) {

                if($(".grade span").attr('value') == 0){
                    html += fill_book(data.data[i]);
                }
            }
            $('#book_list').html(html);
            $('.book-meta-info').each(function() {
                var obj = $(this);
                var id = obj.find('.book-name').attr('book-id');
                $.ajax({
                    xhrFields: {
                        withCredentials: true
                    },
                    type: 'GET',
                    url: URL_BASE + '/books/web/book/' + id,
                    success: function(book_data) {
                        // my_tip.alert(data.id);
                        // alert(obj.attr('value'));
                        obj.find('.book-name').html(book_data.name);
                        obj.find('.level-score').html(book_data.levelScore+'ER');
                        obj.parent().find('img').attr('src', book_data.coverUri);
                        if (book_data.examStatus.indexOf('无题') >= 0) {
                            obj.parent().siblings().find('.appraisal btn').html('无题').addClass('disabled');
                        }
                    },
                    error: error_handler()
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
                        },
                        error: error_handler()
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
                        load_book(task_status, reporter_id, p - 1, item_per_page, cb_func);
                    }
                });
            }
            cb_func();
        },
        error: ajax_error_handler
    });
}

function fill_book(data) {
    var curr_page = data.currentPage;
    var total_page = data.totalPage;
    var percent = Math.round(curr_page * 100.0 / total_page);
    //时间戳转换时间xxxx-xx-xx
    if(data.endTime){
        var date = new Date(data.endTime);
    }
    var time_html = '';
    if (is_load_time) {
        time_html = '<p class="end_time">结束时间:<span>'+ date.getFullDate() +'</span></p>';
    }

    var can_read = '';
    var can_test = '';

    switch (data.status) {
        case 2:
        case 3:
            can_test = 'disabled';
            break;
        case 4:
            can_read = 'disabled';
            break;
    }

    return '<div class="list">' +
        '<div class="list-book">' +
        '<div class="image">' +
        time_html +
        '<img src="" alt=""/>' +
        '<div class="book-meta-info">' +
        '<span class="level-score"></span>' +
        '<div class="book-name" book-id="' + data.bookId + '" task-id="' + data.id + '"></div></div>' +
        '</div>' +
        '<!--进度条部分-->' +
        '<div class="progress progress-index">' +
        '<div class="progress-bar progress-bar-striped active" role="progressbar" aria-valuenow="' + percent.toString() + '" aria-valuemin="0" aria-valuemax="100" style="width: ' + percent.toString() + '%">' +
        '<span class="sr-only">' + percent.toString() +'% Complete</span>' +
        '</div>' +
        '</div>' +
        '<p class="plan">进度<span>' + percent.toString() + '</span>%</p>' +
        // '<div class="pages"><span>' + curr_page + '</span>页/<span>' + total_page + '</span>页</div>' +
        '<div class="reading">' +
        '<p  class="continue-read">' +
        '<btn class="btn ' + can_read + '" onclick="window.open(\'read.html?book_id=' + data.bookId + '&task_id=' + data.id + '\')">继续阅读</btn>' +
        '</p>' +
        '<p class="appraisal">' +
        '<btn class="btn ' + can_test + '" onclick="window.open(\'test.html?book_id=' + data.bookId + '&task_id=' + data.id + '\');">做测评</btn>' +
        '</p>' +
        '</div>' +
        '<div class="check" style="display: none">' +
        '<p onclick="window.open(\'book.html?book_id=' + data.bookId + '&task_id=' + data.id + '\')">查看</p>' +
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

function init_teachers() {
    var html = '<p>任务来源：</p><span class="index" value="0">自主发布</span>';
    $.ajax({
        xhrFields:{
            withCredentials: true
        },
        type: 'get',
        url: URL_BASE + '/users/web/class/current/teachers',
        success: function(data) {
            for (var i = 0; i < data.length; ++i) {
                html += '<span value="' + data[i].id + '">' + data[i].name + '老师推荐</span>';
            }
            $('.grade').html(html).find('span').click(function () {
                $(this).siblings('span').removeClass('index');
                $(this).addClass('index');
                var reporter_id = $(this).attr('value');
                if (reporter_id == '0') {
                    reporter_id = getCookie('USER');
                }
                var book_status = $('.sort .index').attr('value');
                BOOK_STATUS = book_status;
                has_load_book = false;
                load_book(book_status, reporter_id, 0, 8, book_handler);
            });
            load_book(2, getCookie('USER'), 0, 8, function(){});
        },
        error: error_handler()
    });
}