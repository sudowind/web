/**
 * Created by wind on 2016/10/27.
 */
function left_bar_cb() {
    $('#library_button').attr('class', 'side-button-selected left-side-button');
}

function init() {
    for (var i = 0; i <= 9; ++i) {
        load_table_line('#row' + i.toString());
    }
}

function load_table_line(row_selector) {
    var html = '<td>2013级5班</td>' +
        '<td>苏琪</td>' +
        '<td>3.1</td>' +
        '<td><img src="../../../assets/img/teacher/single_unselected.png" alt="" class="single-select" onclick="on_single_select_click(this)" value="0"></td>';
    $(row_selector).html(html);
}

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

$('#total_selector').click(function () {
    if ($(this).attr('value') == '1') {
        $('.single-select').attr('src', '../../../assets/img/teacher/single_unselected.png').attr('value', '0');
        $(this).attr('src', '../../../assets/img/teacher/total_unselected.png');
        $(this).attr('value', '0');
    }
    else {
        $('.single-select').attr('src', '../../../assets/img/teacher/single_selected.png').attr('value', '1');
        $(this).attr('src', '../../../assets/img/teacher/total_selected.png');
        $(this).attr('value', '1');
    }
});

$('#confirm_button').click(function () {
    my_tip.alert('已将《鸭子骑车记》添加到2015级4班、2013级3班的阅读任务中!');
});