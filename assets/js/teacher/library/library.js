/**
 * Created by yilong on 2016/11/7.
 */

var curr_type = 0;
var curr_start_score = 0;
var curr_end_score = 0;
var has_load_book = false;

function right_bar_cb() {
    $('#library_button').attr('class', 'side-button-selected left-side-button');
}
//按书籍类型筛选
$(".book .sort span").click(function(){
    $(this).siblings().attr("class","");
    $(this).attr("class","index");

    has_load_book = false;
    load_book(Number($(this).attr('value')), 1);

});
//按阅读班级筛选
$(".book .className").on('click','span',function(){
    $(this).siblings().attr("class","");
    $(this).attr("class","index");

    has_load_book = false;
    load_book($(".book .sort .index").attr('value'),1,$(this).attr('value'));

});
//按阅读等级筛选
$(".book .read-lv .lv_button span").click(function(){
    $(this).siblings().attr("class","");
    $(this).attr("class","index");
});

$(".book .grade span").click(function(){
    $(this).siblings().attr("class","");
    $(this).attr("class","index");

    var start_score = Number($(this).attr('value'));
    console.log(start_score);
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

//自主选择阅读等级事件
$(".btn-sure").on('click',function(){
    if($(".num-min").val() !== ''){
        curr_start_score = $(".num-min").val();
        has_load_book = false;
        console.log($(".book .sort .index").attr('value'))
        load_book(Number($(".book .sort .index").attr('value')),1,$(".book .className .index").attr('value'));
    }
    if($(".num-max").val() !== ''){
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
            itemPerPage: 8,
            classId : classId,
            startLevelScore: curr_start_score,
            endLevelScore: curr_end_score
        },
        success: function(data) {
            //console.log(data);
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
                    '<a href="book.html?book_id=' + data.id + '">'+
                        '<div class="image">'+
                            '<img src=' + data.coverUri + ' alt=""/>'+
                            '<span>'+ data.levelScore +'</span>'+
                            '<div class="book-name">' + data.name + '</div>'+
                        '</div>'+
                    '</a>'+
                    '<div class="already-reading">' +
                        '<span>'+ data.studentReadCount +'</span>位同学已读完' +
                    '</div>' +
                    '<span class="type">' + data.displayTypeName + '</span>'+
                    '<p>有题</p>'+
                '</div>'+
            '</div>';
}

//生成对应班级得图书列表
function fill_class_books(data){
    return  '<div class="list">' +
            '<div class="list-book">'+
            '<a href="book.html?book_id=' + data.id + '">'+
            '<div class="image">'+
            '<img src="" alt=""/>'+
            '<span>'+ data.levelScore +'</span>'+
            '<div class="book-name">' + data.name + '</div>'+
            '</a>'+
            '<div class="already-reading">' +
            '<span>'+ data.studentReadCount +'</span>位同学已读完' +
            '</div>' +
            '<span class="type">' + data.displayTypeName + '</span>'+
            '<p>有题</p>'+
            '</div>'+
            '</div>';
}

//生成班级button
function fill_classname(data){

    return    '<span value="'+ data.id +'">'+ data.name + '</span>';
}


//获取老师所带班级
function load_classname(){
    var html = '';
    $.ajax({
        xhrFields: {
            withCredentials: true
        },
        type: 'GET',
        url: URL_BASE + '/users/web/class/teacher/current/list',
        success: function(data) {
            //console.log(data);
            for(var i = 0; i < data.length; ++i){
                html += fill_classname(data[i]);
            }
            $(".className p").after(html);
            $(".className span").eq(0).addClass("index");
            $(".books .statistics span").html(data.totalItem);
            load_book(Number($(".book .sort .index").attr('value')),1,data[0].id);
        }
    });
}


//获取老师所带班级各班对应的书籍
function load_class_books(classId,page){
    var html = '';
    $.ajax({
        xhrFields: {
            withCredentials: true
        },
        data:{
            classId : classId,
            page : page - 1,
            itemPerPage: 8
        },
        type: 'GET',
        url: URL_BASE + '/tasks/web/task/teacher/current/list',
        success: function(data) {
            console.log(data);
            for (var i = 0; i < data.data.length; ++i) {
                 html += fill_class_books(data.data[i].book);
            }
            $('#book_list').html(html);
            //分页
            if(!has_load_book){
                has_load_book = true;
                var page_count = Math.ceil((data.totalItem * 1.0/ data.itemPerPage));
                $('#teacher_task_pagination').createPage({
                    pageCount:page_count,
                    current:1,
                    backFn:function(p){
                        load_class_books(curr_type,p);
                    }
                })
            }
        }
    });
}

