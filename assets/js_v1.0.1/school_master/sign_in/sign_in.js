/**
 * Created by yilong on 2017/1/6.
 */
//获取地址和学校
var province = [];


//注册获取验证码
var telAuthId = '';
$(".get_pwd").on('click',function(){
    var tel = $("#phone_num").val();
    $.ajax({
        xhrFields: {
            withCredentials: true
        },
        type: 'POST',
        url: URL_BASE + '/users/open/register/telAuthCode',
        data: {
            tel:tel
        },
        success: function(data) {
            console.log(data);
            telAuthId = data;
        },
        error: ajax_error_handler
    });
});
function sign_in() {
    if ($("#boy").is(":checked")) {
        var gender = 1;
    } else if ($("#girl").is(":checked")) {
        var gender = 2;
    }
    var name = $(".name").val(),
        password = $("#password-1").val(),
        sure_password = $("#password-2").val(),
        phone_num = $("#phone_num").val(),
        userType = getCookie('user_type'),
        telAuthCode = $('.note_pwd').val();
    console.log(schoolId);

    if(password == sure_password){
        $.ajax({
            xhrFields: {
                withCredentials: true
            },
            type: 'POST',
            contentType: 'application/json',
            url: URL_BASE + '/users/open/register',
            data: JSON.stringify({
                "name":name,
                "gender": gender,
                "telAuthCode": telAuthCode,
                "telAuthId": telAuthId,
                "password":password,
                "userType": userType,
                "tel":phone_num,
                "schoolId":schoolId,
                "schoolJoinCode": joinCode


            }),
            success: function(data) {
                console.log(data);
                $("#main").css("display","none");
                $("#sign_in_success").css("display",'block');
                $("#sign_in_success .word .user_id").html(data.account);
                $("#sign_in_success .word p img").on('click',function(){
                    window.open('../login.html');
                })
            },
            error: ajax_error_handler
        });
    }
}

//校长端需要验证学校代码
var schoolId = '';
var joinCode = '';
function school_num(){
    joinCode = $(".school_num input").val();
    $.ajax({
        xhrFields: {
            withCredentials: true
        },
        type: 'POST',
        url: URL_BASE + '/users/open/join/checkSchoolJoinCode',
        data: {
            joinCode:joinCode
        },
        success: function(data) {
            console.log(data);
            schoolId = data.id;
            $(".address").html(data.address);
            $(".school").html(data.name);
            $("#school_num").css('display','none');
            $('#main').css('display','block');
        },
        error: function(data){
            $(".school_num p").css('display','block');
            $(".school_num input").focus(function(){
                $(".school_num p").css('display','none');
            });
        }
    });
}
function how_to_get_school_num(){
    my_tip.alert('请联系考拉客服获取学校代码');
}


