/**
 * Created by wind on 2016/10/26.
 */
var circles = [];
var has_load_page = false;

function left_bar_cb() {
    $('#tasks_button').attr('class', 'side-button-selected left-side-button');
}

function init () {

    var h = Number($('.select-part').height());
    // alert(h);
    // console.log(h);
    $('.book-part').css('height', (1100 - h).toString());

}

$('.option').click(function () {
    $(this).siblings().removeClass('index');
    $(this).addClass('index');
    // has_load_page = false;
});

function load_table_row(row_selector, data, class_id, teacher_id) {
    // 从服务器拿到数据之后，将数据填充成表格
    var img_src = '../../../assets/img/1.png';
    var book_name = data.book.name;
    var book_id = data.bookId;
    // 应该是对每一行分别填充，每一行都有一个id，通过这个id进行操作
    $(row_selector).load('../../../include/html/school_master/task_table_line.html', function() {
        var bars = new Array(2);
        bars[0] = new ProgressBar.Circle(row_selector + ' td:nth-child(' + (2).toString() + ') div', {
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
                var text;
                text = '{0}/{1}'.format(data.completedCount, data.totalCount);
                circle.setText(text);
            }
        });
        bars[1] = new ProgressBar.Circle(row_selector + ' td:nth-child(' + (3).toString() + ') div', {
            color: '#44435b',
            // This has to be the same size as the maximum width to
            // prevent clipping
            strokeWidth: 12,
            trailWidth: 8,
            easing: 'easeInOut',
            duration: 1400,
            text: {
                autoStyleContainer: false
            },
            from: { color: '#44435b', width: 8 },
            to: { color: '#44435b', width: 12 },
            // Set default step function for all animate calls
            step: function(state, circle) {
                circle.path.setAttribute('stroke', state.color);
                circle.path.setAttribute('stroke-width', state.width);

                var value = Math.round(circle.value() * 100);
                circle.setText(value);
            }
        });
        // 设定两个进度环
        bars[0].set(Number(data.completedCount)/Number(data.totalCount));
        bars[1].set(Number(data.totalExamScore)/Number(data.examCount));

        var obj = $(row_selector);
        obj.find('.table-img div').html(book_name);
        obj.find('.table-img img').attr('src', data.book.coverUri);
        obj.find('.book-score').html(data.book.levelScore+'ER');
        var start_date = new Date(data.startTime);
        var finish_date = new Date(data.endTime);
        obj.find('.start_date').html(start_date.getFullDate());
        obj.find('.finish_date').html(finish_date.getFullDate());
        // 绑定查看书本详情的事件
        obj.find('.book-detail').click(function () {
            window.open('book_detail.html?book_id=' + data.bookId + '&class_id=' + class_id + '&teacher_id=' + teacher_id, '_self');
        });

    });
}

function clear_rows() {
    for (var i = 1; i < 4; ++i) {
        $('#row{0}'.format(i)).html('');
    }
}

function load_tasks(teacher_id, class_id, page) {
    clear_rows();
    $.ajax({
        xhrFields: {
            withCredentials: true
        },
        type: 'get',
        url: URL_BASE + '/tasks/web/task/teacher/{0}/list'.format(teacher_id),
        data: {
            classId: class_id,
            page: page - 1,
            itemPerPage: 3
        },
        success: function (data) {
            for (var i = 0; i < data.data.length; ++i) {
                load_table_row('#row' + (i + 1).toString(), data.data[i], class_id, teacher_id);
            }
            if (!has_load_page) {
                has_load_page = true;
                var page_count = Math.ceil((data.totalItem * 1.0) / data.itemPerPage);
                $('#teacher_task_pagination').createPage({
                    pageCount: page_count,
                    current: 1,
                    backFn: function(p) {
                        load_tasks(teacher_id, class_id, p);
                    }
                });
            }
            var h = Number($('.select-part').height());
            // console.log(h);
            $('.book-part').css('height', (1100 - h).toString());
        },
        error: ajax_error_handler
    });
}

function load_teacher_class(teacher_id) {
    if (teacher_id < 0) {
        $('.select-class').html('');
        clear_rows();
    }
    else {
        $.ajax({
            xhrFields: {
                withCredentials: true
            },
            type: 'get',
            url: URL_BASE + '/users/web/class/teacher/{0}/list'.format(teacher_id),
            success: function (data) {
                var html = '<span class="index option" value="{0}">{1}</span>'.format(data[0].id, data[0].name);
                for (var i = 1; i < data.length; ++i) {
                    html += '<span class="option" value="{0}">{1}</span>'.format(data[i].id, data[i].name);
                }
                $('.select-class').html(html).find('.option').click(function () {
                    $(this).siblings().removeClass('index');
                    $(this).addClass('index');
                    has_load_page = false;
                    load_tasks(teacher_id, $(this).attr('value'), 1);
                });
                has_load_page = false;
                load_tasks(teacher_id, data[0].id, 1);
            },
            error: ajax_error_handler
        });
    }
}

function load_grade_teacher(grade) {
    $.ajax({
        xhrFields: {
            withCredentials: true
        },
        type: 'get',
        url: URL_BASE + '/users/web/school/current/grade/{0}/teacher/list'.format(grade),
        success: function (data) {
            var teacher_id = -1;
            if (data.length == 0) {
                $('.select-teacher').html('');
            }
            else {
                teacher_id = data[0].id;
                var html = '<span class="index option" value="{0}">{1}</span>'.format(data[0].id, data[0].name);
                for (var i = 1; i < data.length; ++i) {
                    html += '<span class="option" value="{0}">{1}</span>'.format(data[1].id, data[i].name);
                }
                $('.select-teacher').html(html).find('.option').click(function () {
                    $(this).siblings().removeClass('index');
                    $(this).addClass('index');
                    load_teacher_class($(this).attr('value'));
                });
            }
            load_teacher_class(teacher_id);
        },
        error: ajax_error_handler
    });
}

function init_grade() {
    var date = new Date();
    var base_year = 1900 - 6 + date.getYear();
    if (date.getMonth() >= 7) {
        base_year += 1;
    }
    base_year += 5;
    var gn = ['一年级', '二年级', '三年级', '四年级', '五年级', '六年级'];
    var html = '<span class="index option" value="{0}">{1}</span>'.format(base_year.toString(), gn[0]);
    for (var i = 1; i < 6; ++i) {
        html += '<span class="option" value="{0}">{1}</span>'.format((base_year - i).toString(), gn[i]);
    }
    $('.select-grade').html(html).find('.option').click(function () {
        $(this).siblings().removeClass('index');
        $(this).addClass('index');
        load_grade_teacher($(this).attr('value'));
        $('#teacher_task_pagination').html('');
    });
    load_grade_teacher(base_year);
}