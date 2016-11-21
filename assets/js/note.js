/**
 * Created by wind on 2016/11/10.
 */
var has_load_note_page = false;
var current_count = 1;

function load_notes(page) {
    current_count = 1;
    $.ajax({
        xhrFields: {
            withCredentials: true
        },
        type: 'GET',
        url: URL_BASE + '/tasks/web/note/list',
        data: {
            page: page - 1,
            itemPerPage: 2,
            bookId: $.getUrlParam('book_id'),
            studentId: getCookie('USER')
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
                        load_notes(p);
                    }
                });
            }
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

