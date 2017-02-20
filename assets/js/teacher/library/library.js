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

//按阅读班级筛选
$(".book .className").on('click','span',function(){
    $(this).siblings().attr("class","");
    $(this).attr("class","index");
    has_load_book = false;
    load_book($(".book .sort .index").attr('value'),1,$(this).attr('value'));

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
                    '<a onclick="window.open(\'book.html?book_id=' + data.id + '\');">'+
                        '<div class="image">'+
                            '<img src="' + data.coverUri + '" alt=""/>'+
                            '<span>'+ data.levelScore +'ER</span>'+
                            '<div class="book-name">' + data.name + '</div>'+
                        '</div>'+
                    '</a>'+
                    // '<div class="already-reading">' +
                    //     '<span>'+ data.studentReadCount +'</span>位同学已读完' +
                    // '</div>' +
                    '<span class="type">' + data.displayTypeName + '</span>'+
                    '<p>' + data.examStatus + '</p>'+
                '</div>'+
            '</div>';
}

//生成对应班级得图书列表
function fill_class_books(data){
    return  '<div class="list">' +
            '<div class="list-book">'+
            '<a onclick="window.open(\'book.html?book_id=' + data.id + '\');">'+
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
            if (data && data.length > 0) {
                var html = '';
                var i = 0;
                for (i = 0; i < data.length; ++i) {
                    html += '<div class="class_elem">{0}</div>'.format(data[i].name);
                }
                $('.own-class-info').append(html).show();
                $('.no-class').hide();
            }
            else {
                $('.own-class-info').hide();
                $('.no-class').show();
            }
            //console.log(data);
            for(var i = 0; i < data.length; ++i){
                html += fill_classname(data[i]);
            }
            $(".className p").after(html);
            $(".className span").eq(0).addClass("index");
            $(".books .statistics span").html(data.totalItem);
            gen_book_type();
            load_book(0,1);
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
            itemPerPage: BOOK_PER_PAGE
        },
        type: 'GET',
        url: URL_BASE + '/tasks/web/task/teacher/current/list',
        success: function(data) {
            // console.log(data);
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
        },
        error: error_handler()
    })
}

