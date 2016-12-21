/**
 * Created by wind on 2016/10/10.
 */

// 左右导航栏的回调函数
function left_bar_cb() {
    $('#report_button').attr('class', 'side-button-selected left-side-button');
}

//简介与评论之间的tab切换函数
var button_ids = ['count', 'ability'];

function on_button_click(e) {
    //alert($(e).attr('id'));
    if ($(e).attr('value') == '0') {
        for (var i = 0; i < button_ids.length; ++i) {
            var curr_id = button_ids[i] + '_button';

            if (curr_id != $(e).attr('id')) {
                $('#'+ curr_id).css('color', '#000000').attr('value', '0').css('background', '#f9f9f9');
                $('#'+ curr_id + ' img').attr('src', '../../../assets/img/teacher/report/' + button_ids[i] + '_unselected.png');
                $('#' + button_ids[i] + '_part').css('display', 'none');
            }
            else {
                $('#'+ curr_id).css('color', '#ffffff').attr('value', '1').css('background', '#fb9e1d');
                $('#'+ curr_id + ' img').attr('src', '../../../assets/img/teacher/report/' + button_ids[i] + '_selected.png');
                $('#' + button_ids[i] + '_part').css('display', 'block');
            }
        }
        if ($(e).attr('id') == 'count_button') {
            load_chart('count_figure');
        }
        else {
            load_chart('ability_figure');
        }
    }
}

$('.slide-button').click(function () {
    $('.book-info-box').fadeOut(function() {
        change_slide(Number($(this).attr('value')));
        $('.book-info-box').fadeIn();
    });
});

var reading_book = [];
var read_book = [];
var currend_no = 0;

// 以下两个函数用来实现左右切换的功能
function load_slide(index) {
    currend_no = index;
    var data = reading_book[index];
    var percent = Math.ceil(data.currentPage * 100.0 / data.totalPage);
    $('#book_name').html('<h3>' + data.book.name + '</h3>');
    $('#author').html('作者：' + data.book.author);
    $('#percent').html(percent);
    $('.progress-bar').css('width', percent.toString() + '%');
    $('.book-image img').attr('src', data.book.coverUri);
}

function change_slide(dir) {
    var next_no = 0;
    if (dir > 0) {
        // 表示向右
        next_no = currend_no + 1;
        if (next_no == reading_book.length)
            next_no = 0;
    }
    else {
        // 表示向左
        next_no = currend_no - 1;
        if (next_no == -1)
            next_no = reading_book.length - 1;
    }
    load_slide(next_no);
}

// 前端实现下方翻页
var has_load_page = false;
function load_read_book(page) {
    // 书已经事先存好，每页显示4个
    var html = '';
    var start_no = (page - 1) * 4;
    var end_no = start_no + 4;
    if (end_no > read_book.length)
        end_no = read_book.length;
    for (var i = 0; i < end_no - start_no; ++i) {
        var data = read_book[start_no + i];
        html += '<div class="read-book" data-toggle="tooltip" title="查看详情" onclick="window.open(\'detail.html?book_id=' + data.bookId + '&student_id=' + $.getUrlParam('student_id') + '&task_id=' + data.id + '\', \'_self\')">' +
            '<img src="' + data.book.coverUri +'" alt="">' +
            '<span>' + data.book.levelScore + '</span>' +
            '<div class="book-name">' + data.book.name + '</div>' +
            '<div class="read-interval">09.01-10.26</div>' +
            '</div>';

    }
    $('#select_book_content').html(html);
    if (!has_load_page) {
        has_load_page = true;
        var page_count = Math.ceil(read_book.length / 4);
        $('#book_pagination').createPage({
            pageCount: page_count,
            current: 1,
            backFn: function(p) {
                load_read_book(p);
            }
        })
    }
}

