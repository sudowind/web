/**
 * Created by wind on 2016/12/16.
 * 图表相关的函数
 */

function load_rank_list(current, grade) {
    var url = '';
    var data = {};
    if (current == 'student') {
        url = URL_BASE + '/statistic/web/rankList/student/current';
    }
    else {
        url = URL_BASE + '/statistic/web/rankList';
        data = {
            grade: grade
        }
    }
    $.ajax({
        xhrFields: {
            withCredentials: true
        },
        url: url,
        type: 'get',
        data: data,
        success: function (data) {
            //console.log(data)
            var html = '';
            var list_data;
            if (current == 'student') {
                var my_data = data.myRank;
                html = '<div class="me">' +
                    '<div class="me-rank">' + my_data.rank + '</div>' +
                    '<img src="' + my_data.user.headimg + '" alt=""/>' +
                    '<div class="me-right">' +
                    '<p class="me-name">' + my_data.user.name + '</p>' +
                    '<strong><span>' + my_data.rankValue + '</span>字</strong>' +
                    '</div>' +
                    '</div>';
                list_data = data.topList;
            }
            else {
                list_data = data;
            }

            html += '<ul>';
            for (var i in list_data) {
                var tmp = list_data[i];
                var onclick_html = '';
                if (current !== 'student') {
                    onclick_html = 'style="cursor: pointer;" onclick="window.open(\'../report/student_report.html?student_id={0}\', \'_self\')"'.format(tmp.user.id);
                }
                html += '<li ' + onclick_html + '>' +
                    '<div class="rank" >' + tmp.rank + '</div>' +
                    '<img class="head" src="' + tmp.user.headimg + '" alt=""/>' +
                    '<div class="right">' +
                    '<p class="name">' + tmp.user.name + '</p>' +
                    '<strong><span>' + tmp.rankValue + '</span>字</strong>' +
                    '</div>' +
                    '</li>';
            }
            html += '</ul>';
            $('.top-list').html(html);
        },
        error: error_handler()
    });
}

function set_ability_analysis_option(data) {
    var u_data = [0, 0, 0, 0, 0], c_data = [0, 0, 0, 0, 0], g_data = [0, 0, 0, 0, 0];
    for (var i in data.studentAbility) {
        u_data[data.studentAbility[i].id - 1] = Math.ceil(data.studentAbility[i].score * 100);
    }
    for (var i in data.classAbility) {
        c_data[data.classAbility[i].id - 1] = Math.ceil(data.classAbility[i].score * 100);
    }
    for (var i in data.gradeAbility) {
        g_data[data.gradeAbility[i].id - 1] = Math.ceil(data.gradeAbility[i].score * 100);
    }
    // console.log(u_data);
    // console.log(c_data);
    // console.log(g_data);
    return {
        tooltip: {
            trigger: 'axis'
        },
        legend: {
            data: ['我的平均分', '班级平均分', '年级平均分']
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
        xAxis: [
            {
                type: 'value',
                max: '100'
            }
        ],
        yAxis: [
            {
                type: 'category',
                data: ['评价赏析', '组织概况', '语义推论', '意义构建', '信息提取'],
                axisTick: {

                }
            }
        ],
        grid: {
            left: '20%'
        },
        series: [
            {
                name: '我的平均分',
                type: 'bar',
                data: u_data,
                itemStyle:{
                    normal:{
                        color:['#febc3c']
                    }
                }
            },
            {
                name: '班级平均分',
                type: 'bar',
                data: c_data,
                itemStyle:{
                    normal:{
                        color: ['#d8d8d8']
                    }
                }
            },
            {
                name: '年级平均分',
                type: 'bar',
                data: g_data,
                itemStyle: {
                    normal:{
                        color:['#eb8155']
                    }
                }
            }
        ]
    };
}

function load_student_class_rank(current, class_id) {
    var url;
    var data = {};
    if (current == 'student') {
        url = '/statistic/web/timeline/student/current/studentClassRank';
    }
    else {
        url = '/statistic/web/timeline/class/{0}/classInfoInGrade'.format(class_id);
        data = {
            startTime: 0,
            endTime: 0
        }
    }
    // console.log(url);
    $.ajax({
        xhrFields: {
            withCredentials: true
        },
        url: URL_BASE + url,
        type: 'get',
        data: data,
        success: function (data) {
            var read_obj = $('#reading_rank');
            var exam_obj = $('#exam_rank');
            read_obj.css('width', (safe_divide(data.reading.rank * 100, data.reading.total)).toString() + '%');
            exam_obj.css('width', (safe_divide(data.exam.rank * 100, data.exam.total)).toString() + '%');
            read_obj.find('.current-page').html(data.reading.rank);
            exam_obj.find('.current-page').html(data.exam.rank);
            read_obj.find('.page').html(data.reading.total);
            exam_obj.find('.page').html(data.exam.total);
            read_obj.siblings('.rank-message').find('.current-page').html(data.reading.rank);
            read_obj.siblings('.rank-message').find('.page').html(data.reading.total);
            exam_obj.siblings('.rank-message').find('.current-page').html(data.exam.rank);
            exam_obj.siblings('.rank-message').find('.page').html(data.exam.total);
        },
        error: error_handler()
    });
}
