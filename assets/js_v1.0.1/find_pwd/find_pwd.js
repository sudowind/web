/**
 * Created by yilong on 2017/1/7.
 */

//1-2手机找回方式
$(".phone_find").on('click',function(){
    $(".test_info").css('display','none');
    $(".two img").attr('src','../../assets/img/v1.0.1/find_two_select.png');
    $(".two_font").addClass('blue');
    $(".phone_reset_pwd").css('display','block');

    //2-3手机验证success
    $(".phone_next_step").on('click',function(){
        var phone_num_last = $('#phone_num').val();
        var authCode = $('.authCode').val();

        $.ajax({
                xhrFields: {
                    withCredentials: true
                },
                type: 'POST',
                url: URL_BASE + '/users/open/user/mailPassword/checkCode',
                data: {
                    account:phone_num_last,
                    accountType:3,
                    authId:telAuthId,
                    authCode:authCode
                },
            success: function(data) {
                if(data == false){
                    $('.error').css('display','block');
                    return;
                }
                $(".phone_reset_pwd").css('display','none');
                $(".three img").attr('src','../../assets/img/v1.0.1/find_three_select.png');
                $(".three_font").addClass('blue');
                $(".success_reset_pwd").css('display','block');


                    //警示提示
                    $('#password-1').on('focus',function(){
                        $('.pass_no').css('display','none');
                    });
                    $('#password-2').on('blur',function(){
                        var pwd_1 = $('#password-1').val();
                        var pwd_2 = $('#password-2').val();
                        if(pwd_1 !== pwd_2){
                            $('.pass_no').css('display','inline-block');
                        }else{
                            //输入重置密码
                            $('#success_login').on('click',function(){
                                console.log()
                                $.ajax({
                                    xhrFields: {
                                        withCredentials: true
                                    },
                                    type: 'POST',
                                    url: URL_BASE + '/users/open/user/mailPassword/doChange',
                                    data: {
                                        newPassword : pwd_2,
                                        account:phone_num_last,
                                        accountType:3,
                                        authId:telAuthId,
                                        authCode:authCode
                                    },
                                    success: function(data) {
                                        window.open('../login.html','_self');
                                    },
                                    error: ajax_error_handler
                                });
                            });
                        }


                    }).on('focus',function(){
                        $('.pass_no').css('display','none');
                    });

            },
            error: ajax_error_handler
        });
    });
});
//1-2邮箱找回方式
$(".email_find").on('click',function(){
    $(".test_info").css('display','none');
    $(".two img").attr('src','../../assets/img/v1.0.1/find_two_select.png');
    $(".two_font").addClass('blue');
    $(".mail_reset_pwd").css('display','block');

    //2-3邮箱验证success
    $(".mail_next_step").on('click',function(){
        $(".mail_reset_pwd").css('display','none');
        $(".three img").attr('src','../../assets/img/v1.0.1/find_three_select.png');
        $(".three_font").addClass('blue');
        $(".success_reset_pwd").css('display','block');
    });
});

//3-2重新选择验证方式
$(".back").on('click',function(){
    $(".phone_reset_pwd").css('display','none');
    $(".mail_reset_pwd").css('display','none');
    $(".two img").attr('src','../../assets/img/v1.0.1/find_two_unselect.png');
    $(".two_font").removeClass('blue');
    $(".test_info").css('display','block');
});



//手机号方式找回密码
var telAuthId = '';
var clock = '';
var nums = 60;
var btn;
function phone_sendCode(thisBtn)
{

    var tel = $("#phone_num").val();
    console.log(tel);
    $.ajax({
        xhrFields: {
            withCredentials: true
        },
        type: 'POST',
        url: URL_BASE + '/users/open/user/mailPassword/preChange',
        data: {
            account:tel,
            accountType:3
        },
        success: function(data) {
            console.log(data);
            telAuthId = data;
        },
        error: ajax_error_handler
    });

    $('.get_phone_pwd').css({
        'background':'#e8ecef',
        'color':'#999',
        'cursor':'not-allowed'
    });
    //$('.phone_reset_pwd p').css('display','block');
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

        $('.get_phone_pwd').css({
            'background':'#3f8ebe',
            'color':'#fff',
            'cursor':'pointer'
        });
        //$('.phone_reset_pwd p').css('display','none');

    }
}

//邮箱方式找回密码
//function mail_sendCode(thisBtn)
//{
//
//    var mail = $("#mail").val();
//    $.ajax({
//        xhrFields: {
//            withCredentials: true
//        },
//        type: 'POST',
//        url: URL_BASE + '/users/open/user/mailPassword/preChange',
//        data: {
//            userId:,
//
//        },
//        success: function(data) {
//            console.log(data);
//            telAuthId = data;
//        },
//        error: ajax_error_handler
//    });
//
//    $('.get_phone_pwd').css({
//        'background':'#e8ecef',
//        'color':'#999',
//        'cursor':'not-allowed'
//    });
//    btn = thisBtn;
//    btn.disabled = true; //将按钮置为不可点击
//    btn.value = nums+'秒后可重新获取';
//    clock = setInterval(doLoop, 1000); //一秒执行一次
//}


$('#phone_num').on('blur',function(){
    var phone_num = $('#phone_num').val();
    var reg =/^1[34578]\d{9}$/;
    if(!(reg.test(phone_num))){
        $('.phone_num_no').css('display','inline-block');
    }
}).on('focus',function(){
    $('.phone_num_no').css('display','none');
});

$('#mail').on('blur',function(){
    var mail_num = $('#mail').val();
    var reg =/^([0-9A-Za-z\-_\.]+)@([0-9a-z]+\.[a-z]{2,3}(\.[a-z]{2})?)$/;
    if(!(reg.test(mail_num))){
        $('.mail_num_no').css('display','inline-block');
    }
}).on('focus',function(){
    $('.mail_num_no').css('display','none');
});

$('.authCode').on('focus',function(){
    $('.error').css('display','none');
});





