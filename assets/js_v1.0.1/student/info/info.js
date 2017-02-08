/**
 * Created by yilong on 2017/1/12.
 */

//年月日下拉三联
function YYYYMMDDstart() {
    MonHead = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];

    //先给年下拉框赋内容
    var y = new Date().getFullYear();
    for (var i = (y - 17); i < (y + 1); i++) { //以今年为准
        document.reg_testdate.YYYY.options.add(new Option(i, i));
    }
    //赋月份的下拉框
    for (var i = 1; i < 13; i++){

        document.reg_testdate.MM.options.add(new Option(i , i));

    }


    document.reg_testdate.YYYY.value = y;
    document.reg_testdate.MM.value = new Date().getMonth() + 1;
    var n = MonHead[new Date().getMonth()];
    //if (new Date().getMonth() ==1 && IsPinYear(YYYYvalue)) n++;
    writeDay(n); //赋日期下拉框
    document.reg_testdate.DD.value = new Date().getDate();
}
if(document.attachEvent)
    window.attachEvent("onload", YYYYMMDDstart);
else
    window.addEventListener('load', YYYYMMDDstart, false);
function YYYYDD(str) //年发生变化时日期发生变化(主要是判断闰平年)
{
    var MMvalue = document.reg_testdate.MM.options[document.reg_testdate.MM.selectedIndex].value;
    if (MMvalue == ""){ var e = document.reg_testdate.DD; optionsClear(e); return;}
    var n = MonHead[MMvalue - 1];
    if (MMvalue ==2 && IsPinYear(str)) n++;
    writeDay(n)
}
function MMDD(str)   //月发生变化时日期联动
{
    var YYYYvalue = document.reg_testdate.YYYY.options[document.reg_testdate.YYYY.selectedIndex].value;
    if (YYYYvalue == ""){ var e = document.reg_testdate.DD; optionsClear(e); return;}
    var n = MonHead[str - 1];
    if (str ==2 && IsPinYear(YYYYvalue)) n++;
    writeDay(n)
}
function writeDay(n)   //据条件写日期的下拉框
{
    var e = document.reg_testdate.DD; optionsClear(e);
    for (var i=1; i<(n+1); i++){

        e.options.add(new Option( i, i));
    }

}
function IsPinYear(year)//判断是否闰平年
{     return(0 == year%4 && (year%100 !=0 || year%400 == 0));}
function optionsClear(e)
{
    e.options.length = 1;
}







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
var school_list = [];
function get_school(addrCode){
    school_list = [];
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

            for(var i = 0;i <  data.length;i++){
                school_list.push({
                    id: data[i].id,
                    text:data[i].name
                });
            }
            $('#select_school').select2({
                data: school_list,
                language: 'zh-CN'
            });
            $("#select_school").on('change',function(){

                $("#select_class").empty();

            });
        },
        error: ajax_error_handler
    });
}
//获取学校班级
//function get_class(classId){
//    var Class = [];
//    $.ajax({
//        xhrFields: {
//            withCredentials: true
//        },
//        type: 'GET',
//        url: URL_BASE + '/users/open/school/'+ classId + '',
//        success: function(data) {
//            console.log(data);
//            for(var i = 0;i < data.length;i++){
//                Class.push({
//                    id: data[i].id,
//                    text:data[i].name
//                });
//            }
//            $('#select_class').select2({
//                data: Class,
//                language: 'zh-CN'
//            });
//        },
//        error: ajax_error_handler
//    });
//}




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
var new_phone;
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
            new_phone = $(".new_phone .phone_num .new_phone_num").val();
            var reg = /^1(3|4|5|7|8)\d{9}$/;
            console.log(new_phone);
            if(!reg.test(new_phone)){
                $(".phone_num .error").css('display','block');
            }
            $(this).focus(function(){
                $(".phone_num .error").css("display","none");
            })
        });

        //输入新的手机号码 上一步
        $(".phone_num .up").on('click',function(){
            $(".new_phone").css('display','block');
            $(".new_phone .pwd").css('display','block');
            $(".phone_num").css('display','none');
        });
    });
});


//绑定新的手机号获取验证码倒计时
var clock = '';
var nums = 60;
var btn;
function phone_sendCode(thisBtn)
{

    new_phone = $(".new_phone .phone_num .new_phone_num").val();
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


    btn = thisBtn;
    btn.disabled = true; //将按钮置为不可点击
    btn.value = nums+'秒后可重新获取';
    clock = setInterval(doLoop, 1000); //一秒执行一次
    $(btn).css({
        'background':'#e8ecef',
        'color':'#999',
        'cursor':'not-allowed'
    });
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

        $(btn).css({
            'background':'#f89d32',
            'color':'#fff',
            'cursor':'pointer'
        });

    }
}



