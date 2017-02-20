/**
 * Created by wind on 2016/11/10.
 */
var has_load_note_page = false;
var current_count = 1;
var item_per_page = 100;

function load_notes(page, student_id) {
    current_count = 1;
    if (student_id == null) {
        student_id = getCookie('USER');
    }
    $.ajax({
        xhrFields: {
            withCredentials: true
        },
        type: 'GET',
        url: URL_BASE + '/tasks/web/note/list',
        data: {
            page: page - 1,
            itemPerPage: item_per_page,
            bookId: $.getUrlParam('book_id'),
            studentId: student_id
        },
        success: function(data) {
            var html = '';
            for (var i = 0; i < data.data.length; ++i) {
                html += create_note(data.data[i], data.currentPage);
            }
            if (html == '') {
                html = '<div class="note" style="text-align: center">暂无笔记</div>';
            }
            $('#note_container').html(html);

            if (!has_load_note_page) {
                has_load_note_page = true;
                var page_count = Math.ceil((data.totalItem * 1.0) / 2);
                $('#note_pagination').createPage({
                    pageCount: page_count,
                    current: 1,
                    backFn: function(p) {
                        load_notes(p, student_id);
                    }
                });
            }
        }
    });
}

function teacher_load_notes(page, student_id) {
    if (student_id == null) {
        student_id = getCookie('USER');
    }
    $.ajax({
        xhrFields: {
            withCredentials: true
        },
        type: 'GET',
        url: URL_BASE + '/tasks/web/note/list',
        data: {
            page: page - 1,
            bookId: $.getUrlParam('book_id'),
            studentId: student_id
        },
        success: function(data) {
            var html = '';
            for (var i = 0; i < data.data.length; ++i) {
                html += create_note(data.data[i], data.currentPage);
            }
            if (html == '') {
                html = '<div class="note" style="text-align: center">暂无笔记</div>';
            }
            $('#note_container').html(html);
        }
    });
}

// 需要前端对评论进行排序
function create_note(data, page) {
    var date = new Date(data.createTime);
    var res = '<div class="note">' +
        '<div class="note_id">' + (page * 2 + current_count).toString() + '</div>' +
        '<div class="note_time">' + date.getFullDate() + '</div>' +
        '<div class="note_content">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;' + data.content + '</div>' +
        '<hr style="clear: both;"/>' +
        '</div>';
    current_count += 1;
    return res;
}

$('#submit_note').click(function () {
    $.ajax({
        xhrFields: {
            withCredentials: true
        },
        type: 'POST',
        url: URL_BASE + '/tasks/web/note/book/' + $.getUrlParam('book_id'),
        data: { content: $('#user_note').val()},
        success: function() {
            my_tip.alert('笔记记录成功');
            $('#user_note').val('');
            has_load_note_page = false;
            load_notes(1);
        }
    });
});

$('#user_note').bind('input propertychange', function () {
    if ($(this).val().length > 0) {
        $('#submit_note').removeClass('disabled button-disabled').addClass('button-able');
    }
    else {
        $('#submit_note').addClass('disabled button-disabled').removeClass('button-able');
    }
});