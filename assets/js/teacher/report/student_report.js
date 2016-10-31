/**
 * Created by wind on 2016/10/12.
 */
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
                $('#'+ curr_id + ' div').css('color', '#000000');
                $('#'+ curr_id).attr('value', '0').css('background', '#f9f9f9');
                $('#'+ curr_id + ' img').attr('src', '../../../assets/img/teacher/report/' + button_ids[i] + '_unselected.png');
                $('#' + button_ids[i] + '_part').css('display', 'none');
            }
            else {
                $('#'+ curr_id + ' div').css('color', '#ffffff');
                $('#'+ curr_id).attr('value', '1').css('background', '#fb9e1d');
                $('#'+ curr_id + ' img').attr('src', '../../../assets/img/teacher/report/' + button_ids[i] + '_selected.png');
                $('#' + button_ids[i] + '_part').css('display', 'block');
            }
            if ($(e).attr('id') == 'count_button') {
                load_chart('count_figure');
            }
            else {
                load_chart('ability_figure');
            }
        }
    }
}

function load_chart(element_id) {
    var myChart = echarts.init(document.getElementById(element_id));
    if (element_id.indexOf('count') >= 0) {
        myChart.setOption(set_option('line'));
    }
    else {
        myChart.setOption(set_option('bar'));
    }
}

function set_option(data) {
    if (data == 'line')
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
                    data: [67, 78, 96, 57, 63, 82, 67, 81, 76, 79, 91, 80],
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
                    data: [78, 90, 65, 70, 60, 70, 84, 79, 70, 82, 95, 68],
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
                    data: [30, 80, 50, 80, 30, 78, 80, 90, 80, 67, 58, 80],
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
    else {
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
                    data: ['信息提取', '意义构建', '语义推论', '组织概况', '评价赏析'],
                    axisTick: {

                    }
                }
            ],
            grid: {
                left: '17%'
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
    }
}