/**
 * Created by yilong on 2016/10/18.
 */
// 左右导航栏的回调函数
function left_bar_cb() {
    $('#homepage_button').attr('class', 'side-button-selected left-side-button');
}
    //条形图
var myChart = echarts.init(document.getElementById('main'));

option = {
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
            data: ['信息提取', '意义构建', '语义推论', '组织概况', '评价赏析'],
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
            data: [80, 80, 80, 80, 50],
            itemStyle:{
                normal:{
                    color:['#febc3c']
                }
            }
        },
        {
            name: '班级平均分',
            type: 'bar',
            data: [100, 90, 80, 70, 60],
            itemStyle:{
                normal:{
                    color: ['#d8d8d8']
                }
            }
        },
        {
            name: '年级平均分',
            type: 'bar',
            data: [80, 80, 80, 80, 80],
            itemStyle: {
                normal:{
                    color:['#eb8155']
                }
            }
        }
    ]
};

//饼状图
var bar = new ProgressBar.Circle('#progress_bar', {
    color: '#fb9e1d',
    strokeWidth: 12,
    trailWidth: 8,
    easing: 'easeInOut',
    duration: 1400,
    text: {
        autoStyleContainer: false
    },
    from: { color: '#fb9e1d', width: 8 },
    to: { color: '#fb9e1d', width: 12 },
    // Set default step function for all animate calls
    step: function(state, circle) {
        circle.path.setAttribute('stroke', state.color);
        circle.path.setAttribute('stroke-width', state.width);

        var value = Math.round(circle.value() * 100);
        if (value === 0) {
            circle.setText('0%');
        } else {
            circle.setText(value + '%');
        }

    }
});
//首页头像更新
function load_info(){
    $.ajax({
        xhrFields: {
            withCredentials: true
        },
        type: 'GET',
        url: URL_BASE + '/users/web/user/current',
        success: function(data) {
            //console.log(data);
            $(".head-img img").attr('src',data.headimg);
            $('.name').html(data.name);
            //$(".name span").html(data.name);
            //$(".birth span").html(data.birthday);
            //$(".email span").html(data.email);
            //$(".school span").html(data.school.name);
            //$(".class-name span").html(data.classes[0].name);
            //$(".city span").html(data.school.address);
            //$("#headimg").attr('src', data.headimg);
            //if(data.gender == 1 ){
            //    $("#boy").attr("checked","checked");
            //}else if(data.gender == 2 ){
            //    $("#girl").attr("checked","");
            //}

        },
        error: error_handler()
    });
}

function check_in() {
    $.ajax({
        xhrFields: {
            withCredentials: true
        },
        type: 'post',
        url: URL_BASE + '/statistic/web/signIn',
        success: function (data) {
            $('#check_in').unbind('click', check_in).removeClass('has-not-checked').addClass('has-checked').html('已签到');
            $('#checked_info').slideDown();
            $('#continue_count').html(data.continueCount);
        },
        error: error_handler()
    });
}

function init() {
    // 获取签到信息
    $.ajax({
        xhrFields: {
            withCredentials: true
        },
        type: 'get',
        url: URL_BASE + '/statistic/web/signIn',
        success: function (data) {
            var obj = $('#check_in');
            if (data.hasSignIn) {
                obj.html('已签到').addClass('has-checked disabled');
                $('#checked_info').show();
                $('#continue_count').html(data.continueCount);
            }
            else {
                obj.html('签到').addClass('has-not-checked');
                obj.click(check_in);
            }
        },
        error: error_handler()
    });
    // 获取排行榜信息
    load_rank_list('student');

    // 获取其他数据
    // 学生当前阅读情况
    $.ajax({
        xhrFields: {
            withCredentials: true
        },
        url: URL_BASE + '/statistic/web/timeline/student/current/studentCurrentInfo',
        type: 'get',
        success: function (data) {
            $('#book_count').html(data.studentReadingInfo.bookCount);
            $('#word_count').html(data.studentReadingInfo.wordCount);
            $('#time_count').html(Math.ceil(Number(data.studentReadingInfo.timeCount) / 60000));
            myChart.setOption(set_ability_analysis_option(data));
        },
        error: error_handler()
    });
    // 学生班级排名
    load_student_class_rank('student');
    // 获取本年度阅读进度
    var semester = get_current_semester();
    $.ajax({
        xhrFields: {
            withCredentials: true
        },
        url: URL_BASE + '/statistic/web/timeline/student/current/semesterReadingInfo',
        type: 'get',
        data: {
            startTime: semester[0],
            endTime: semester[1]
        },
        success: function (data) {
            $('.school-year-plan').find('p strong').html(data.target);
            $('.already-read').find('p strong').html(data.now);
            var percent = safe_divide(data.now, data.target);
            if (percent > 1)
                percent = 1;
            bar.animate(percent);
        },
        error: error_handler()
    });
    // 从服务器获取是否进行过阅读能力测试，提醒用户进行阅读能力测试，同时利用cookie存储是否提醒过进行阅读能力测试

}