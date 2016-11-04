/**
 * Created by wind on 2016/11/2.
 */

function left_bar_cb() {

    // 这种方法暂时还比较粗暴……

    $('.left-sidebar a').each(function () {
        $(this).attr('href', $(this).attr('href').substr(3));
    });

    $('.left-sidebar img').each(function () {
        $(this).attr('src', $(this).attr('src').substr(3));
    });

}

function right_bar_cb() {
    $('.right-sidebar a').each(function () {
        $(this).attr('href', $(this).attr('href').substr(3));
    });

    $('.right-sidebar img').each(function () {
        $(this).attr('src', $(this).attr('src').substr(3));
    });

}

function load_404() {
    $.ajax({
        type: 'GET',
        url: 'http://debian8-01.internal.enjoyreading.com/users/operation/user/current',
        xhrFields: {
            withCredentials: true
        },
        success: function(data) {
            alert(data.userType);
            var type_str = '';
            switch (data.userType) {
                case '2':
                    type_str = 'student';
                    break;
                case '3':
                    type_str = 'teacher';
                    break;
                default:
                    type_str = 'school_master';
            }
            load('../../include/html/', type_str);
        }
    })
}

