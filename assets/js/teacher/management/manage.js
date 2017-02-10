/**
 * Created by wind on 2017/1/17.
 */
var has_load_page = false;

var grade_name = '';
var class_name = '';
var grade_num;

var curr_class;

$(document).ready(function () {
    $('.total-selector').click(function () {
        if ($(this).attr('value') == '1') {
            $('.single-selector').attr('src', '../../../assets/img/teacher/single_unselected.png').attr('value', '0');
            $(this).attr('src', '../../../assets/img/teacher/single_unselected.png');
            $(this).attr('value', '0');
        }
        else {
            $('.single-selector').attr('src', '../../../assets/img/teacher/single_selected.png').attr('value', '1');
            $(this).attr('src', '../../../assets/img/teacher/single_selected.png');
            $(this).attr('value', '1');
        }
    });

    // 以下是创建班级模块的js
    var date = new Date();
    var base_year = 1900 - 6 + date.getYear();
    if (date.getMonth() >= 7) {
        base_year += 1;
    }
    var table_html = '';
    var gn = ['一年级', '二年级', '三年级', '四年级', '五年级', '六年级'];
    for (var i = 0; i < 6; ++i) {
        var year = (base_year + i).toString();
        table_html += '<td class="grade-option" value="' + year + '">' + gn[i] + '</td>'
    }
    $('#table_grade_select').find('tr').html(table_html);
    $('.grade-option').click(function () {
        grade_name = $(this).text();
        grade_num = $(this).attr('value');
        if (grade_name !== '' && class_name !== '') {
            $('#class_submit_button').removeClass('disabled');
        }
        else {
            $('#class_submit_button').addClass('disabled');
        }
        $('.grade-option').css('background', '#ffffff').css('color', '#000000');
        $(this).css('background', '#fb9e1d').css('color', '#ffffff');

    });
    $('.class-option').click(function () {
        class_name = $(this).text();
        if (grade_name !== '' && class_name !== '') {
            $('#class_submit_button').removeClass('disabled');
        }
        else {
            $('#class_submit_button').addClass('disabled');
        }
        $('#class_input').find('input').val('');
        $('.class-option').css('background', '#ffffff').css('color', '#000000');
        $(this).css('background', '#fb9e1d').css('color', '#ffffff');
    });
    $('#class_input').click(function () {
        class_name = '';
        if (grade_name !== '' && class_name !== '') {
            $('#class_submit_button').removeClass('disabled');
        }
        else {
            $('#class_submit_button').addClass('disabled');
        }
        $('.class-option').css('background', '#ffffff').css('color', '#000000');
    }).find('input').blur(function() {
        class_name = $(this).val();
        if (grade_name !== '' && class_name !== '') {
            $('#class_submit_button').removeClass('disabled');
        }
        else {
            $('#class_submit_button').addClass('disabled');
        }
    }).keydown(function () {
        class_name = $(this).val();
        if (grade_name !== '' && class_name !== '') {
            $('#class_submit_button').removeClass('disabled');
        }
        else {
            $('#class_submit_button').addClass('disabled');
        }
    }).keyup(function () {
        class_name = $(this).val();
        if (grade_name !== '' && class_name !== '') {
            $('#class_submit_button').removeClass('disabled');
        }
        else {
            $('#class_submit_button').addClass('disabled');
        }
    });

    $('#class_submit_button').click(function () {
        var name = grade_name + class_name;
        var grade = Number(grade_num);
        // var teacher_list = [getCookie('USER')];

        console.log();

        $.ajax({
            xhrFields: {
                withCredentials: true
            },
            type: 'post',
            url: URL_BASE + '/users/web/class',
            contentType: 'application/json',
            data: JSON.stringify({
                createTime: 0,
                grade: grade,
                id: 0,
                name: name,
                schoolId: 0
            }),
            success: function (data) {
                my_tip.alert('创建成功！');
                init_class();
                // $.ajax({
                //     xhrFields: {
                //         withCredentials: true
                //     },
                //     type: 'put',
                //     url: URL_BASE + '/users/web/class/{0}/teachers'.format(data.id),
                //     contentType: 'application/json',
                //     data: JSON.stringify(teacher_list.map(function(e){return Number(e);})),
                //     success: function (data) {
                //         var obj = $('.select-grade .option[value={0}]'.format(grade));
                //         obj.siblings().removeClass('index');
                //         obj.addClass('index');
                //         load_grade_class(obj.attr('value'));
                //     },
                //     error: error_handler()
                // });
            },
            error: error_handler()
        })
    });

    // 首次创建班级
    $('#has_no_class').find('.btn').click(function () {
        $('#has_no_class').hide();
        $('#has_class').show();
    });

    // 允许学生加入班级
    $('#allow').click(function () {
        var elem = $('[type=pending]');
        for (var i = 0; i < elem.length; ++i) {
            if ($(elem[i]).attr('value') == 1) {
                console.log($(elem[i]).attr('request_id'));
                $.ajax({
                    xhrFields: {
                        withCredentials: true
                    },
                    url: URL_BASE + '/users/web/join/processRequest',
                    type: 'post',
                    data: {
                        requestId: $(elem[i]).attr('request_id'),
                        accept: true
                    },
                    success: function (data) {
                        my_tip.alert('成功通过加入班级请求');
                        load_class_info(curr_class);
                    },
                    error: error_handler()
                });
            }
        }
    });

    // 拒绝学生加入班级
    $('#refuse').click(function () {
        var elem = $('[type=pending]');
        for (var i = 0; i < elem.length; ++i) {
            if ($(elem[i]).attr('value') == 1) {
                console.log($(elem[i]).attr('request_id'));
                $.ajax({
                    xhrFields: {
                        withCredentials: true
                    },
                    url: URL_BASE + '/users/web/join/processRequest',
                    type: 'post',
                    data: {
                        requestId: $(elem[i]).attr('request_id'),
                        accept: false
                    },
                    success: function (data) {
                        my_tip.alert('成功拒绝加入班级请求！');
                        load_class_info(curr_class);
                    },
                    error: error_handler()
                });
            }
        }
    });

    // 删除已加入班级的学生
    $('#delete').click(function () {
        var elem = $('[type=passed]');
        for (var i = 0; i < elem.length; ++i) {
            if ($(elem[i]).attr('value') == 1) {
                $.ajax({
                    xhrFields: {
                        withCredentials: true
                    },
                    url: URL_BASE + '/users/web/class/{0}/student/{1}/delete'.format(curr_class, $(elem[i]).attr('student_id')),
                    type: 'post',
                    success: function (data) {
                        my_tip.alert('成功删除学生！');
                        load_class_info(curr_class);
                    },
                    error: error_handler()
                });
            }
        }
    });

    //转让班级
    $("#sure_give").on('click',function(){
        var classId = $('.index').attr('value');
        //var newteacherId = 已认证的老师只可以装让给已认证的老师，没认证同理；
    })

});