function load_chart(element_id) {
    var myChart = echarts.init(document.getElementById(element_id));
    if (element_id.indexOf('count') >= 0) {
        var start_time = 1481877328616;
        var end_time = 1481878441981;
        var step = 100000;
        $.ajax({
            xhrFields: {
                withCredentials: true
            },
            type: 'get',
            url: URL_BASE + '/statistic/web/timeline/student/{0}/studentTimeline'.format($.getUrlParam('student_id')),
            data: {
                startTime: start_time,
                endTime: end_time,
                step: step
            },
            success: function (data) {
                var index = [];
                for (var i = start_time; i < end_time; i += step) {
                    index.push(i);
                }
                myChart.setOption(set_option('line', data, index));
            },
            error: error_handler()
        });
    }
    else {
        $.ajax({
            xhrFields: {
                withCredentials: true
            },
            url: URL_BASE + '/statistic/web/timeline/student/{0}/studentCurrentInfo'.format($.getUrlParam('student_id')),
            type: 'get',
            success: function (data) {
                myChart.setOption(set_option('bar', data));
            },
            error: error_handler()
        });
    }
}

var sort_func = function(a, b) {
    return a.timestamp - b.timestamp;
};

function set_option(chart_type, data, index) {
    if (chart_type == 'line') {
        var student_list = [];
        var class_list = [];
        var school_list = [];

        var u_data = data.studentReadingTimeline.sort(sort_func);
        var c_data = data.classReadingTimeline.sort(sort_func);
        var s_data = data.gradeReadingTimeline.sort(sort_func);

        for (var i in index) {
            if (u_data[0] && u_data[0].timestamp == index[i]) {
                student_list.push(u_data.shift().wordCount);
            }
            else {
                student_list.push(0);
            }

            if (c_data[0] && c_data[0].timestamp == index[i]) {
                class_list.push(c_data.shift().wordCount);
            }
            else {
                class_list.push(0);
            }

            if (s_data[0] && s_data[0].timestamp == index[i]) {
                school_list.push(s_data.shift().wordCount);
            }
            else {
                school_list.push(0);
            }
        }

        return {
            tooltip: {
                trigger: 'axis'
            },
            legend: {
                data: ['个人', '班级平均', '年级平均']
            },
            toolbox: {
                show: false,
                feature: {
                    magicType: {show: true, type: ['line', 'bar']},
                    restore: {show: true},
                    saveAsImage: {show: true}
                }
            },
            //calculable: true,
            yAxis: [
                {
                    type: 'value'
                }
            ],
            xAxis: [
                {
                    type: 'category',
                    data: ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月']
                }
            ],
            // grid: {
            //     left: '20%'
            // },
            series: [
                {
                    name: '个人',
                    type: 'line',
                    data: student_list,
                    areaStyle: {
                        normal: {}
                    },
                    smooth: true,
                    itemStyle: {
                        normal: {
                            color: ['#febc3c']
                        }
                    }
                },
                {
                    name: '班级平均',
                    type: 'line',
                    data: class_list,
                    areaStyle: {
                        normal: {}
                    },
                    smooth: true,
                    itemStyle: {
                        normal: {
                            color: ['#d8d8d8']
                        }
                    }
                },
                {
                    name: '年级平均',
                    type: 'line',
                    data: school_list,
                    areaStyle: {
                        normal: {}
                    },
                    smooth: true,
                    itemStyle: {
                        normal: {
                            color: ['#eb8155']
                        }
                    }
                }
            ]
        };
    }
    else {
        var option = set_ability_analysis_option(data);
        option.grid = {
            left: '17%'
        };
        return option;
    }
}

function init() {
    // 加载学生个人信息
    $.ajax({
        xhrFields: {
            withCredentials: true
        },
        type: 'get',
        url: URL_BASE + '/users/web/user/' + $.getUrlParam('student_id'),
        success: function (data) {
            $('#student_name').html(data.name);
            $('#school_name').html(data.school.name);
            $('#class_name').html(data.classes[0].name);
            $('.student-img').find('img').attr('src', data.headimg);
        }
    });
    // 加载正在阅读的书
    $.ajax({
        xhrFields: {
            withCredentials: true
        },
        type: 'get',
        url: URL_BASE + '/tasks/web/task/student/' + $.getUrlParam('student_id') + '/list',
        success: function (data) {
            for (var i = 0; i < data.length; ++i) {
                if (data[i].status == 4) {
                    read_book.push(data[i]);
                }
                else {
                    reading_book.push(data[i]);
                }
            }
            load_slide(0);
            load_read_book(1);
        }
    });
    // 加载已经读完的书
}