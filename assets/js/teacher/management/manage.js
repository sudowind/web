/**
 * Created by wind on 2017/1/17.
 */
var has_load_page = false;



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
            });
            // load_tasks(CLASS_ID, 1);
        },
        error: error_handler()
    });
}