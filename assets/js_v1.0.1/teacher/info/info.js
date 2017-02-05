/**
 * Created by yilong on 2017/1/12.
 */
//获取省市区三联
var province = [];
function get_province(){
    $.ajax({
        xhrFields: {
            withCredentials: true
        },
        type: 'GET',
        url: URL_BASE + '/users/open/region/topRegions',
        success: function(data) {
            //console.log(data.length);
            for(var i = 0;i < data.length;i++){
                province.push({
                    id: data[i].id,
                    text:data[i].regionName
                });
            }
            $('#select_province').select2({
                data: province,
                language: 'zh-CN'
            });
            //初始默认显示
            get_city($("#select_province").val());

            $("#select_province").on('change',function(){

                $("#select_city").empty();
                $("#select_district").empty();

                get_city($("#select_province").val());

            });
        },
        error: ajax_error_handler
    });
}
//市
function get_city(parentId){
    var city = [];
    $.ajax({
        xhrFields: {
            withCredentials: true
        },
        type: 'GET',
        url: URL_BASE + '/users/open/region/'+ parentId +'/subRegions',
        success: function(data) {
            //console.log(data);
            for(var i = 0;i < data.length;i++){
                city.push({
                    id: data[i].id,
                    text:data[i].regionName
                });
            }
            $('#select_city').select2({
                data: city,
                language: 'zh-CN'
            });
            //初始默认显示
            get_district($("#select_city").val());

            $("#select_city").on('change',function(){

                $("#select_district").empty();

                get_district($("#select_city").val());

            });
        },
        error: ajax_error_handler
    });
}
//区
function get_district(parentId){
    var district = [];
    $.ajax({
        xhrFields: {
            withCredentials: true
        },
        type: 'GET',
        url: URL_BASE + '/users/open/region/'+ parentId +'/subRegions',
        success: function(data) {
            //console.log(data)
            for(var i = 0;i < data.length;i++){
                district.push({
                    id: data[i].regionCode,
                    text:data[i].regionName
                });
            }
            $('#select_district').select2({
                data: district,
                language: 'zh-CN'
            });
            $("#select_district").on('change',function(){

                $("#select_school").empty();

                get_school($("#select_district").val());

            });
        },
        error: ajax_error_handler
    });
}

//获取区域的学校
function get_school(addrCode){
    var school = [];
    $.ajax({
        xhrFields: {
            withCredentials: true
        },
        type: 'GET',
        url: URL_BASE + '/users/open/school/region/list',
        data:{
            addrCode:addrCode
        },
        success: function(data) {
            //console.log(data);
            for(var i = 0;i < data.length;i++){
                school.push({
                    id: data[i].id,
                    text:data[i].name
                });
            }
            $('#select_school').select2({
                data: school,
                language: 'zh-CN'
            });
            $("#select_school").on('change',function(){

                $("#select_class").empty();

            });
        },
        error: ajax_error_handler
    });
}




$('#modify_avatar').click(function () {
        $('#avatar-modal').modal('show');
    });


$('#select_school').select2({
    data: 10,
    language: 'zh-CN'
});
//选择修改个人信息还是修改密码
$(".personal_information").on('click',function(){
    $(this).addClass('index');
    $(".change_password").removeClass('index');
    $('.change_info').css('display','block');
    $(".change_pwd").css('display','none');
    $(".new_phone").css('display','none');
    $(".new_mail").css('display','none');
    $(".new_phone .pwd").css('display','none');
    $(".new_mail .pwd").css('display','none');
    $(".new_mail .mail_num").css('display','none');
    $(".new_phone .phone_num").css('display','none');
});

