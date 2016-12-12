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
    var date = new Date();
    var base_year = 1900 - 6 + date.getYear();
    if (date.getMonth() >= 7) {
        base_year += 1;
    }
    var html = '';
    var table_html = '';
    for (var i = 0; i < 6; ++i) {
        var year = (base_year + i).toString();
        if (i == 0) {
            html += '<span class="index option" value="' + year + '">' + year +'级</span>'
        }
        else {
            html += '<span class="option" value="' + year + '">' + year +'级</span>'
        }
        table_html += '<td class="grade-option" value="' + year + '">' + year + '级</td>'
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
    // if (class_name == '') {
    //     class_name = $('#class_input').find('input').val();
    // }
    // if (class_name == '') {
    //     my_tip.alert('请选择班级！');
    // }
    // my_tip.alert(class_name + grade_name);
    var name = grade_name + class_name;
    var grade = Number(grade_name.substr(0, 4));
    my_tip.bind('确定要创建 <b>{0}</b>？'.format(name), function () {
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
                var obj = $('.select-grade .option[value={0}]'.format(grade));
                obj.siblings().removeClass('index');
                obj.addClass('index');
                load_grade_class(obj.attr('value'));
            },
            error: ajax_error_handler
        })
    });
});