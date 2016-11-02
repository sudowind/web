/**
 * Created by yilong on 2016/11/1.
 */


//自动生成列表
function init() {
    for (var i = 0; i <= 6; ++i) {
        load_table_classes('#row' + i);
    };
    for(var i = 0;i <= 6 ;i ++){
        load_table_
    }
}

function load_table_classes (row_selector) {
    var sort = '1';
    var classes = '10010';
    var read_num = '50';
    var book_num = '90';
    var accuracy = '60';
    $(row_selector).load('../../../include/html/teacher/report_classes_show.html', function () {
        $(row_selector + ' .sort').html(sort);
        $(row_selector + ' .classes').html(classes);
        $(row_selector + ' .read-num').html(read_num);
        $(row_selector + ' .book-num').html(book_num);
        $(row_selector + ' .accuracy').html(accuracy + '%');
    });
}

//简介与评论之间的tab切换函数
var button_ids = ['classes', 'student', 'people'];

function on_button_click(e) {
    //alert($(e).attr('id'));
    if ($(e).attr('value') == '0') {
        for (var i = 0; i < button_ids.length; ++i) {
            var curr_id = button_ids[i] + '_button';
            if (curr_id != $(e).attr('id')) {
                $('#'+ curr_id + ' span').css('color', '#000000');
                $('#'+ curr_id).attr('value', '0').css('background', '#f9f9f9');
                $('#'+ curr_id + ' img').attr('src', '../../../assets/img/teacher/' + button_ids[i] + '_selected.png');
                $('#' + button_ids[i] + '_part').css('display', 'none');
            }
            else {
                $('#'+ curr_id + ' span').css('color', '#ffffff');
                $('#'+ curr_id).attr('value', '1').css('background', '#fb9e1d');
                $('#'+ curr_id + ' img').attr('src', '../../../assets/img/teacher/' + button_ids[i] + '_unselected.png');
                $('#' + button_ids[i] + '_part').css('display', 'block');
            }
        }
    }
}