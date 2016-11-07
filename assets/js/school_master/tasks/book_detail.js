/**
 * Created by wind on 2016/10/27.
 */
function left_bar_cb() {
    $('#tasks_button').attr('class', 'side-button-selected left-side-button');
}

var button_ids = ['intro', 'comment', 'student'];

function on_button_click(e) {
    if ($(e).attr('value') == '0') {
        for (var i = 0; i < button_ids.length; ++i) {
            var curr_id = button_ids[i] + '_button';
            if (curr_id != $(e).attr('id')) {
                $('#'+ curr_id + ' div').css('color', '#000000');
                $('#'+ curr_id).attr('value', '0').css('background', '#f9f9f9');
                $('#'+ curr_id + ' img').attr('src', '../../../assets/img/student/book/' + button_ids[i] + '_unselected.png');
                $('#' + button_ids[i] + '_part').css('display', 'none');
            }
            else {
                $('#'+ curr_id + ' div').css('color', '#ffffff');
                $('#'+ curr_id).attr('value', '1').css('background', '#fb9e1d');
                $('#'+ curr_id + ' img').attr('src', '../../../assets/img/student/book/' + button_ids[i] + '_selected.png');
                $('#' + button_ids[i] + '_part').css('display', 'block');
            }
        }
    }
}

function init() {
    for (var i = 0; i <= 10; ++i) {
        load_table_line('#row' + i.toString());
    }
}

function load_table_line (row_selector) {
    var name = '苏琪苏琪';
    var number = '10010';
    var percentage = Math.random() * 100;
    var grade = 90;
    var note_count = 3;
    $(row_selector).load('../../../include/html/teacher/task_student_table_line.html', function () {
        $(row_selector + ' .student-number').html(number);
        $(row_selector + ' .student-name').html(name);
        $(row_selector + ' .grade').html(grade.toString() + '分');
        $(row_selector + ' .note-count').html(note_count.toString() + '条');
        $(row_selector + ' .progress div').css('width', percentage.toString() + '%');
    });
}