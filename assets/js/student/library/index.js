/**
 * Created by wind on 2016/10/31.
 */
// 左右导航栏的回调函数
function left_bar_cb() {
    $('#library_button').attr('class', 'side-button-selected left-side-button');
}

var curr_type = 0;
var curr_start_score = 600;
var curr_end_score = 1200;

var has_recommend_result;
var recommend_start_score = 0;
var recommend_end_score = 0;

var has_load_book = false;
var BOOK_PER_PAGE = 9;

function gen_book_type() {
    var promise = new Promise(function(resolve, reject) {
        resolve();
    });

    promise.then(function () {
        $.ajax({
            xhrFields: {
                withCredentials: true
            },
            url: URL_BASE + '/books/open/tag/type/list',
            type: 'get',
            success: function (data) {
                var html = '<span class="index" value="0">全部</span>';
                for (var i in data) {
                    if (data[i].id != '0')
                        html += '<span value="{0}">{1}</span>'.format(data[i].id, data[i].name);
                }
                $('.book .sort').append(html);
                $(".book .sort span").click(function(){
                    $(this).siblings().attr("class","");
                    $(this).attr("class","index");

                    has_load_book = false;
                    load_book(Number($(this).attr('value')), 1);

                });
                // load_book(0, 1);
            },
            error: error_handler()
        });
    })
        .then(function () {
            $.ajax({
                xhrFields: {
                    withCredentials: true
                },
                url: URL_BASE + '/tasks/web/erTest/latest',
                type: 'get',
                success: function (data) {
                    if (data.hasTest) {
                        has_recommend_result = true;
                        recommend_start_score = data.erTestRecord.erScore  - 100;
                        recommend_end_score = data.erTestRecord.erScore  + 50;
                        if (recommend_start_score < 600)
                            recommend_start_score = 600;
                        if (recommend_end_score > 1200)
                            recommend_end_score = 1200;
                        curr_start_score = recommend_start_score;
                        curr_end_score = recommend_end_score;
                        $('.grade span:nth-child(2)').html('推荐');
                    }
                    load_book(0, 1);
                }
            });
        })
        .then(function () {
            // load_book(0, 1);
        })
        .catch(function (error) {
            console.log('error: ', error);
        });

    // $.ajax({
    //     xhrFields: {
    //         withCredentials: true
    //     },
    //     url: URL_BASE + '/books/open/tag/type/list',
    //     type: 'get',
    //     success: function (data) {
    //         var html = '<span class="index" value="0">全部</span>';
    //         for (var i in data) {
    //             if (data[i].id != '0')
    //                 html += '<span value="{0}">{1}</span>'.format(data[i].id, data[i].name);
    //         }
    //         $('.book .sort').append(html);
    //         $(".book .sort span").click(function(){
    //             $(this).siblings().attr("class","");
    //             $(this).attr("class","index");
    //
    //             has_load_book = false;
    //             load_book(Number($(this).attr('value')), 1);
    //
    //         });
    //
    //         $.ajax({
    //
    //         });
    //
    //         load_book(0, 1);
    //     },
    //     error: error_handler()
    // })
}

function load_book(type, page) {
    var html = '';
    curr_type = type;
    $.ajax({
        xhrFields: {
            withCredentials: true
        },
        type: 'GET',
        url: URL_BASE + '/books/web/library/list',
        data: {
            page: page - 1,
            typeId: type,
            itemPerPage: BOOK_PER_PAGE,
            startLevelScore: curr_start_score,
            endLevelScore: curr_end_score
        },
        success: function(data) {
            // alert(data.data[0]);
            //console.log(data.totalItem);
            for (var i = 0; i < data.data.length; ++i) {
                html += fill_book(data.data[i]);
            }
            $('#book_list').html(html);
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
        },
        error: ajax_error_handler
    });
}

