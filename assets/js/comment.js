/**
 * Created by wind on 2016/11/10.
 */
var has_load_comment_page = false;

function load_comments(page) {
    // page参数是页码
    $.ajax({
        xhrFields: {
            withCredentials: true
        },
        type: 'GET',
        url: 'http://debian8-01.internal.enjoyreading.com:8081/books/web/bookComment/' + $.getUrlParam('book_id') + '/list',
        data: {
            page: page - 1,
            itemPerPage: 2
        },
        success: function(data) {
            var html = '';
            for (var i = 0; i < data.data.length; ++i) {
                html += create_comment(data.data[i]);
            }
            if (html == '') {
                html = '<div class="comment" style="text-align: center">暂无评论</div>';
            }
            $('#comment_container').html(html);

            if (!has_load_comment_page) {
                has_load_comment_page = true;
                $('#comment_pagination').createPage({
                    pageCount: data.totalPage,
                    current: 1,
                    backFn: function(p) {
                        load_comments(p);
                    }
                });
            }
        }
    });
}

function create_comment(data) {
    return '<div class="comment">' +
        '<div class="comment-img">' +
        '<img src="../../../assets/img/student/book/comment_photo.png">' +
        '</div>' +
        '<div class="comment-content">' +
        '<h3>吴磊</h3>' +
        '<div class="like">' +
        '<img src="../../../assets/img/student/book/like.png" height="90%" width="90%">' +
        '</div>' +
        '<div class="like-count">74</div>' +
        '<p>' + data.content + '</p>' +
        '<div class="comment-date" align="right">' +
        '2016-10-10' +
        '</div>' +
        '</div>' +
        '<hr style="clear: both;"/>' +
        '</div>';
}

$('#submit_comment').click(function () {
    $.ajax({
        xhrFields: {
            withCredentials: true
        },
        type: 'POST',
        url: 'http://debian8-01.internal.enjoyreading.com:8081/books/web/bookComment/' + $.getUrlParam('book_id'),
        data: { content: $('#user_comment').val()},
        success: function() {
            my_tip.alert('评论发表成功');
            $('#user_comment').val('');
            has_load_comment_page = false;
            load_comments(1);
        }
    });
});

