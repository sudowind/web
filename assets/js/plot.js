/**
 * Created by wind on 2016/12/16.
 * 图表相关的函数
 */

function load_rank_list(current, grade) {
    var url = '';
    var data = {};
    if (current == 'student') {
        url = URL_BASE + '/statistic/web/rankList/student/current';
    }
    else {
        url = URL_BASE + '/statistic/web/rankList';
        data = {
            grade: grade
        }
    }
    $.ajax({
        xhrFields: {
            withCredentials: true
        },
        url: url,
        type: 'get',
        data: data,
        success: function (data) {
            var html = '';
            var list_data;
            if (current == 'student') {
                var my_data = data.myRank;
                html = '<div class="me">' +
                    '<div class="me-rank">' + my_data.rank + '</div>' +
                    '<img src="' + my_data.user.headimg + '" alt=""/>' +
                    '<div class="me-right">' +
                    '<p class="me-name">' + my_data.user.name + '</p>' +
                    '<strong><span>' + my_data.rankValue + '</span>字</strong>' +
                    '</div>' +
                    '</div>';
                list_data = data.topList;
            }
            else {
                list_data = data;
            }

            html += '<ul>';
            for (var i in list_data) {
                var tmp = list_data[i];
                html += '<li>' +
                    '<div class="rank">' + tmp.rank + '</div>' +
                    '<img class="head" src="' + tmp.user.headimg + '" alt=""/>' +
                    '<div class="right">' +
                    '<p class="name">' + tmp.user.name + '</p>' +
                    '<strong><span>' + tmp.rankValue + '</span>字</strong>' +
                    '</div>' +
                    '</li>';
            }
            html += '</ul>';
            $('.top-list').html(html);
        },
        error: error_handler()
    });
}
