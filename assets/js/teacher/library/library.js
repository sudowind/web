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


function load_book(type, grade, page) {
    var html = '';

    $.ajax({
        xhrFields: {
            withCredentials: true
        },
        type: 'GET',
        url: 'http://debian8-01.internal.enjoyreading.com:8081/books/web/library/list',
        data: {
            page: page,
            typeId: type,
            gradeId: grade
        },
        success: function(data) {
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
                            '<span>0.0</span>'+
                            '<div class="book-name">' + data.name + '</div>'+
                        '</div>'+
                    '</a>'+
                    '<div class="already-reading">' +
                        '<span>1</span>位同学已读' +
                    '</div>' +
                    '<span class="type">' + data.displayTypeName + '</span>'+
                    '<p>有题</p>'+
                '</div>'+
            '</div>';
}
