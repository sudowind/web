/**
 * Created by wind on 2016/10/19.
 */
function on_drop_down_click() {
    $('.sub-menu').slideToggle();
    var tmp = $('#drop_down_icon');
    if (tmp.attr('src') != '../assets/img/login/dropdown_open.png') {
        tmp.attr('src', '../assets/img/login/dropdown_open.png').addClass('drop-down-icon-open').removeClass('drop-down-icon-close');
    }
    else {
        tmp.attr('src', '../assets/img/login/dropdown_close.png').addClass('drop-down-icon-close').removeClass('drop-down-icon-open');
    }

}

$('.sub-button').click(function () {
    $('.fp-sub-menu').slideUp();
    $('.main-button').attr('value', $(this).attr('value'));
    $('.main-button .login-nav-img').attr('src', $(this).children('img').attr('src'));
    $('.main-button .login-nav-content').html($(this).children('.login-nav-content').html());
    on_drop_down_click();
});

function forget_password() {
    $('#login_model').hide();
    $('#find_password').show();
}

function on_fp_drop_down_click() {

    if ($('.main-button').attr('value') != '2')
        return;

    $('.fp-sub-menu').slideToggle();
    var tmp = $('#fp_drop_down_icon');
    if (tmp.attr('src') != '../assets/img/login/black_drop_down_open.png') {
        tmp.attr('src', '../assets/img/login/black_drop_down_open.png').addClass('fp-open').removeClass('fp-close');
    }
    else {
        tmp.attr('src', '../assets/img/login/black_drop_down_close.png').addClass('fp-close').removeClass('fp-open');
    }
}

$('.fp-sub-menu .fp-function').click(function () {
    $('#fp_function_icon').attr('src', $(this).children('img').attr('src'));
    $('.grey-border .fp-function-content').html($(this).children('.fp-function-content').html());

    if ($(this).attr('value') == 'teacher') {
        $('#find_by_teacher').show();
        $('#find_by_mail').hide();
    }
    else {
        $('#find_by_teacher').hide();
        $('#find_by_mail').show();
    }

    on_fp_drop_down_click();
});

// 设置重发验证码的时间
var t = 10;
function reset_time() {
    t = 10;
}

function send_vc() {
    var tmp = $('#send_vc');
    tmp.addClass('disabled');
    t -= 1;
    tmp.html('重发验证码(' + t.toString() + ')');
    if (t == 0) {
        tmp.removeClass('disabled');
        tmp.html('发送验证码');
        reset_time();
        return;
    }
    setTimeout(send_vc, 1000);
}

$('#fp_teacher_confirm_button').click(function () {
    $('#before_input').hide();
    $('#after_input').show();
});

$('#submit_button').click(function () {
    var account = $('#user_name').val();
    var password = $('#password').val();
    var user_type = $('.main-button').attr('value');
    user_type = '5';
    $.ajax({
        type: 'POST',
        url: 'http://debian8-01.internal.enjoyreading.com/users/open/login',
        data: {
            account: account,
            password: password,
            userType: user_type
        },
        success: function (data) {
            my_tip.alert(data.success);
        }
    });
});