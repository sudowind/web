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
    $('.main-button .login-nav-img').attr('src', $(this).children('img').attr('src'));
    $('.main-button .login-nav-content').html($(this).children('.login-nav-content').html());
    on_drop_down_click();
});

function forget_password() {
    $('#login_model').hide();
    $('#find_password').show();
}