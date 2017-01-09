/**
 * Created by yilong on 2017/1/6.
 */
$('#select_year').select2({
    data: 2010,
    language: 'zh-CN'
});
$('#select_month').select2({
    data: 5,
    language: 'zh-CN'
});
$('#select_day').select2({
    data: 10,
    language: 'zh-CN'
});
$('#select_province').select2({
    data: 10,
    language: 'zh-CN'
});
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

$("#sign_in").on('click',function(){
    $("#main").css("display","none");
    $("#sign_in_success").css("display",'block');
});