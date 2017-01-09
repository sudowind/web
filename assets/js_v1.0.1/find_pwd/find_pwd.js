/**
 * Created by yilong on 2017/1/7.
 */
$(".btn").on("click",function(){
    $(".ipt_id").css('display','none');
    $(".test_info").css('display','block');
    $(".two img").attr('src','../../assets/img/css_v1.0.1/find_two_select.png');
    $(".two_font").addClass('blue');
});
$(".phone_send").on('click',function(){
    $(".test_info").css('display','none');
    $(".three img").attr('src','../../assets/img/css_v1.0.1/find_three_select.png');
    $(".three_font").addClass('blue');
});