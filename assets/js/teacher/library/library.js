/**
 * Created by yilong on 2016/11/7.
 */
$(".book .grade span").click(function(){
    $(this).siblings().attr("class","");
    $(this).attr("class","index");
})
$(".book .sort span").click(function(){
    $(this).siblings().attr("class","");
    $(this).attr("class","index");
})
$(".book .read-lv .button span").click(function(){
    $(this).siblings().attr("class","");
    $(this).attr("class","index");
})

var curr_type = 0;
var curr_start_score = 600;
var curr_end_score = 1200;



function load_book(type, page) {
    var html = '';
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
            console.log(data);
            for (var i = 0; i < data.data.length; ++i) {
                html += fill_book(data.data[i]);
            }
            $('.statistics').after(html);
        }
    });
}

function fill_book(data) {
    return  '<div class="list">' +
                '<div class="list-book">'+
                    '<a href="book.html?book_id=' + data.id + '">'+
                        '<div class="image">'+
                            '<img src=../../../assets/img/1.png alt=""/>'+
                            '<span>'+ data.levelScore +'</span>'+
                            '<div class="book-name">' + data.name + '</div>'+
                        '</div>'+

                    '</a>'+
                    '<div class="already-reading">' +
                        '<span>'+ data.studentReadCount +'</span>位同学已读' +
                    '</div>' +
                    '<span class="type">' + data.displayTypeName + '</span>'+
                    '<p>有题</p>'+
                '</div>'+
            '</div>';
}
