/**
 * Created by yilong on 2017/1/6.
 */
//年月日下拉三联
function YYYYMMDDstart() {
    MonHead = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];

    //先给年下拉框赋内容
    var y = new Date().getFullYear();
    for (var i = (y - 67); i < (y + 1); i++) { //以今年为准
        document.reg_testdate.YYYY.options.add(new Option(i, i));
    }
    //赋月份的下拉框
    for (var i = 1; i < 13; i++){

        document.reg_testdate.MM.options.add(new Option(i , i));

    }
    document.reg_testdate.YYYY.value = y;
    document.reg_testdate.MM.value = new Date().getMonth() + 1;
    var n = MonHead[new Date().getMonth()];
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
        year = $(".date select[name = YYYY]").val(),
        month = $(".date select[name = MM]").val(),
        day = $(".date select[name = DD]").val(),
        telAuthCode = $('.note_pwd').val(),
        schoolId = $("#select_school").val();

    if(month < 10){
        month = '0' + month;
    }
    if(day < 10){
        day = '0' + day;
    }

    var birthday = year+'-'+month+'-'+day;

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
                "birthday": birthday,
                "telAuthCode": telAuthCode,
                "telAuthId": telAuthId,
                "password":password,
                "userType": userType,
                "tel":phone_num,
                "schoolId":schoolId
            }),
            success: function(data) {
                console.log(data);
                $("#main").css("display","none");
                $("#sign_in_success").css("display",'block');
                $("#sign_in_success .word .user_id").html(data.account);
                $("#sign_in_success .word p img").on('click',function(){
                    window.open('../login.html','_self');
                })
            },
            error: ajax_error_handler
        });
    }
}

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
        clock = setInterval(sign_in_doLoop, 1000); //一秒执行一次
    }
    function sign_in_doLoop()
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
            //console.log(user_type);
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