function on_single_select_click(e) {
    if ($(e).attr('value') == '1') {
        $(e).attr('src', '../../../assets/img/teacher/single_unselected.png');
        $(e).attr('value', '0');
        $('#total_selector').attr('src', '../../../assets/img/teacher/total_unselected.png').attr('value', '0');
    }
    else {
        $(e).attr('src', '../../../assets/img/teacher/single_selected.png');
        $(e).attr('value', '1');
    }
}
function on_modal_select_click(e) {
    if ($(e).attr('value') == '1') {
        $(e).attr('src', '../../../assets/img/teacher/single_unselected.png');
        $(e).attr('value', '0');
        $('#total_selector').attr('src', '../../../assets/img/teacher/total_unselected.png').attr('value', '0');
        $(e).parent().css('color','#ccc');
    }
    else {
        $(e).attr('src', '../../../assets/img/teacher/single_selected.png');
        $(e).attr('value', '1');
        $(e).parent().css('color','#000');
    }
}

function clear_rows() {
    for (var i = 1; i <= 4; ++i) {
        $('#row' + i.toString()).html('');
    }
    $('.book-part table').hide();
}

function load_class_info(class_id) {
    // 获取班级名字
    $.ajax({
        xhrFields: {
            withCredentials: true
        },
        type: 'get',
        url: URL_BASE + '/users/web/class/{0}'.format(class_id),
        success: function (data) {
            $('#class_name').html(data.name);
        },
        error: error_handler()
    });
    // 获取班级学生
    $.ajax({
        xhrFields: {
            withCredentials: true
        },
        type: 'get',
        url: URL_BASE + '/users/web/class/{0}/students'.format(class_id),
        success: function (data) {
            console.log(data)
            $('#student_count').html(data.length);
            var joined_student = data;

            // 获取待加入学生
            $.ajax({
                xhrFields: {
                    withCredentials: true
                },
                type: 'get',
                url: URL_BASE + '/users/web/join/getAllStudentJoinRequest',
                data: {
                    classId: class_id
                },
                success: function (data) {
                    var html = '';
                    for (var i = 0; i < data.length; ++i) {
                        var gender;
                        if (data[i].studentGender == 1)
                            gender = '男';
                        else
                            gender = '女';
                        html += '<tr>' +
                            '<td><img class="single-selector" onclick="on_single_select_click(this);" type="pending" student_id="{0}" request_id="{1}" src="../../../assets/img/teacher/single_unselected.png" alt="" value="0"></td>'.format(data[i].studentId, data[i].requestId) +
                            '<td>{0}</td>'.format(data[i].studentAccount) +
                            '<td>{0}</td>'.format(data[i].studentName) +
                            '<td>{0}</td>'.format(gender) +
                            '<td>待审核</td>' +
                            '</tr>';
                    }
                    for (var i = 0; i < joined_student.length; ++i) {
                        var gender;
                        if (joined_student[i].gender == 1)
                            gender = '男';
                        else
                            gender = '女';
                        html += '<tr>' +
                            '<td><img class="single-selector" onclick="on_single_select_click(this);" type="passed" student_id="{0}" src="../../../assets/img/teacher/single_unselected.png" alt="" value="0"></td>'.format(joined_student[i].id) +
                            '<td>S {0}</td>'.format(joined_student[i].id) +
                            '<td>{0}</td>'.format(joined_student[i].name) +
                            '<td>{0}</td>'.format(gender) +
                            '<td>已加入班级</td>' +
                            '</tr>';
                    }
                    $('#student_table').find('tbody').html(html);
                }
            })
        },
        error: error_handler()
    });
    // 获取班级代码
    $.ajax({
        xhrFields: {
            withCredentials: true
        },
        type: 'get',
        url: URL_BASE + '/users/web/join/class/{0}/joinCode'.format(class_id),
        success: function (data) {
            $('#class_code').html(data[0].joinCode);
        },
        error: error_handler()
    });
}

