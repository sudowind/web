/**
 * Created by wind on 2016/10/31.
 */
// 左右导航栏的回调函数
function left_bar_cb() {
    $('#library_button').attr('class', 'side-button-selected left-side-button');
}

function load_book(type, grade, page) {
    var html = '';

    $.ajax({
        xhrFields: {
            withCredentials: true
        },
        type: 'GET',
        url: 'http://debian8-01.internal.enjoyreading.com:8081/library/web/book/list',
        data: {
            page: page,
            typeId: type,
            gradeId: grade
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
                            '<span>0.0</span>'+
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
})
$(".book .sort span").click(function(){
    $(this).siblings().attr("class","");
    $(this).attr("class","index");
})