//绑定邮箱
var new_mail;
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
        //if
        $(".mail_num").css('display','block');
        $(".new_mail .pwd").css('display','none');


        $(".new_mail_num").blur(function(){
            new_mail = $(".new_mail .mail_num .new_mail_num").val();
            var reg = /^\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/;
            console.log(new_mail);
            if(!reg.test(new_mail)){
                $(".mail_num .error").css('display','block');
            }
            $(this).focus(function(){
                $(".mail_num .error").css("display","none");
            })
        });

        //输入新的邮箱  上一步
        $(".mail_num .up").on('click',function(){
            $(".new_mail").css('display','block');
            $(".new_mail .pwd").css('display','block');
            $(".mail_num").css('display','none');
        });
    });
});

//绑定新的邮箱获取验证码倒计时
function mail_sendCode(thisBtn)
{
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
                        my_tip.bind('恭喜您，邮箱绑定成功！',function(){
                            window.open('info.html','_self');
                        });
                    },
                    error: ajax_error_handler
                });
            });
        },
        error: ajax_error_handler
    });

    btn = thisBtn;
    btn.disabled = true; //将按钮置为不可点击
    btn.value = nums+'秒后可重新获取';
    clock = setInterval(doLoop, 1000); //一秒执行一次
    $(btn).css({
        'background':'#e8ecef',
        'color':'#999',
        'cursor':'not-allowed'
    });
}



//获取星座
function getConstellation(m,d){
    var s="魔羯水瓶双鱼牧羊金牛双子巨蟹狮子处女天枰天蝎射手魔羯";
    var arr=[20,19,21,21,21,22,23,23,23,23,22,22];
    return s.substr(m*2-(d<arr[m-1]?2:0),2);
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
            console.log(data);
            var strObj = data.info.birthday;
            var star_sign = getConstellation(strObj.substring(5,7),strObj.substring(8,10));
            switch (star_sign){
                case '魔羯':
                    $(".star_sign img").attr('src','../../../assets/img/v1.0.1/star/star1.png');
                    break;
                case '水瓶':
                    $(".star_sign img").attr('src','../../../assets/img/v1.0.1/star/star2.png');
                    break;
                case '双鱼':
                    $(".star_sign img").attr('src','../../../assets/img/v1.0.1/star/star3.png');
                    break;
                case '牧羊':
                    $(".star_sign img").attr('src','../../../assets/img/v1.0.1/star/star4.png');
                    break;
                case '金牛':
                    $(".star_sign img").attr('src','../../../assets/img/v1.0.1/star/star5.png');
                    break;
                case '双子':
                    $(".star_sign img").attr('src','../../../assets/img/v1.0.1/star/star6.png');
                    break;
                case '巨蟹':
                    $(".star_sign img").attr('src','../../../assets/img/v1.0.1/star/star7.png');
                    break;
                case '狮子':
                    $(".star_sign img").attr('src','../../../assets/img/v1.0.1/star/star8.png');
                    break;
                case '处女':
                    $(".star_sign img").attr('src','../../../assets/img/v1.0.1/star/star9.png');
                    break;
                case '天枰':
                    $(".star_sign img").attr('src','../../../assets/img/v1.0.1/star/star10.png');
                    break;
                case '天蝎':
                    $(".star_sign img").attr('src','../../../assets/img/v1.0.1/star/star11.png');
                    break;
                case '射手':
                    $(".star_sign img").attr('src','../../../assets/img/v1.0.1/star/star1.png');
                    break;

            }
            if(data.info.birthday == 'null'){
                $(".birthday .gray").html();
                $(".star_sign img").attr('src','');
            }else{
                $(".birthday .gray").html(data.info.birthday);
            }


            if(data.classes[0] == null ){
                $(".class_name span").html('未加入班级');
            }else{
                $(".class_name span").html(data.classes[0].name)
            }

            if(data.email !==  null){
                $(".mail span").html(data.email);
            }else{
                $(".mail span").html('未绑定邮箱');
            }

            if(data.tel !==  null){
                $(".phone span").html(data.tel);
            }else{
                $(".phone span").html('未绑定手机号');
            }

            $(".id span").html(data.account);
            $(".name span").html(data.name);
            $(".school .gray").html(data.school.name);
            $(".city .gray").html(data.school.address);
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

    if ($("#boy").is(":checked")) {
        var gender = 1;
    } else if ($("#girl").is(":checked")) {
        var gender = 2;
    }

    var name = $(".name input").val(),
        year = $(".date select[name = YYYY]").val(),
        month = $(".date select[name = MM]").val(),
        day = $(".date select[name = DD]").val();

    if(month < 10){
        month = '0' + month;
    }
    if(day < 10){
        day = '0' + day;
    }

    var birthday = year+'-'+month+'-'+day;

    //var school_id = $("#select_school").select2('val');

    $.ajax({
        xhrFields: {
            withCredentials: true
        },
        contentType: 'application/json',
        data: JSON.stringify({
            "name":name,
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


//修改密码
$("#password-1").blur(function(){
    var oldPassword = $("#password-1").val();
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