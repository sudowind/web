/**
 * Created by wind on 2016/11/4.
 */

function left_bar_cb() {
    $('#class_management_button').attr('class', 'side-button-selected left-side-button');
}

$('.select-class .option').hover(
    function(){
        $(this).find('img').css({"display":"block"});
    },
    function(){
        $(this).find('img').css({"display":"none"});
    }
);

$('.select-class img').click(function() {
    var text = '是否要删除' + $(this).parent().text() + '，一旦删除，阅读记录将无法恢复！';
    my_tip.bind(text, function(){});
});

// $('.grade-option').click(function () {
//     $('.grade-option').css('background', '#ffffff').css('color', '#000000');
//     $(this).css('background', '#fb9e1d').css('color', '#ffffff');
// });

var class_name = '';
var grade_name = '';
var grade_num;

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
});

$('#create_class_button').click(function () {
    $('#create_class_button').hide();
    $('#create_class_box').show();
});
$('#class_cancel_button').click(function () {
    $('#create_class_button').show();
    $('#create_class_box').hide();
});

function load_grade_class(grade) {
    $.ajax({
        xhrFields: {
            withCredentials: true
        },
        type: 'get',
        url: URL_BASE + '/users/web/class/grade/{0}/list'.format(grade),
        success: function (data) {
            // console.log(data);
            var html = '';
            for (var i = 0; i < data.length; ++i) {
                html += '<span class="option" value="{0}">{1}<img src="../../../assets/img/school_master/delete.png" alt=""></span>'.format(data[i].id, data[i].name);
            }
            $('.select-class').html(html);
            $('.select-class .option').hover(
                function(){
                    $(this).find('img').css({"display":"block"});
                },
                function(){
                    $(this).find('img').css({"display":"none"});
                }
            );
            $('.select-class img').click(function() {
                var text = '是否要删除 <b>' + $(this).parent().text() + '</b>，一旦删除，阅读记录将无法恢复！';
                my_tip.bind(text, function(){});
            });
        },
        error: ajax_error_handler
    })
}

function init() {
    // 先加载学校的所有老师
    $.ajax({
        xhrFields: {
            withCredentials: true
        },
        type: 'get',
        url: URL_BASE + '/users/web/school/current/teacher/list',
        success: function (data) {
            var teacher_list = [];
            for (var i = 0; i < data.length; ++i) {
                teacher_list.push({
                    id: data[i].id,
                    text: data[i].name
                });
            }
            $('#teacher_selector').select2({
                data: teacher_list,
                language: 'zh-CN'
            }).on('select2:select select2:unselect', function(evt) {
                var teacher_list = $('#teacher_selector').val();
                if (teacher_list.length > 0) {
                    $('#add_teacher_confirm_button').removeClass('disabled');
                }
                else {
                    $('#add_teacher_confirm_button').addClass('disabled');
                }
            });
        }
    });

    var date = new Date();
    var base_year = 1900 - 6 + date.getYear();
    if (date.getMonth() >= 7) {
        base_year += 1;
    }
    var html = '';
    var table_html = '';
    var gn = ['一年级', '二年级', '三年级', '四年级', '五年级', '六年级'];
    for (var i = 0; i < 6; ++i) {
        var year = (base_year + i).toString();
        if (i == 0) {
            html += '<span class="index option" value="' + year + '">' + gn[i] +'</span>'
        }
        else {
            html += '<span class="option" value="' + year + '">' + gn[i] +'</span>'
        }
        table_html += '<td class="grade-option" value="' + year + '">' + gn[i] + '</td>'
    }
    $('.select-grade').html(html);
    $('.select-grade .option').click(function () {
        $(this).siblings().removeClass('index');
        $(this).addClass('index');
        load_grade_class($(this).attr('value'));
    });
    load_grade_class(base_year);
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

        // 创建班级的时候选择年级，上方的对应信息也会发生变化
        var obj = $('.select-grade .option[value={0}]'.format($(this).attr('value')));
        obj.siblings().removeClass('index');
        obj.addClass('index');
        load_grade_class(obj.attr('value'));
    });
}

$('#class_submit_button').click(function () {

    var name = grade_name + class_name;
    var grade = Number(grade_num);

    var modal_obj = $('#select_teacher_modal');
    modal_obj.find('#modal_info b').html(name);
    modal_obj.modal('show');

    // my_tip.bind('确定要创建 <b>{0}</b>？'.format(name), function () {
    //     $.ajax({
    //         xhrFields: {
    //             withCredentials: true
    //         },
    //         type: 'post',
    //         url: URL_BASE + '/users/web/class',
    //         contentType: 'application/json',
    //         data: JSON.stringify({
    //             createTime: 0,
    //             grade: grade,
    //             id: 0,
    //             name: name,
    //             schoolId: 0
    //         }),
    //         success: function (data) {
    //             var obj = $('.select-grade .option[value={0}]'.format(grade));
    //             obj.siblings().removeClass('index');
    //             obj.addClass('index');
    //             load_grade_class(obj.attr('value'));
    //         },
    //         error: ajax_error_handler
    //     })
    // });
});

$('#add_teacher_confirm_button').click(function () {
    var name = grade_name + class_name;
    var grade = Number(grade_num);
    var teacher_list = $('#teacher_selector').val();

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
            $.ajax({
                xhrFields: {
                    withCredentials: true
                },
                type: 'put',
                url: URL_BASE + '/users/web/class/{0}/teachers'.format(data.id),
                contentType: 'application/json',
                data: JSON.stringify(teacher_list.map(function(e){return Number(e);})),
                success: function (data) {
                    var obj = $('.select-grade .option[value={0}]'.format(grade));
                    obj.siblings().removeClass('index');
                    obj.addClass('index');
                    load_grade_class(obj.attr('value'));
                },
                error: ajax_error_handler
            });
        },
        error: ajax_error_handler
    })
});