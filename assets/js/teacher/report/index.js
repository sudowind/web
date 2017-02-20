/**
 * Created by yilong on 2016/11/1.
 */
function right_bar_cb() {
    $('#report_button').attr('class', 'side-button-selected left-side-button');
}

function clear_table() {
    $('.classes-info-part table tbody').html();
    $('.student-show-list table tbody').html();
}

//自动生成列表
function init() {

    // 加载老师班级信息，加载学霸榜
    $.ajax({
        xhrFields: {
            withCredentials: true
        },
        url: URL_BASE + '/users/web/class/teacher/current/list',
        type: 'get',
        success: function (data) {
            var html = '<span class="index" value="{0}" grade="{2}">{1}</span>'.format(data[0].id, data[0].name, data[0].grade);
            for (var i = 1; i < data.length; ++i) {
                html += '<span value="{0}" grade="{2}">{1}</span>'.format(data[i].id, data[i].name, data[i].grade);
            }
            $('#teacher_classes').append(html).find('span').click(function() {
                $(this).siblings().removeClass("index");
                $(this).addClass("index");
                load_rank_list('teacher', $(this).attr('grade'));
                load_class_performance($(this).attr('value'));
                load_student_performance($(this).attr('value'));
                load_student_class_rank('school_master', $(this).attr('value'));
            });
            if (data.length > 0) {
                load_rank_list('teacher', data[0].grade);
                load_student_class_rank('school_master', data[0].id);
                load_class_performance(data[0].id);
                load_student_performance(data[0].id);
            }

        },
        error: error_handler()
    });
}
var class_performance;
var student_performance;
var curr_tab = 'class';
var class_has_load_page = false;
var student_has_load_page = false;

var ELEM_PER_PAGE_CLASS = 6;
var ELEM_PER_PAGE_STUDENT = 10;

var student_sort_by = 'wordCount';
var student_order = 'reverse';
var class_sort_by = 'wordCount';
var class_order = 'reverse';

//简介与评论之间的tab切换函数
var button_ids = ['classes', 'student', 'people'];

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
        if ($(e).attr('btn-type') == 'classes') {
            curr_tab = 'class';
        }
        else {
            curr_tab = 'student';
        }
    }
}

//选择班级的 tab 切换
$(".right .option span").click(function(){
    clear_table();
    $(this).siblings().removeClass("index");
    $(this).addClass("index");
    load_student_class_rank('teacher', $(this).attr('value'));
});

function load_class_performance(class_id) {
    class_has_load_page = false;
    var semester = get_current_semester();
    $.ajax({
        xhrFields: {
            withCredentials: true
        },
        url: URL_BASE + '/statistic/web/timeline/class/{0}/classInfoInGrade'.format(class_id),
        type: 'get',
        data: {
            startTime: semester[0],
            endTime: semester[1]
        },
        success: function(data) {
            // 将数据加载到变量中
            for (var i = 0; i < data.gradeList.length; ++i) {
                data.gradeList[i].bookCount = rand_ER();
            }
            class_performance = data.gradeList;
            load_table(1, ELEM_PER_PAGE_CLASS, class_sort_by, class_order, 'class');
        },
        error: error_handler()
    });
}

function load_student_performance(class_id) {
    student_has_load_page = false;
    var semester = get_current_semester();
    $.ajax({
        xhrFields: {
            withCredentials: true
        },
        url: URL_BASE + '/statistic/web/timeline/class/{0}/studentInfoList'.format(class_id),
        type: 'get',
        data: {
            startTime: semester[0],
            endTime: semester[1]
        },
        success: function (data) {
            for (var i = 0; i < data.length; ++i) {
                data[i].bookCount = rand_ER();
            }
            student_performance = data;
            load_table(1, ELEM_PER_PAGE_STUDENT, student_sort_by, student_order, 'student');
        },
        error: error_handler()
    });
}


function load_table(page, elem_per_page, sort_by,  order, type) {
    // type 表示要加载班级表格还是学生表格
    // 加载出表格
    var data;
    var dom_elem;
    if (type == 'class') {
        data = class_performance.slice();
        dom_elem = '.classes-info-part table tbody';
    }
    else {
        data = student_performance.slice();
        dom_elem = '.student-show-list table tbody';
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
    var html = '';
    for (var i = start_index; i < end_index; ++i) {
        var examScore;
        if (data[i].examScore == 'NaN')
            examScore = '-';
        else
            examScore = (data[i].examScore * 100).toFixed(0)+"%";
        if (type == 'class') {
            html += '<tr><td class="sort">{0}</td>'.format(i + 1) +
                '<td class="classes">{0}</td>'.format(data[i].className) +
                '<td class="read-num">{0}</td>'.format((data[i].wordCount / 10000).toFixed(2)) +
                // '<td class="book-num">{0}</td>'.format(data[i].bookCount) +
                '<td class="accuracy">{0}</td></tr>'.format(examScore);
        }
        else {
            html += '<tr><td class="sort">{0}</td>'.format(data[i].studentId) +
                '<td class="name">{0}</td>'.format(data[i].studentName) +
                '<td class="read-num">{0}</td>'.format((data[i].wordCount / 10000).toFixed(2)) +
                // '<td class="book-num">{0}</td>'.format(data[i].bookCount) +
                '<td class="accuracy">{0}</td>'.format(examScore) +
                '<td class="operation" style="cursor: pointer;" onclick="window.open(\'../report/student_report.html?student_id={0}\')">{1}</td></tr>'.format(data[i].studentId, '查看');
        }
    }
    $(dom_elem).html(html);
    if (type == 'class') {
        if (!class_has_load_page) {
            class_has_load_page = true;
            var page_count = Math.ceil(class_performance.length / elem_per_page);
            $('#class_pagination').createPage({
                pageCount: page_count,
                current: 1,
                backFn: function(p) {
                    load_table(p, elem_per_page, sort_by, order, type);
                }
            })
        }
    }
    else {
        if (!student_has_load_page) {
            student_has_load_page = true;
            var page_count = Math.ceil(student_performance.length / elem_per_page);
            $('#student_pagination').createPage({
                pageCount: page_count,
                current: 1,
                backFn: function (p) {
                    load_table(p, elem_per_page, sort_by, order, type);
                }
            })
        }
    }
}

$('.sortable-column').click(function () {
    // alert($(this).find('img').attr('src'));
    var order;
    var obj = $(this);
    var img_src = obj.find('img').attr('src');
    if (img_src.indexOf('up') > 0) {
        obj.find('img').attr('src', '../../../assets/img/teacher/down_triangle.png');
        order = 'reverse';
    }
    else if (img_src.indexOf('down') > 0) {
        obj.find('img').attr('src', '../../../assets/img/teacher/up_triangle.png');
        order = 'no-reverse';
    }
    else {
        obj.find('img').attr('src', '../../../assets/img/teacher/down_triangle.png');
        order = 'reverse';
    }

    obj.siblings('.sortable-column').removeClass('column-index').find('img').attr('src', '../../../assets/img/teacher/sort.png');
    obj.addClass('column-index');
    var elem_per_page;
    if (curr_tab == 'student') {
        student_sort_by = $(this).attr('value');
        student_order = order;
        student_has_load_page = false;
        elem_per_page = 10;
    }
    else {
        class_sort_by = $(this).attr('value');
        class_order = order;
        class_has_load_page = false;
        elem_per_page = 6;
    }

    load_table(1, elem_per_page, $(this).attr('value'), order, curr_tab);
});
