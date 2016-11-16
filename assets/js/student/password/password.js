/**
 * Created by yilong on 2016/10/14.
 */
//正则验证表单格式提示

function is_letter(val) {
    return !!((val >= 65 && val <= 90) || (val >= 97 && val <= 122));
}
function is_digital(val) {
    return !!((val >= 48 && val <= 57));
}

function verification(password) {
    var has_letter = false;
    var has_digital = false;
    var has_punctuation = false;
    var verification_count = 0;
    for (var i = 0; i < password.length; ++i) {
        var tmp_char = password[i];
        var ascii_num = tmp_char.charCodeAt();
        if (ascii_num < 127 && ascii_num > 32) {
            if (is_letter(ascii_num))
                has_letter = true;
            else if (is_digital(ascii_num))
                has_digital = true;
            else
                has_punctuation = true;
        }
        else {
            return false;
        }
    }
    if (has_letter)
        verification_count += 1;
    if (has_digital)
        verification_count += 1;
    if (has_punctuation)
        verification_count += 1;

    return verification_count >= 2;
}


$("#password-1").blur(function(){
    var oldPassword = $("#password-1").val()
    var reg = /^[0-9]*$/;
    if(!reg.test(oldPassword)){
        $(".old-pw span").css("display","block");
    }
    $(this).focus(function(){
        $(".old-pw span").css("display","none");
    })
});
$("#password-2").blur(function(){
    var newPassword = $("#password-2").val();
    var reg = /^[0-9]*$/;
    if(!reg.test(newPassword)){
        $(".set-pw span").css("display","block");
    }
    $(this).focus(function(){
        $(".set-pw span").css("display","none");
    })
});
$("#password-3").blur(function(){
    var newPassword = $("#password-2").val();
    var surePassword = $("#password-3").val();
    if(newPassword != surePassword){
        $(".sure-pw span").css("display","block");
    }else{
        $(".sure-pw span").css("display","none");
    }
});
$("#submit").click(function(){
    var oldPassword = $("#password-1").val();
    var newPassword = $("#password-2").val();
    var surePassword = $("#password-3").val();

    if( newPassword = surePassword){
        $.ajax({
            xhrFields: {
                withCredentials: true
            },
            type: 'PUT',
            url: URL_BASE + '/users/web/user/current/password',
            data: {
                oldPassword: oldPassword,
                newPassword: newPassword
            },
            success: function(data) {
                my_tip.alert("密码修改成功");
            },
            error:function(data){
                my_tip.alert("原始密码输入错误");
            }
        });
    }


})