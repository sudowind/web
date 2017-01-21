/**
 * Created by wind on 2017/1/18.
 */
var button_ids = ['class_detail', 'claim_class'];
var curr_grade;

function on_button_click(e) {
    //alert($(e).attr('id'));
    if ($(e).attr('value') == '0') {
        for (var i = 0; i < button_ids.length; ++i) {
            var curr_id = button_ids[i] + '_button';
            if (curr_id != $(e).attr('id')) {
                $('#'+ curr_id).addClass('unselected').removeClass('selected').attr('value', '0');
                $('#'+ curr_id + ' img').attr('src', '../../../assets/img/school_master/' + button_ids[i] + '_unselected.png');
                $('#' + button_ids[i] + '_part').css('display', 'none');
            }
            else {
                $('#'+ curr_id).removeClass('unselected').addClass('selected').attr('value', '1');
                $('#'+ curr_id + ' img').attr('src', '../../../assets/img/school_master/' + button_ids[i] + '_selected.png');
                $('#' + button_ids[i] + '_part').css('display', 'block');
            }
        }
    }
}

function load_grade_class(grade) {
    $.ajax({
        xhrFields: {
            withCredentials: true
        },
        type: 'get',
        url: URL_BASE + '/users/web/class/grade/{0}/list'.format(grade),
        success: function (data) {
            console.log(data);
            var html = '', table_html = '';
            for (var i = 0; i < data.length; ++i) {
                html += '<span class="option" value="{0}" onclick="show_class_info(this)">{1}</span>'.format(data[i].id, data[i].name);
                table_html += '<tr>' +
                    '<td>{0}</td>'.format(data[i].name) +
                    '<td>{0}</td>'.format(data[i].id) +
                    '<td>{0}</td>'.format(data[i].teacherName) +
                    '<td>{0}</td>'.format(data[i].teacherAccount) +
                    '<td><u value="{0}" onclick="show_class_info(this)">查看</u></td>'.format(data[i].id) +
                    '</tr>';
            }
            $('.select-class').html(html).find('.option');
            $('#class_detail_part .class-info').find('tbody').html(table_html).show();
            $('.class_detail').hide();
            $('.student-list').hide();
        },
        error: error_handler()
    })
}

function init_grade() {
    var date = new Date();
    var base_year = 1900 - 6 + date.getYear();
    if (date.getMonth() >= 7) {
        base_year += 1;
    }
    var gn = ['一年级', '二年级', '三年级', '四年级', '五年级', '六年级'];
    var html = '<span class="index option" value="{0}">{1}</span>'.format(base_year.toString(), gn[0]);
    for (var i = 1; i < 6; ++i) {
        html += '<span class="option" value="{0}">{1}</span>'.format((base_year + i).toString(), gn[i]);
    }
    $('.select-grade').html(html).find('.option').click(function () {
        $(this).siblings().removeClass('index');
        $(this).addClass('index');
        curr_grade = $(this).attr('value');
        load_grade_class(curr_grade);
        $('#class_detail_part .class-info').show();
        $('.class_detail').hide();
        $('.student-list').hide();
    });
    curr_grade = base_year;
    load_grade_class(curr_grade);
}

function show_class_info(e) {
    $.ajax({
        xhrFields: {
            withCredentials: true
        },
        type: 'get',
        url: URL_BASE + '/users/web/class/{0}'.format($(e).attr('value')),
        success: function (data) {
            // 获取班级信息
            $('#class_no').html(data.id);
            $('#class_teacher').html(data.teacherName);
            $('#class_name').html(data.name);
            $('#teacher_no').html(data.teacherAccount);
            // 获取班级学生，待完善
            $.ajax({
                xhrFields: {
                    withCredentials: true
                },
                type: 'get',
                url: URL_BASE + '/users/web/class/{0}/students'.format(data.id),
                success: function (data) {
                    var html = '';
                    for (var i in data) {
                        var gender;
                        if (data[i].gender == 1)
                            gender = '男';
                        else
                            gender = '女';
                        html += '<tr>' +
                            '<td>S{0}</td>'.format(data[i].id) +
                            '<td>{0}</td>'.format(data[i].name) +
                            '<td>{0}</td>'.format(gender) +
                            '<td><u onclick="window.open(\'../report/student_report.html?student_id={0}\')">查看</u></td>'.format(data[i].id) +
                            '</tr>';
                    }
                    $('.student-list').find('tbody').html(html);
                    $('#student_count').html(data.length);
                },
                error: error_handler()
            })
        },
        error: error_handler()
    });
    var obj = $('span[value={0}]'.format($(e).attr('value')));
    obj.addClass('index');
    obj.siblings().removeClass('index');
    $('#class_detail_part .class-info').hide();
    $('.class_detail').show();
    $('.student-list').show();
}

function load_unauth_class() {
    // 加载待认领班级
    $.ajax({
        xhrFields: {
            withCredentials: true
        },
        type: 'get',
        url: URL_BASE + '/users/web/join/getAllClassJoinRequest',
        success: function (data) {
            var html = '';
            for (var i in data) {
                html += '<tr>' +
                    '<td>{0}</td>'.format(data[i].className) +
                    '<td>{0}</td>'.format(data[i].classId) +
                    '<td>{0}</td>'.format(data[i].teacherName) +
                    '<td>{0}</td>'.format(data[i].teacherAccount) +
                    '<td><img class="single-select" value="0" request_id="{0}" src="../../../assets/img/school_master/unchecked.png" alt=""></td>'.format(data[i].requestId) +
                    '</tr>';
            }
            $('#claim_class_part').find('tbody').html(html);
            $('.single-select').click(function () {
                if ($(this).attr('value') == '1')
                    $(this).attr('src', '../../../assets/img/school_master/unchecked.png').attr('value', 0);
                else
                    $(this).attr('src', '../../../assets/img/school_master/checked.png').attr('value', 1);
            });
        }
    })
}

$(document).ready(function () {
    init_grade();

    // 认领班级的事件
    $('#claim_class').click(function () {
        var elem = $('.single-select');
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
                        my_tip.alert('认领班级成功！');
                        load_unauth_class();
                        load_grade_class(curr_grade);
                    },
                    error: error_handler()
                });
            }
        }
    });

    load_unauth_class();
});