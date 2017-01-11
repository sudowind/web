/**
 * Created by yilong on 2017/1/8.
 */
function init() {
    // 获取签到信息
    $.ajax({
        xhrFields: {
            withCredentials: true
        },
        type: 'get',
        url: URL_BASE + '/statistic/web/signIn',
        success: function (data) {
            var obj = $('#check_in');
            if (data.hasSignIn) {
                obj.html('已签到').addClass('has-checked disabled');
                $('#checked_info').show();
                $('#continue_count').html(data.continueCount);
            }
            else {
                obj.html('签到').addClass('has-not-checked');
                obj.click(check_in);
            }
        },
        error: error_handler()
    });
    // $('.open_read').click(function () {
    //     window.open('../ability/ability.html', '_self');
    // });
}

function check_in() {
    $.ajax({
        xhrFields: {
            withCredentials: true
        },
        type: 'post',
        url: URL_BASE + '/statistic/web/signIn',
        success: function (data) {
            $('#check_in').unbind('click', check_in).removeClass('has-not-checked').addClass('has-checked').html('已签到');
            $('#checked_info').slideDown();
            $('#continue_count').html(data.continueCount);
        },
        error: error_handler()
    });
}

//首页头像更新
function load_info(){
    $.ajax({
        xhrFields: {
            withCredentials: true
        },
        type: 'GET',
        url: URL_BASE + '/users/web/user/current',
        success: function(data) {
            console.log(data.headimg);
            if(data.headimg == ''){
                $(".head-img img").attr('src','../../../assets/img/student/home/default_headimg.png');
            }else{
                $(".head-img img").attr('src',data.headimg);
            }
            $('.name').html(data.name);
        },
        error: error_handler()
    });
}