function fill_book(data) {
    return  '<div class="list">' +
                '<div class="list-book">'+
                    '<a href="book.html?book_id=' + data.id + '">'+
                        '<div class="image">'+
                            '<img src="' + data.coverUri + '" alt=""/>'+
                            '<span>' + data.levelScore + 'ER</span>'+
                            '<div class="book-name">' + data.name + '</div>'+
                        '</div>'+
                    '</a>'+
                    '<span class="type">' + data.displayTypeName + '</span>'+
                    '<p>' + data.examStatus + '</p>'+
                '</div>'+
            '</div>';
}

$(".book .grade span").click(function(){
    $(this).siblings().attr("class","");
    $(this).attr("class","index");

    var start_score = Number($(this).attr('value'));
    // console.log(start_score);
    if (start_score == 0) {
        if (has_recommend_result) {
            curr_start_score = recommend_start_score;
            curr_end_score = recommend_end_score;
        }
        else {
            curr_start_score = 600;
            curr_end_score = 1200;
        }
    }
    else {
        curr_start_score = start_score;
        curr_end_score = start_score + 100;
    }
    has_load_book = false;
    load_book(curr_type, 1);
});


$(".book .sort span").click(function(){
    $(this).siblings().attr("class","");
    $(this).attr("class","index");

    has_load_book = false;
    load_book(Number($(this).attr('value')), 1);

});


//左上角info
(function init() {
    var join_class = function () {
        $('#join_class_modal').find('.modal-info div:nth-child(5)').html('');
        $('#join_class_modal').modal('show');
    };

    $('.info-class').click(join_class);
    $('.no-top-list .btn').click(join_class);

    $('#send_apply').click(function () {
        var join_code = $('#class_code').val();
        console.log(join_code);
        if (join_code == '')
            return;
        var error_message = $('#join_class_modal').find('.modal-info div:nth-child(5)');
        //检查班级code是否有效
        $.ajax({
            xhrFields: {
                withCredentials: true
            },
            type: 'post',
            url: URL_BASE + '/users/web/join/checkClassJoinCode',
            data: {
                joinCode: join_code
            },
            success: function (data) {
                error_message.html('&nbsp;');
                $.ajax({
                    xhrFields: {
                        withCredentials: true
                    },
                    type: 'post',
                    url: URL_BASE + '/users/web/join/studentJoinClass',
                    data: {
                        joinCode: join_code
                    },
                    success: function (data) {
                        $('#join_class_modal').modal('hide');
                        my_tip.alert('你的加入班级申请已发送，老师审核通过后即可加入班级');
                        check_join_status();
                    },
                    error: error_handler()
                });
            },
            error: error_handler({400: function () {
                error_message.html('班级代码错误，请核对');
            }})
        });

    })

})();
//首页头像更新
function load_info(){
    $.ajax({
        xhrFields: {
            withCredentials: true
        },
        type: 'GET',
        url: URL_BASE + '/users/web/user/current',
        success: function(data) {
            //console.log(data);
            $(".head-img img").attr('src',data.headimg);
            $('.name').html(data.name);
            $('.info-name').html(data.name);
            $('.info-account').append(data.account);
            $('.info-school').html(data.school.name);
            $('.modal-avatar img').attr('src', data.headimg);
            if (data.schoolClass) {
                // 如果有班级
                $('.info-class').html(data.schoolClass.name).off('click').css('cursor', 'text');
                $('.top-list').show();
                $('.no-top-list').hide();
            }
        },
        error: error_handler()
    });
}

function check_join_status() {
    $.ajax({
        xhrFields: {
            withCredentials: true
        },
        type: 'get',
        url: URL_BASE + '/users/web/join/checkJoinClassRequest',
        success: function (data) {
            console.log(data)
            // 应该是两种状态：有 无
            var flag = data.hasRequest;
            if (flag) {
                // 正在审核
                $('.top-list').hide();
                $('.no-top-list').show();
                $('.info-class').html('加入班级<span style="color: #3c97cf">审核中</span>');
                $('.no-top-list .btn').html('正在审核').addClass('disabled');
            }
        },
        error: error_handler()
    });
}