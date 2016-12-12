/**
 * Created by yilong on 2016/11/17.
 */
function right_bar_cb() {
    $('#feedback_button').attr('class', 'side-button-selected right-side-button');
}

var captcha_id = '';
var user_type_content = '';

function load_captcha() {
    $.ajax({
        xhrFields: {
            withCredentials: true
        },
        type: 'get',
        url: URL_BASE + '/users/open/captcha',
        success: function (data) {
            captcha_id = data.id;
            $('.captcha').find('img').attr('src', 'data:image/jpg;base64,{0}'.format(data.base64Image));
        }
    })
}