/**
 * Created by wind on 2016/11/10.
 */
var TASK_STATUS = {
    1: 'not assigned',
    2: 'not start',
    3: 'reading',
    4: 'completed'
};

Date.prototype.getFullDate = function(type) {
    // 返回date对应的日期字符串
    var year = this.getFullYear().toString();
    var month = (this.getMonth() + 1).toString();
    if (month.length < 2)
        month = '0' + month;
    var day = this.getDate().toString();
    if (day.length < 2)
        day = '0' + day;
    if (type == 'zh') {
        return '{0}年{1}月{2}日'.format(year, month, day);
    }
    else
        return '{0}-{1}-{2}'.format(year, month, day);
};

function open_mail_url(mail_address) {
    // 给定邮箱打开邮箱登录界面
    var url = '';
    if (mail_address.indexOf('gmail') >= 0) {
        url = 'http://gmail.google.com';
    }
    else {
        url = 'http://mail.' + mail_address.split('@')[1]
    }
    window.open(url);
}

String.prototype.format = function(args) {
    // string format
    if (arguments.length>0) {
        var result = this;
        if (arguments.length == 1 && typeof (args) == "object") {
            for (var key in args) {
                var reg = new RegExp ("({"+key+"})","g");
                result = result.replace(reg, args[key]);
            }
        }
        else {
            for (var i = 0; i < arguments.length; i++) {
                if(arguments[i]==undefined)
                {
                    return "";
                }
                else
                {
                    var reg = new RegExp ("({["+i+"]})","g");
                    result = result.replace(reg, arguments[i]);
                }
            }
        }
        return result;
    }
    else {
        return this;
    }
};

// 用于图书管理
function set_online_status(is_online) {
    $.ajax({
        xhrFields: {
            withCredentials: true
        },
        type: 'put',
        url: URL_BASE + '/tasks/web/task/student/current/{0}/onlineStatus'.format($.getUrlParam('task_id')),
        data: {
            isOnline: is_online
        },
        error: ajax_error_handler
    })
}

// window.onload = function () {
//     // 测试鼠标绑定事件
//     $(document).mouseup(function(e){
//         var text = document.getSelection().toString();
//         $('#teacher_name').html('{0}'.format(text));
//         if (text.length > 0) {
//             $('.context-menu').remove();
//             $('body .main-body').append('<div class="context-menu" style="background: #ffffff; position: fixed; top: {0}px; left: {1}px">{2}</div>'.format(e.clientY, e.clientX, text));
//         }
//     }).contextmenu(function (e) {
//         $('.context-menu').remove();
//         $('body .main-body').append('<div class="context-menu" style="background: #ffffff; position: fixed; top: {0}px; left: {1}px">haha</div>'.format(e.clientY, e.clientX));
//         return false
//     }).click(function (e) {
//         var text = document.getSelection().toString();
//         if (text.length <= 0)
//             $('.context-menu').remove();
//     });
// };

function safe_divide(a, b) {
    if (b == 0)
        return 0;
    else
        return a / b;
}

function get_current_semester() {
    var now = new Date();
    var curr_month = now.getMonth();
    var start_time = 0;
    var end_time = 0;
    var start = now, end = now;
    //console.log(curr_month);
    if (curr_month >= 1 && curr_month <= 7) {
        start.setMonth(1);
        start_time = start.setDate(0);
        end.setMonth(8);
        end_time = end.setDate(0);
    }
    else {
        if (curr_month > 7) {
            start.setMonth(8);
            start_time = start.setDate(0);
            end.setYear(now.getYear() + 1 + 1900);
            end.setMonth(1);
            end_time = end.setDate(0);
        }
        else {
            start.setYear(now.getYear() - 1 + 1900);
            start.setMonth(8);
            start_time = start.setDate(0);
            end.setMonth(1);
            end_time = end.setDate(0);
        }
    }
    return [start_time, end_time];
}

function rand_ER() {
    return Math.ceil((Math.random() * 600000) % 600) + 600;
}

// 检测一个区域是否滚动到了底部
function gen_scroll_to_end_handler(selector, func) {
    $(selector).scroll(function () {
        var scroll_top = $(this).scrollTop();
        var height = $(this).height();
        var scroll_height = $(this)[0].scrollHeight;
        if (scroll_height == height + scroll_top) {
            func();
        }
    })
}

//个人中心绑定新的手机号获取验证码倒计时
function phone_sendCode(thisBtn)
{

    new_phone = $(".new_phone .phone_num .new_phone_num").val();
    $.ajax({
        xhrFields: {
            withCredentials: true
        },
        data: {
            newAccount : new_phone,
            password : password,
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
                        password : password,
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
            password : password,
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
                        password : password,
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

//个人中心绑定手机号
function bind_phone(){
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
        password = $(".new_phone .pwd .group input").val();
        //console.log(password);
        $.ajax({
            xhrFields: {
                withCredentials: true
            },
            data: {
                password:password
            },
            type: 'POST',
            url: URL_BASE + '/users/web/user/current/checkPassword',
            success: function (data) {
                if(data == false){
                    my_tip.alert('密码错误，请重新输入。');
                    return;
                }

                $(".phone_num").css('display','block');
                $(".new_phone .pwd").css('display','none');

                $(".new_phone_num").blur(function(){
                    new_phone = $(".new_phone .phone_num .new_phone_num").val();
                    var reg = /^1(3|4|5|7|8)\d{9}$/;
                    //console.log(new_phone);
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



            },
            error: ajax_error_handler
        });
    });
}

//个人中心绑定邮箱
function bind_email(){
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
        password = $(".new_mail .pwd .group .ipt").val();

        //console.log(password);
        $.ajax({
            xhrFields: {
                withCredentials: true
            },
            data: {
                password:password
            },
            type: 'POST',
            url: URL_BASE + '/users/web/user/current/checkPassword',
            success: function (data) {
                if(data == false){
                    my_tip.alert('密码错误，请重新输入。');
                    return;
                }

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

            },
            error: ajax_error_handler
        });
    });
}


//获取省市区三联
function get_province(){
    var province = [];
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
                $("#select_school").empty();

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
                $("#select_school").empty();

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

            get_school($("#select_district").val());

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
