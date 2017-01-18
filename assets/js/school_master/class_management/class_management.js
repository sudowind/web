/**
 * Created by wind on 2017/1/18.
 */
var button_ids = ['class_detail', 'claim_class'];
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
            // console.log(data);
            var html = '';
            for (var i = 0; i < data.length; ++i) {
                html += '<span class="option" value="{0}">{1}</span>'.format(data[i].id, data[i].name);
            }
            $('.select-class').html(html);
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
        load_grade_class($(this).attr('value'));
        // load_grade_teacher($(this).attr('value'));
    });
    // load_grade_class(base_year);
    load_grade_class(base_year);
}

$(document).ready(function () {
    init_grade();
});