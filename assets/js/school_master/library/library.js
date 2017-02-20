/**
 * Created by yilong on 2016/11/7.
 */

var curr_type = 0;
var curr_start_score = 150;
var curr_end_score = 1100;
var has_load_book = false;
var BOOK_PER_PAGE = 9;

function left_bar_cb() {
    $('#library_button').attr('class', 'side-button-selected left-side-button');
}
//按书籍类型筛选
$(".book .sort span").click(function(){
    $(this).siblings().attr("class","");
    $(this).attr("class","index");

    has_load_book = false;
    load_book(Number($(this).attr('value')), 1);

});
//按阅读等级筛选
$(".book .read-lv .lv_button span").click(function(){
    $(this).siblings().removeClass('index');
    $(this).addClass('index');
});

$(".book .grade span").click(function(){
    $(this).siblings().attr("class","");
    $(this).attr("class","index");

    var start_score = Number($(this).attr('start'));
    var end_score = Number($(this).attr('end'));
    // console.log(start_score);
    if (start_score == 0) {
        curr_start_score = 150;
        curr_end_score = 1100;
    }
    else {
        curr_start_score = start_score;
        curr_end_score = end_score;
    }
    has_load_book = false;
    load_book(curr_type, 1);
});

//自主选择阅读等级事件
$(".btn-sure").on('click',function(){
    if($(".num-min").val() !== '' || $(".num-max").val() !== ''){
        curr_start_score = $(".num-min").val();
        curr_end_score = $(".num-max").val();
        has_load_book = false;
        load_book(Number($(".book .sort .index").attr('value')),1,$(".book .className .index").attr('value'));
    }
});
//清除输入框
$(".btn-clear").on('click',function(){
    $(".num-min").val('');
    $(".num-max").val('');
});


//加载图书  可按照阅读等级
function load_book(type,page,classId) {
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
            classId : classId,
            startLevelScore: curr_start_score,
            endLevelScore: curr_end_score
        },
        success: function(data) {
            console.log(data.data[0]);
            for (var i = 0; i < data.data.length; ++i) {
                html += fill_book(data.data[i]);
            }
            $('#book_list').html(html);
            $(".books .statistics span").html(data.totalItem);
            //分页
            if(!has_load_book){
                has_load_book = true;
                var page_count = Math.ceil((data.totalItem * 1.0/ data.itemPerPage));
                $('#teacher_task_pagination').createPage({
                    pageCount:page_count,
                    current:1,
                    backFn:function(p){
                        load_book(curr_type,p);
                    }
                })
            }
        }
    });
}

//生成图书馆图书列表
function fill_book(data) {
    return  '<div class="list">' +
            '<div class="list-book">'+
            '<a onclick="window.open(\'book.html?book_id=' + data.id + '\');">'+
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
            //按书籍类型筛选
            $(".book .sort span").click(function(){
                $(this).siblings().attr("class","");
                $(this).attr("class","index");

                has_load_book = false;
                load_book(Number($(this).attr('value')), 1);
            });
            load_book(0,1);
        },
        error: error_handler()
    })
}
