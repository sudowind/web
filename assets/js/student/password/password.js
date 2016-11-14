/**
 * Created by yilong on 2016/10/14.
 */
//正则验证表单格式提示
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