$(".change_password").on('click',function(){
    $(this).addClass('index');
    $(".personal_information").removeClass('index');
    $('.change_info').css('display','none');
    $(".change_pwd").css('display','block');
    $(".new_phone").css('display','none');
    $(".new_mail").css('display','none');
    $(".new_phone .pwd").css('display','none');
    $(".new_mail .pwd").css('display','none');
    $(".new_mail .mail_num").css('display','none');
    $(".new_phone .phone_num").css('display','none');
});
//点击修改个人信息事件
$("#change").on('click',function(){
    document.getElementById("boy").disabled = false;
    document.getElementById("girl").disabled = false;
    $(".gray").css('display','none');
    $(".select_open").css('display','inline-block');
    $(".name input").css('display','inline-block').val($('.name .gray').html());
    $("#change").css('display','none');
    $("#back").css('display','block');
    $("#sure").css('display','block');
    $(".info_list .group p").css('display','inline-block');
});
$("#back").on('click',function(){
    document.getElementById("boy").disabled = true;
    document.getElementById("girl").disabled = true;
    $(".gray").css('display','inline-block');
    $(".select_open").css('display','none');
    $(".name input").css('display','none');
    $("#change").css('display','inline-block');
    $("#back").css('display','none');
    $("#sure").css('display','none');
    $(".info_list .group p").css('display','none');
});


//绑定手机号
$(".phone p").on('click',function(){
    $(".change_info").css('display','none');
    $(".new_phone").css('display','block');
    $(".new_phone .pwd").css('display','block');
    //确认当前密码页面 上一步
    $(".new_phone .pwd .up").on('click',function(){
        $(".change_info").css('display','block');
        $(".new_phone").css('display','none');
        $(".new_phone .pwd").css('display','none');
    });
    //确认当前密码页面 验证密码 下一步
    $(".new_phone .pwd .down").on('click',function(){
        var password = $(".new_phone .pwd .group input").val();

        $(".phone_num").css('display','block');
        $(".new_phone .pwd").css('display','none');


        $(".new_phone_num").blur(function(){
            var new_phone = $(".new_phone .phone_num .new_phone_num").val();
            var reg = /^1(3|4|5|7|8)\d{9}$/;
            console.log(new_phone);
            if(!reg.test(new_phone)){
                $(".phone_num .error").css('display','block');
            }
            $(this).focus(function(){
                $(".phone_num .error").css("display","none");
            })
        });

        //获取绑定手机号验证码
        $(".new_phone .phone_num .group .gain").on('click',function(){
            new_phone = $(".new_phone .phone_num .new_phone_num").val();
            console.log(new_phone)

            $.ajax({
                xhrFields: {
                    withCredentials: true
                },
                data: {
                    newAccount : new_phone,
                    accountType : 3
                },
                type: 'POST',
                url: URL_BASE + '/users/web/user/current/account/preChange',
                success: function (data) {
                    console.log(data);
                    //确定绑定手机号事件
                    $("#sure_new_phone").on('click',function(){

                        var authId = data,
                            authCode = $(".new_phone .phone_num .new_phone_check_num").val();
                        console.log(authCode);
                        $.ajax({
                            xhrFields: {
                                withCredentials: true
                            },
                            data: {
                                authId : authId,
                                authCode : authCode,
                                newAccount : new_phone,
                                accountType : 3
                            },
                            type: 'POST',
                            url: URL_BASE + '/users/web/user/current/account/doChange',
                            success: function (data) {
                                var text = '恭喜您，手机绑定成功！';
                                my_tip.bind(text,function(){
                                    window.open('info.html','_self');
                                });

                            },
                            error: ajax_error_handler
                        });
                    });
                },
                error: ajax_error_handler
            });
        });

        //输入新的手机号码 上一步
        $(".phone_num .up").on('click',function(){
            $(".new_phone").css('display','block');
            $(".new_phone .pwd").css('display','block');
            $(".phone_num").css('display','none');
        });
    });
});


