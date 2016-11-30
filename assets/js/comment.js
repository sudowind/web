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
        url: URL_BASE + '/books/web/bookComment/' + $.getUrlParam('book_id') + '/list',
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
                html = '<div class="comment" style="text-align: center" style="margin-top: 10px;">暂无评论</div>';
            }
            if (data.totalItem > 0)
                $('#comment_count').html(data.totalItem);
            else {
                $('#comment_count').html('0');
            }
            $('#comment_container').html(html);

            $('.like').click(function () {
                var obj = $(this);
                $.ajax({
                    xhrFields: {
                        withCredentials: true
                    },
                    type: 'POST',
                    url: URL_BASE + '/books/web/bookComment/' + $.getUrlParam('book_id') + '/' + $(this).attr('value') + '/like',
                    success: function(data) {
                        // my_tip.alert(data);
                        if (data) {
                            obj.siblings('.like-count').html(Number(obj.siblings('.like-count').html()) + 1);
                            obj.find('img').attr('src', '../../../assets/img/student/book/like_true.png');
                        }
                        else {
                            obj.siblings('.like-count').html(Number(obj.siblings('.like-count').html()) - 1);
                            obj.find('img').attr('src', '../../../assets/img/student/book/like.png');
                        }
                    }
                });
            }).css('cursor', 'pointer');

            $('.delete-comment').click(function() {
                var obj = $(this);
                my_tip.bind('确定要删除这条评论吗？', function() {
                    $.ajax({
                        xhrFields: {
                            withCredentials: true
                        },
                        type: 'POST',
                        url: URL_BASE + '/books/web/bookComment/' + $.getUrlParam('book_id') + '/' + obj.attr('value') + '/delete',
                        success: function(data) {
                            has_load_comment_page = false;
                            load_comments(1);
                        }
                    });
                });

            });

            if (!has_load_comment_page) {
                has_load_comment_page = true;
                var page_count = Math.ceil((data.totalItem * 1.0) / 2);
                $('#comment_pagination').createPage({
                    pageCount: page_count,
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
    var liked = '';
    if (data.liked) {
        liked = '_true';
    }
    var del_html = '';
    if (data.userId == getCookie('USER')) {
        del_html = '<div class="delete-comment" value="' + data.id + '"><img src="../../../assets/img/delete.png" height="90%" width="90%"></div>'
    }
    return '<div class="comment">' +
        '<div class="comment-img">' +
        '<img src="' + data.user.headimg + '">' +
        '</div>' +
        '<div class="comment-content">' +
        '<h3>' + data.user.name + '</h3>' + '<div class="like-option">' +
        '<div class="like" value="' + data.id + '">' +
        '<img src="../../../assets/img/student/book/like' + liked + '.png" height="90%" width="90%">' +
        '</div>' +
        '<div class="like-count">' + data.likeCount + '</div>' + del_html +
        '</div>' +
        '<p>' + data.content + '</p>' +
        '<div class="comment-date" align="right">' +
        '2016-10-10' +
        '</div>' +
        '</div>' +
        '<hr style="clear: both;"/>' +
        '</div>';
}

$('#submit_comment').click(function () {
    var content = $('#user_comment').val();
    if (content.length == 0) {
        my_tip.alert('请填写评论内容！');
        return;
    }
    $.ajax({
        xhrFields: {
            withCredentials: true
        },
        type: 'POST',
        url: URL_BASE + '/books/web/bookComment/' + $.getUrlParam('book_id'),
        data: { content: content},
        success: function() {
            my_tip.alert('评论发表成功');
            $('#user_comment').val('');
            has_load_comment_page = false;
            load_comments(1);
        }
    });
});



