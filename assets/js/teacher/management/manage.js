/**
 * Created by wind on 2017/1/17.
 */
var has_load_page = false;

var grade_name = '';
var class_name = '';
var grade_num;

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

    // 首次创建班级
    $('#has_no_class').find('.btn').click(function () {
        $('#has_no_class').hide();
        $('#has_class').show();
    });

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

function clear_rows() {
    for (var i = 1; i <= 4; ++i) {
        $('#row' + i.toString()).html('');
    }
    $('.book-part table').hide();
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
            if (data.length > 0) {
                $('#has_class').show();
                $('#has_no_class').hide();
            }
            else {
                $('#has_class').hide();
                $('#has_no_class').show();
                return;
            }

            var html = '<td>所带班级：</td>';
            html += '<td>';
            var index = 'index';
            for (var i = 0; i < data.length; ++i) {
                if (i != 0)
                    index = '';
                else {
                    CLASS_ID = data[i].id;
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
            });
            // load_tasks(CLASS_ID, 1);
        },
        error: error_handler()
    });
}