function init_class() {
    $.ajax({
        xhrFields: {
            withCredentials: true
        },
        type: 'get',
        url: URL_BASE + '/users/web/class/teacher/current/list',
        success: function(data) {
            console.log(data);

            var html = '<td>所带班级：</td>';
            html += '<td>';
            var index = 'index';
            var class_id;
            for (var i = 0; i < data.length; ++i) {
                if (i != 0)
                    index = '';
                else {
                    class_id = data[i].id;
                }
                html += '<span class="' + index + ' option" value="' + data[i].id + '">' + data[i].name + '</span>';
            }
            html += '<span><img src="../../../assets/img/plus.png" alt=""></span></td>';
            $('.classes-part table tr').html(html);
            $('.classes-part img').click(function () {
                $('#install_modal').modal('toggle');
            });
            $('.option').click(function () {
                $(this).siblings().removeClass('index');
                $(this).addClass('index');
                clear_rows();
                has_load_page = false;
                curr_class = $(this).attr('value');
                load_class_info(curr_class);
            });
            curr_class = class_id;
            load_class_info(curr_class);

            if (data.length > 0) {
                $('#has_class').show();
                $('#has_no_class').hide();
                $('.student-part').show();
                $('.class-info').show();
            }
            else {
                $('.classes-part img').css('margin-top', '3px');
                $('#has_class').hide();
                $('#has_no_class').show();
            }
            // load_tasks(class_id, 1);
        },
        error: error_handler()
    });
}
//解散班级
function dismiss_class(){
    var class_name = $('#class_name').html();
    var class_code = $('#class_code').html();
    var class_id = $('.classes-part table tbody tr td .index').attr('value');
    my_tip.bind('您确定解散' + class_name + '(班级代码：'+ class_code +') ',function(){

        my_tip.bind('班级解散后数据将不可恢复，是否确认解散该班级？',function(){
            $.ajax({
                xhrFields: {
                    withCredentials: true
                },
                type: 'post',
                url: URL_BASE + '/users/web/class/'+class_id+'/delete',
                success: function (data) {
                    my_tip.alert(''+ class_name +'解散成功！');
                    init_class();
                },
                error: function() {
                    if(XMLHttpRequest.status == 400){
                        my_tip.alert('已被认证班级无法解散');
                    }
                }
            });
        })
    })
}
//转让班级
function give_class(){
    var class_name = $('#class_name').html();
    var class_code = $('#class_code').html();
    var class_id = $('.classes-part table tbody tr td .index').attr('value');
    my_tip.bind('确定把' + class_name + '(班级代码：'+ class_code +')转让出去？ ',function(){

    })
}
//data-toggle="modal" data-target="#myModal"