//绑定邮箱
$(".mail p").on('click',function(){
    $(".change_info").css('display','none');
    $(".new_mail").css('display','block');
    $(".new_mail .pwd").css('display','block');
    //确认当前密码页面 上一步
    $(".new_mail .pwd .up").on('click',function(){
        $(".change_info").css('display','block');
        $(".new_mail").css('display','none');
        $(".new_mail .pwd").css('display','none');
    });
    //确认当前密码页面 验证当前密码 下一步
    $(".new_mail .pwd .down").on('click',function(){
        var password = $(".new_mail .pwd .group .ipt").val();

        $(".mail_num").css('display','block');
        $(".new_mail .pwd").css('display','none');

        $(".new_mail_num").blur(function(){
            var new_mail = $(".new_mail .mail_num .new_mail_num").val();
            var reg = /^\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/;
            console.log(new_mail);
            if(!reg.test(new_mail)){
                $(".mail_num .error").css('display','block');
            }
            $(this).focus(function(){
                $(".mail_num .error").css("display","none");
            })
        });


        //获取绑定邮箱验证码
        $(".new_mail .mail_num .group .gain").on('click',function(){
            new_mail = $(".new_mail .mail_num .new_mail_num").val();

            $.ajax({
                xhrFields: {
                    withCredentials: true
                },
                data: {
                    newAccount : new_mail,
                    accountType : 4
                },
                type: 'POST',
                url: URL_BASE + '/users/web/user/current/account/preChange',
                success: function (data) {
                    //console.log(data);

                    //确定绑定邮箱事件
                    $("#sure_new_mail").on('click',function(){

                        var authId = data,
                            authCode = $(".new_mail .mail_num .new_mail_check_num").val();

                        $.ajax({
                            xhrFields: {
                                withCredentials: true
                            },
                            data: {
                                authId : authId,
                                authCode : authCode,
                                newAccount : new_mail,
                                accountType : 4
                            },
                            type: 'POST',
                            url: URL_BASE + '/users/web/user/current/account/doChange',
                            success: function (data) {
                                my_tip.alert('恭喜您，邮箱绑定成功！');
                            },
                            error: ajax_error_handler
                        });
                    });
                },
                error: ajax_error_handler
            });
        });

        //输入新的邮箱  上一步
        $(".mail_num .up").on('click',function(){
            $(".new_mail").css('display','block');
            $(".new_mail .pwd").css('display','block');
            $(".mail_num").css('display','none');
        });
    });
});




//载入读取个人信息
function load_info() {
    $.ajax({
        xhrFields: {
            withCredentials: true
        },
        type: 'GET',
        url: URL_BASE + '/users/web/user/current',
        success: function(data) {
            console.log(data)
            //console.log(data.school.address);
            $(".id span").html(data.account);
            $(".name span").html(data.name);
            $(".mail span").html(data.email);
            $(".phone span").html(data.tel);
            $(".school .school_cont").html(data.school.address);
            $("#headimg").attr('src', data.headimg);
            if(data.gender == 1 ){
                $("#boy").attr("checked","checked");
            }else if(data.gender == 2 ){
                $("#girl").attr("checked","");
            }
        },
        error: ajax_error_handler
    });
}

//修改个人信息
$("#sure").click(function() {
    document.getElementById("boy").disabled = true;
    document.getElementById("girl").disabled = true;
    $(".gray").css('display','inline-block');
    $(".select_open").css('display','none');
    $(".name input").css('display','none');
    $("#change").css('display','inline-block');
    $("#back").css('display','none');
    $("#sure").css('display','none');
    $(".info_list .group p").css('display','none');


    var name = $(".name input").val();
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
            "name":name,
            "gender": gender
        }),
        type: 'PUT',
        url: URL_BASE + '/users/web/user/current',
        success: function (data) {
            console.log(data);
            load_info();
        },
        error: ajax_error_handler
    });
});


//修改密码
$("#password-1").blur(function(){
    var oldPassword = $("#password-1").val();
    var reg = /^[0-9]*$/;
    //if(!verification(oldPassword)){
    console.log(oldPassword);
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
    //if(!verification(newPassword)){
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
$("#sure_change_pwd").click(function(){
    var oldPassword = $("#password-1").val();
    var newPassword = $("#password-2").val();
    var surePassword = $("#password-3").val();
    console.log(oldPassword);

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
                my_tip.alert("修改密码成功");
            },
            error:function(data){
                my_tip.alert("原始密码输入错误");
            }
        });
    }
});