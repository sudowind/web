/**
 * Created by yilong on 2017/1/6.
 */
//获取地址和学校
var province = [];


//获取验证码   验证码倒计时
var telAuthId = '';
var clock = '';
var nums = 60;
var btn;
function sendCode(thisBtn)
{

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

    $('.get_pwd').css({
        'background':'#e8ecef',
        'color':'#999',
        'cursor':'not-allowed'
    });
    btn = thisBtn;
    btn.disabled = true; //将按钮置为不可点击
    btn.value = nums+'秒后可重新获取';
    clock = setInterval(doLoop, 1000); //一秒执行一次
}
function doLoop()
{
    nums--;
    if(nums > 0){
        btn.value = nums+'秒后可重新获取';
    }else{
        clearInterval(clock); //清除js定时器
        btn.disabled = false;
        btn.value = '获取验证码';
        nums = 60; //重置时间
        var user_type = getCookie('user_type');
        if(user_type == '3' ){
            $('.get_pwd').css({
                'background':'#3b5a97',
                'color':'#fff',
                'cursor':'pointer'
            });
        }else if(user_type == '2'){
            $('.get_pwd').css({
                'background':'#3f8ebe',
                'color':'#fff',
                'cursor':'pointer'
            });
        }else if(user_type == '4'){
            $('.get_pwd').css({
                'background':'#44435b',
                'color':'#fff',
                'cursor':'pointer'
            });
        }

    }
}

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
    //console.log(schoolId);

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




//警示提示
$('#password-2').on('blur',function(){
    var pwd_1 = $('#password-1').val();
    var pwd_2 = $('#password-2').val();
    if(pwd_1 !== pwd_2){
        $('.pass_no').css('display','inline-block');
    }
}).on('focus',function(){
    $('.pass_no').css('display','none');
});

$('#phone_num').on('blur',function(){
    var phone_num = $('#phone_num').val();
    var reg =/^1[34578]\d{9}$/;
    if(!(reg.test(phone_num))){
        $('.phone_num_no').css('display','inline-block');
    }
}).on('focus',function(){
    $('.phone_num_no').css('display','none');
});













