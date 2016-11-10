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

function load_book(type, page) {
    var html = '';
    curr_type = type;
    $.ajax({
        xhrFields: {
            withCredentials: true
        },
        type: 'GET',
        url: 'http://debian8-01.internal.enjoyreading.com:8081/books/web/library/list',
        data: {
            page: page - 1,
            typeId: type,
            itemPerPage: 8,
            startLevelScore: curr_start_score,
            endLevelScore: curr_end_score
        },
        success: function(data) {
            // alert(data.data[0]);
            for (var i = 0; i < data.data.length; ++i) {
                html += fill_book(data.data[i]);
            }
            $('#book_list').html(html);
        }
    });
}

function fill_book(data) {
    return  '<div class="list">' +
                '<div class="list-book">'+
                    '<a href="book.html?book_id=' + data.id + '">'+
                        '<div class="image">'+
                            '<img src=../../../assets/img/1.png alt=""/>'+
                            '<span>' + data.levelScore + '</span>'+
                            '<div class="book-name">' + data.name + '</div>'+
                        '</div>'+
                    '</a>'+
                    '<span class="type">' + data.displayTypeName + '</span>'+
                    '<p>有题</p>'+
                '</div>'+
            '</div>';
}

$(".book .grade span").click(function(){
    $(this).siblings().attr("class","");
    $(this).attr("class","index");

    var start_score = Number($(this).attr('value'));
    if (start_score == 0) {
        curr_start_score = 600;
        curr_end_score = 1200;
    }
    else {
        curr_start_score = start_score;
        curr_end_score = start_score + 100;
    }

    load_book(curr_type, 1);

    $('#book_pagination').fillPage({
        pageCount: 20,
        current: 1
    });
});
$(".book .sort span").click(function(){
    $(this).siblings().attr("class","");
    $(this).attr("class","index");

    load_book(Number($(this).attr('value')), 1);

    $('#book_pagination').fillPage({
        pageCount: 20,
        current: 1
    });
});

