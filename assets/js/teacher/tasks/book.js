/**
 * Created by wind on 2016/10/27.
 */
function left_bar_cb() {
    $('#tasks_button').attr('class', 'side-button-selected left-side-button');
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