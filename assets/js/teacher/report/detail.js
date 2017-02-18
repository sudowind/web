/**
 * Created by wind on 2016/10/10.
 */

// 左右导航栏的回调函数
function left_bar_cb() {
    $('#report_button').attr('class', 'side-button-selected left-side-button');
}

//简介与评论之间的tab切换函数
var button_ids = ['intro', 'comment', 'note', 'test'];

function on_button_click(e) {
    //alert($(e).attr('id'));
    if ($(e).attr('value') == '0') {
        for (var i = 0; i < button_ids.length; ++i) {
            var curr_id = button_ids[i] + '_button';
            if (curr_id != $(e).attr('id')) {
                $('#'+ curr_id).css('color', '#000000').attr('value', '0').css('background', '#f9f9f9');
                $('#'+ curr_id + ' img').attr('src', '../../../assets/img/student/book/' + button_ids[i] + '_unselected.png');
                $('#' + button_ids[i] + '_part').css('display', 'none');
            }
            else {
                $('#'+ curr_id).css('color', '#ffffff').attr('value', '1').css('background', '#fb9e1d');
                $('#'+ curr_id + ' img').attr('src', '../../../assets/img/student/book/' + button_ids[i] + '_selected.png');
                $('#' + button_ids[i] + '_part').css('display', 'block');
            }
        }
    }
}

var bar = new ProgressBar.Circle('#progress_bar', {
    color: '#fb9e1d',
    // This has to be the same size as the maximum width to
    // prevent clipping
    strokeWidth: 12,
    trailWidth: 8,
    easing: 'easeInOut',
    duration: 1400,
    text: {
        autoStyleContainer: false
    },
    from: { color: '#fb9e1d', width: 8 },
    to: { color: '#fb9e1d', width: 12 },
    // Set default step function for all animate calls
    step: function(state, circle) {
        circle.path.setAttribute('stroke', state.color);
        circle.path.setAttribute('stroke-width', state.width);

        var value = Math.round(circle.value() * 100);
        if (value == 0) {
            circle.setText('0%');
        } else {
            circle.setText(value + '%');
        }

    }
});

//添加书库之后确认日期的点击事件
$('.modal-footer .btn').one("click",function(){
    $('#myModal').modal('hide');
    $(".book-image .btn").html("已添加“阅读任务”");
});

function load_info() {
    // 加载学生信息
    $.ajax({
        xhrFields: {
            withCredentials: true
        },
        type: 'get',
        url: URL_BASE + '/users/web/user/' + $.getUrlParam('student_id'),
        success: function (data) {
            var gender = '';
            if (data.gender == 1) {
                gender = '他';
            }
            else {
                gender = '她';
            }
            $('#student_name').html(data.name);
            $('#school_name').html(data.school.name);
            $('#class_name').html(data.schoolClass.name);
            $('#gender').html(gender);
            $('.student-img').find('img').attr('src', data.headimg);
            $('.student-img-box').click(function () {
                window.open('student_report.html?student_id=' + data.id, '_self');
            })
        }
    });
}

function load_answer_cb(value) {
    bar.animate(value);
}


