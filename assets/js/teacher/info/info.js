/**
 * Created by yilong on 2016/10/13.
 */

function right_bar_cb() {
    $('#info_button').attr('class', 'side-button-selected right-side-button');
}

//取消确定button的点击事件样式
function Change() {
    document.getElementById("boy").disabled = false;
    document.getElementById("girl").disabled = false;
    $(".laydate").css("display","inline");
    $(".mail").css("display","inline");
    $(".info-list .btn").css("display","inline");
    $(".code").css("display","block");
    $(".change-info").css("display","none");
    $(".off").css("display","inline");
    $(".sure").css("display","inline");
    $(".birth span").css("display","none");
    $(".email span").css("display","none");
}
function Sure(){
    document.getElementById("boy").disabled = true;
    document.getElementById("girl").disabled = true;
    $(".laydate").css("display","none");
    $(".mail").css("display","none");
    $(".info-list .btn").css("display","none");
    $(".code").css("display","none");
    $(".change-info").css("display","block");
    $(".off").css("display","none");
    $(".sure").css("display","none");
    $(".birth span").css("display","inline");
    $(".email span").css("display","inline");
}
function Back(){
    document.getElementById("boy").disabled = true;
    document.getElementById("girl").disabled = true;
    $(".laydate").css("display","none");
    $(".mail").css("display","none");
    $(".info-list .btn").css("display","none");
    $(".code").css("display","none");
    $(".change-info").css("display","block");
    $(".off").css("display","none");
    $(".sure").css("display","none");
    $(".birth span").css("display","inline");
    $(".email span").css("display","inline");

}


//载入读取个人信息
function load_info() {
    $.ajax({
        xhrFields: {
            withCredentials: true
        },
        type: 'GET',
        url: URL_BASE + '/users/web/user/current',
        success: function(data) {
            //console.log(data);
            $(".name span").html(data.name);
            $(".birth span").html(data.birthday);
            $(".email span").html(data.email);
            $(".school span").html(data.school.name);
            $(".class-name span").html(data.classes[0].name);
            $(".city span").html(data.school.address);
            $("#headimg").attr('src', data.headimg);
            $(".right-photo img").attr('src', data.headimg);
            if(data.gender == 1 ){
                $("#boy").attr("checked","checked");
            }else if(data.gender == 2 ){
                $("#girl").attr("checked","");
            }
        }
    });
}

//修改头像

$('#submit').click(function () {
    $.ajax({
        url: URL_BASE + '/users/web/user/current/headimg',
        type: 'PUT',
        xhrFields: {
            withCredentials: true
        },
        data: new FormData($('#headimg_form')[0]),
        processData: false,
        contentType: false,
        success: function () {
            my_tip.alert('haha');
        }
    })
});

$('#modify_avatar').click(function () {
        $('#avatar-modal').modal('show');
    }
);

//修改个人信息
$(".sure").click(function() {
    var birthday = $(".laydate").val();
    if ($("#boy").is(":checked")) {
        var gender = 1;
    } else if ($("#girl").is(":checked")) {
        var gender = 2;
    }

    $.ajax({
        xhrFields: {
            withCredentials: true
        },
        contentType: 'application/json',
        data: JSON.stringify({
            "info": {
                "birthday": birthday
            },
            "gender": gender
        }),
        type: 'PUT',
        url: URL_BASE + '/users/web/user/current',
        success: function (data) {
            //console.log(data);
            load_info();
        },
        error: ajax_error_handler
    });
});
// 设置重发验证码的时间
var t = 60;
function reset_time() {
    t = 60;
}

function refresh_button() {
    var tmp = $('.email .btn');
    tmp.addClass('disabled');
    t -= 1;
    tmp.attr('value', '重发验证码(' + t.toString() + ')');
    if (t == 0) {
        tmp.removeClass('disabled');
        tmp.attr('value', '发送验证码');
        reset_time();
        return;
    }
    setTimeout(refresh_button, 1000);
}
//绑定邮箱获取验证码
var code ='';
$(".email .btn").on("click",function () {
    var newAccount = $(".mail").val();
    if (newAccount == '') {
        my_tip.alert('请填写邮箱！');
        return;
    }
    refresh_button();
    //console.log(newAccount);
    $.ajax({
        url: URL_BASE + '/users/web/user/current/account/preChange',
        type: 'POST',
        xhrFields: {
            withCredentials: true
        },
        data: {
            newAccount: newAccount,
            accountType: 4
        },
        success: function (data) {
            console.log(data);
            $(".sure").click(function(){
                var birthday = $(".laydate").val();
                if($("#boy").is(":checked")) {
                    var gender = 1;
                }else if($("#girl").is(":checked")) {
                    var gender = 2;
                }

                $.ajax({
                    xhrFields: {
                        withCredentials: true
                    },
                    contentType: 'application/json',
                    data: JSON.stringify({
                        "info":{
                            "birthday": birthday
                        },
                        "gender": gender
                    }),
                    type: 'PUT',
                    url: URL_BASE + '/users/web/user/current',
                    success: function(data) {
                        //console.log(data);
                        load_info();
                    },
                    error: ajax_error_handler
                });
                //验证邮箱验证码
                code = $(".code-num").val();
                console.log(code);
                $.ajax({
                    url: URL_BASE + '/users/web/user/current/account/doChange',
                    type: 'POST',
                    xhrFields: {
                        withCredentials: true
                    },
                    data: {
                        authId: data,
                        authCode: code
                    },
                    success: function (data) {
                        console.log(data);

                        //邮箱验证成功之后修改个人信息
                        var birthday = $(".laydate").val();
                        if($("#boy").is(":checked")) {
                            var gender = 1;
                        }else if($("#girl").is(":checked")) {
                            var gender = 2;
                        }

                        $.ajax({
                            xhrFields: {
                                withCredentials: true
                            },
                            contentType: 'application/json',
                            data: JSON.stringify({
                                "info":{
                                    "birthday": birthday
                                },
                                "gender": gender
                            }),
                            type: 'PUT',
                            url: URL_BASE + '/users/web/user/current',
                            success: function(data) {
                                //console.log(data);
                                load_info();
                            },
                            error: ajax_error_handler
                        });
                    },
                    error: ajax_error_handler
                });
            });
        }
    })
});

