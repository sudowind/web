/**
 * Created by wind on 2016/10/26.
 */
var circles = [];

function left_bar_cb() {
    $('#tasks_button').attr('class', 'side-button-selected left-side-button');
}

function init () {
    load_table_row('#row1');
    load_table_row('#row2');
    // load_table_row('#row3');
    // load_table_row('#row4');
}

var has_load_page = false;
var CLASS_ID;
function load_tasks(class_id, page) {
    // class_id = 1;
    // page = 1;
    CLASS_ID = class_id;
    clear_rows();
    $.ajax({
        url: URL_BASE + '/tasks/web/task/teacher/current/list',
        xhrFields: {
            withCredentials: true
        },
        data: {
            classId: class_id,
            page: page - 1,
            itemPerPage: 4
        },
        type: 'get',
        success: function (data) {
            // alert(data.data.length);
            if (data.data.length > 0) {
                $('table').show();
                for (var i = 0; i < data.data.length; ++i) {
                    load_table_row('#row' + (i + 1).toString(), data.data[i]);
                }
            }
            if (!has_load_page) {
                has_load_page = true;
                var page_count = Math.ceil((data.totalItem * 1.0) / data.itemPerPage);
                $('#teacher_task_pagination').createPage({
                    pageCount: page_count,
                    current: 1,
                    backFn: function(p) {
                        load_tasks(class_id, p);
                    }
                });
            }
        },
        error: ajax_error_handler
    });
}


function clear_rows() {
    for (var i = 1; i <= 4; ++i) {
        $('#row' + i.toString()).html('');
    }
    $('.book-part table').hide();
}


function load_table_row(row_selector, data) {
    // 从服务器拿到数据之后，将数据填充成表格
    var img_src = '../../../assets/img/1.png';
    var book_name = data.book.name;
    var book_id = data.bookId;
    // 应该是对每一行分别填充，每一行都有一个id，通过这个id进行操作
    $(row_selector).load('../../../include/html/teacher/task_table_line.html', function() {
        var bars = new Array(2);
        for (var i = 0; i < bars.length; ++i) {
            bars[i] = new ProgressBar.Circle(row_selector + ' td:nth-child(' + (i + 2).toString() + ') div', {
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
            // bars[i].set(Math.random());
        }
        // 设定两个进度环
        bars[0].set(Number(data.completedCount)/Number(data.totalCount));
        bars[1].set(Number(data.totalExamScore)/Number(data.examCount));

        var obj = $(row_selector);
        obj.find('.table-img div').html(book_name);
        obj.find('.table-img img').attr('src', data.book.coverUri);
        obj.find('.book-score').html(data.book.levelScore);
        var start_date = new Date(data.startTime);
        var finish_date = new Date(data.endTime);
        obj.find('.start_date').html(start_date.getFullDate());
        obj.find('.finish_date').html(finish_date.getFullDate());
        // 绑定删除一本书的事件
        obj.find('.delete-book').click(function () {
            var message = '将《' + book_name + '》从' + $('.index').html() + '的阅读任务中删除？';
            my_tip.bind(message, function() {
                $.ajax({
                    xhrFields: {
                        withCredentials: true
                    },
                    type: 'post',
                    url: URL_BASE + '/tasks/web/task/teacher/current/delete',
                    data: {
                        bookId: book_id,
                        classId: CLASS_ID
                    },
                    success: function () {
                        has_load_page = false;
                        load_tasks(CLASS_ID, 1);
                    }
                })
            });
        });
        // 绑定查看书本详情的事件
        obj.find('.book-detail').click(function () {
            window.open('book.html?book_id=' + data.bookId + '&class_id=' + CLASS_ID, '_self');
        });

    });
}

function init_class() {
    $.ajax({
        xhrFields: {
            withCredentials: true
        },
        type: 'get',
        url: URL_BASE + '/users/web/class/teacher/current/list',
        success: function(data) {
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
            html += '</td>';
            $('.classes-part table tr').html(html);
            $('.option').click(function () {
                $(this).siblings().removeClass('index');
                $(this).addClass('index');
                clear_rows();
                has_load_page = false;
                load_tasks($(this).attr('value'), 1);
            });
            load_tasks(CLASS_ID, 1);
        },
        error: ajax_error_handler
    });
}
