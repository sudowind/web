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

var has_load_book = false;

function gen_book_type() {
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
            load_book(0, 1);
        },
        error: error_handler()
    })
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
            itemPerPage: 8,
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
                            '<span>' + data.levelScore + '</span>'+
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
        curr_start_score = 600;
        curr_end_score = 1200;
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

