/**
 * Created by yilong on 2016/11/1.
 */
function left_bar_cb() {
    $('#report_button').attr('class', 'side-button-selected left-side-button');
}

//自动生成列表
function init() {
    for (var i = 0; i <= 6; ++i) {
        load_table_classes('#cla-row' + i);
    }
    for (var i = 0;i <= 10 ;i ++){
        load_table_student('#stu-row' + i);
    }
}

//班级表现的函数
function load_table_classes (row_selector) {
    var sort = '1';
    var classes = '10010';
    var read_num = '50';
    var book_num = '90';
    var accuracy = '60';
    $(row_selector).load('../../../include/html/teacher/report_classes_show.html', function () {
        $(row_selector + ' .sort').html(sort);
        $(row_selector + ' .classes').html(classes);
        $(row_selector + ' .read-num').html(read_num);
        $(row_selector + ' .book-num').html(book_num);
        $(row_selector + ' .accuracy').html(accuracy + '%');
    });
}


//学生表现的函数
function load_table_student (stu_selector){
    var sort = '1';
    var name = '易峰';
    var read_num = '50';
    var book_num = '90';
    var accuracy = '60';
    var operation = '查看';
    $(stu_selector).load('../../../include/html/teacher/report_student_show.html', function () {
        $(stu_selector + ' .sort').html(sort);
        $(stu_selector + ' .name').html(name);
        $(stu_selector + ' .read-num').html(read_num);
        $(stu_selector + ' .book-num').html(book_num);
        $(stu_selector + ' .accuracy').html(accuracy + '%');
        $(stu_selector + ' .operation').html('<a href="#">'+ operation +'</a>');
    });
}


//简介与评论之间的tab切换函数
var button_ids = ['classes', 'student'];

function on_button_click(e) {
    //alert($(e).attr('id'));
    if ($(e).attr('value') == '0') {
        for (var i = 0; i < button_ids.length; ++i) {
            var curr_id = button_ids[i] + '_button';
            if (curr_id != $(e).attr('id')) {
                $('#'+ curr_id).css('color', '#000000').attr('value', '0').css('background', '#f9f9f9');
                $('#'+ curr_id + ' img').attr('src', '../../../assets/img/teacher/' + button_ids[i] + '_selected.png');
                $('.' + button_ids[i] + '-part').css('display', 'none');
            }
            else {
                $('#'+ curr_id).css('color', '#ffffff').attr('value', '1').css('background', '#fb9e1d');
                $('#'+ curr_id + ' img').attr('src', '../../../assets/img/teacher/' + button_ids[i] + '_unselected.png');
                $('.' + button_ids[i] + '-part').css('display', 'block');
            }
        }
    }
}

//选择班级的 tab 切换
$(".right .option span").click(function(){
    $(this).siblings().removeClass("index");
    $(this).addClass("index");
});

var class_performance;
var student_performance;

function load_class_performance() {
    $.ajax({
        success: function(data) {
            // 将数据加载到变量中
            class_performance = data;
        }
    });
}

function load_student_performance() {
    $.ajax({
        success: function (data) {
            student_performance = data;
        }
    });
}

function load_table(page, elem_per_page, sort_by,  order, type) {
    // type 表示要加载班级表格还是学生表格
    // 加载出表格
    var data;
    var dom_elem;
    if (type == 'class') {
        data = class_performance.slice();
        dom_elem = '.classes-info-part table';
    }
    else {
        data = student_performance.slice();
        dom_elem = '.student-show-list table';
    }

    data = data.sort(function(a, b){
        if (order == 'reverse') {
            return b[sort_by] - a[sort_by];
        }
        return a[sort_by] - b[sort_by];
    });

    var start_index = (page - 1) * elem_per_page;
    var end_index = start_index + elem_per_page;
    if (end_index > data.length) {
        end_index = data.length;
    }

    var html = '<tbody>';
    for (var i = start_index; i < end_index; ++i) {
        html += '';
    }
    html += '</tbody>';
    $(dom_elem).append(html);

}

$('.sortable-column').click(function () {
    // alert($(this).find('img').attr('src'));
    var obj = $(this);
    var img_src = obj.find('img').attr('src');
    if (img_src.indexOf('up') > 0) {
        obj.find('img').attr('src', '../../../assets/img/teacher/down_triangle.png')
    }
    else if (img_src.indexOf('down') > 0) {
        obj.find('img').attr('src', '../../../assets/img/teacher/up_triangle.png')
    }
    else {
        obj.find('img').attr('src', '../../../assets/img/teacher/down_triangle.png')
    }

    obj.siblings('.sortable-column').removeClass('column-index').find('img').attr('src', '../../../assets/img/teacher/sort.png');
    obj.addClass('column-index');
});

function load_leaderboard() {
    // 加载学霸榜
    var html = '';
    $.ajax({
        success: function (data) {
            for (var i in data) {
                html += '';
            }
        }
    });
}