/**
 * Created by wind on 2016/10/19.
 */
function on_drop_down_click() {
    $('.sub-menu').slideToggle();
    //var tmp = $('#drop_down_icon');
    //if (tmp.attr('src') != '../assets/img/login/dropdown_open.png') {
    //    tmp.attr('src', '../assets/img/login/dropdown_open.png').addClass('drop-down-icon-open').removeClass('drop-down-icon-close');
    //}
    //else {
    //    tmp.attr('src', '../assets/img/login/dropdown_close.png').addClass('drop-down-icon-close').removeClass('drop-down-icon-open');
    //}
    return_to_login();
}

$('.sub-button').click(function () {
    $('.fp-sub-menu').slideUp();
    var value = $(this).attr('value');
    $('.main-button').attr('value', value);
    if (value == '2') {
        $('#user_name').attr('placeholder', '输入老师给的账号');
        $('#step_1_user').attr('placeholder', '输入老师给的账号');
        $('#fp_drop_down_icon').show();
    }
    else {
        $('#user_name').attr('placeholder', '输入账号');
        $('#step_1_user').attr('placeholder', '输入账号');
        $('#fp_drop_down_icon').hide();
    }
    $('#user_name').val('');
    $('#password').val('');
    $('.main-button .login-nav-img').attr('src', $(this).children('img').attr('src'));
    $('.main-button .login-nav-content').html($(this).children('.login-nav-content').html());
    on_drop_down_click();

    return_to_login();
});

function forget_password() {
    $('#login_model').hide();
    // $('#middle_part').show();
    $('#find_password').show();
}

var account = '';
var email = '';
var auth_id = 0;
function find_password() {
    $('#code_input').val('');
    $('#new_password').val('');
    $('#new_password_confirm').val('');
    send_vc();
}

function return_to_login() {
    $('#step_1').show();
    $('#step_2').hide();
    $('#login_model').show();
    $('#find_password').hide();
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
var t = 60;
function reset_time() {
    t = 60;
}

function send_vc() {
    account = $('#step_1_user').val();
    email = $('#step_1_mail').val();
    $.ajax({
        xhrFields: {
            withCredentials: true
        },
        type: 'post',
        url: URL_BASE + '/users/open/user/mailPassword/preChange',
        data: {
            userId: account,
            email: email
        },
        success: function (data) {
            auth_id = data;
            $('#step_1').hide();
            $('#step_2').show();
            refresh_button();
        },
        error: function(xhr, textStatus, errorThrown) {
            my_tip.alert('账号或邮箱输入有误！');
        }
    });
}

function refresh_button() {
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
    setTimeout(refresh_button, 1000);
}

$('#fp_teacher_confirm_button').click(function () {
    var find_userId = $("#fp_account").val();
    console.log(find_userId);
    $.ajax({
        type: 'POST',
        url: URL_BASE + '/users/open/user/masterChangePassword',
        xhrFields: {
            withCredentials: true
        },
        data: {
            userId:find_userId
        },
        success: function (data) {
            $('#before_input').hide();
            $('#after_input').show();
        }
    });
});

function login() {
    var account = $('#user_name').val();
    var password = $('#password').val();
    var user_type = $('.main-button').attr('value');
    // user_type = 5;

    if (!account || !password) {
        my_tip.alert('请填写用户名和密码！');
        return;
    }
    $.ajax({
        type: 'POST',
        url: URL_BASE + '/users/open/login',
        xhrFields: {
            withCredentials: true
        },
        data: {
            account: account,
            password: password,
            userType: user_type
        },
        success: function (data) {
            if (data.success) {
                // alert(data.loginCount);
                switch (user_type) {
                    case '2':
                        if (data.loginCount == 0)
                            window.open('../../../html/student/home/first.html', '_self');
                        else
                            window.open('../../../html/student/home/home.html', '_self');
                        break;
                    case '3':
                        if (data.loginCount == 0)
                            window.open('../../../html/teacher/tasks/first.html', '_self');
                        else
                            window.open('../../../html/teacher/tasks/index.html', '_self');
                        break;
                    case '4':
                        window.open('../../../html/school_master/tasks/teacher_detail.html', '_self');
                        break;
                }
                setCookie('USER', data.userId);
            }
            else {
                my_tip.alert(data.message);
            }
        }
    });
}

// $('#submit_button').click(login());

if($('#remember_password').is(':checked')){
    setCookie('username', $('#username').val().trim());
    setCookie('userpassword', $('#password').val().trim());
}

$('#go_to_mail').click(function () {
    open_mail_url(email);
});

$('#fp_mail_confirm_button').click(function () {
    var new_password, new_password_confirm;
    new_password = $('#new_password').val();
    new_password_confirm = $('#new_password_confirm').val();
    if (new_password != new_password_confirm) {
        my_tip.alert('两次输入的密码不相同！');
        return;
    }
    $.ajax({
        xhrFields: {
            withCredentials: true
        },
        url: URL_BASE + '/users/open/user/mailPassword/doChange',
        type: 'post',
        data: {
            userId: account,
            authId: auth_id,
            authCode: $('#code_input').val(),
            newPassword: new_password
        },
        success: function (data) {
            my_tip.alert('密码修改成功,即将前往登录页面', function () {
                return_to_login();
            });
        },
        error: function (xhr) {
            my_tip.alert(xhr.responseJSON.message);
        }
    })
});


















