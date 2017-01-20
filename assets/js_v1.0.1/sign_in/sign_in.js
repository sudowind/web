/**
 * Created by yilong on 2017/1/6.
 */

//年月日下拉三联
function YYYYMMDDstart() {
    MonHead = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];

    //先给年下拉框赋内容
    var y = new Date().getFullYear();
    //var years = [];
    for (var i = (y - 17); i < (y + 1); i++){ //以今年为准，前30年，后30年
        document.reg_testdate.YYYY.options.add(new Option(" " + i + " ", i));
        //years.push({
        //    id: i,
        //    text: i
        //})
    }
    //$('#select_year').select2({
    //    data: years,
    //    language: 'zh-CN'
    //});
    //赋月份的下拉框
    for (var i = 1; i < 13; i++)
        document.reg_testdate.MM.options.add(new Option(" " + i + " ", i));

    document.reg_testdate.YYYY.value = y;
    document.reg_testdate.MM.value = new Date().getMonth() + 1;
    var n = MonHead[new Date().getMonth()];
    if (new Date().getMonth() ==1 && IsPinYear(YYYYvalue)) n++;
    writeDay(n); //赋日期下拉框Author:meizz
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
    for (var i=1; i<(n+1); i++)
        e.options.add(new Option(" "+ i + " ", i));
}
function IsPinYear(year)//判断是否闰平年
{     return(0 == year%4 && (year%100 !=0 || year%400 == 0));}
function optionsClear(e)
{
    e.options.length = 1;
}



//获取省市区三联
var province = [];
var city = [];
var district = [];

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
                //console.log(data[i].id);
                province.push({
                    id: data[i].id,
                    text:data[i].regionName
                });
            }
            $('#select_province').select2({
                data: province,
                language: 'zh-CN'
            });
            $("#select_province option").html()
            $("#select2-select_province-container")

        },
        error: ajax_error_handler
    });
}
function get_city(parentId){
    $.ajax({
        xhrFields: {
            withCredentials: true
        },
        type: 'GET',
        url: URL_BASE + '/users/open/region/'+ parentId +'/subRegions',
        //data: {
        //    parentId:parentId
        //},
        success: function(data) {
            console.log(data);
        },
        error: ajax_error_handler
    });
}
function get_district(){
    $.ajax({
        xhrFields: {
            withCredentials: true
        },
        type: 'GET',
        url: URL_BASE + '/users/open/region/topRegions',
        //data: {
        //    tel:tel
        //},
        success: function(data) {
            console.log(data);
        },
        error: ajax_error_handler
    });
}



$('#select_city').select2({
    data: 10,
    language: 'zh-CN'
});
$('#select_district').select2({
    data: 10,
    language: 'zh-CN'
});
$('#select_school').select2({
    data: 10,
    language: 'zh-CN'
});

//$("#sign_in").on('click',function(){
//    $("#main").css("display","none");
//    $("#sign_in_success").css("display",'block');
//});

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
    //console.log($("#select2-select_province-container").html());
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
        telAuthCode = $('.note_pwd').val();

    //console.log(year+'-'+ month+ '-'+ day);
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
                "birthday": year+'-'+ month+ '-'+ day,
                "telAuthCode": telAuthCode,
                "telAuthId": telAuthId,
                "password":password,
                "userType": userType,
                "tel":phone_num
            }),
            success: function(data) {
                console.log(data);
                $("#main").css("display","none");
                $("#sign_in_success").css("display",'block');
                //if(data.gender == 1 ){
                //    $("#boy").attr("checked","checked");
                //}else if(data.gender == 2 ){
                //    $("#girl").attr("checked","");
                //}
            },
            error: ajax_error_handler
        });
    }
}




