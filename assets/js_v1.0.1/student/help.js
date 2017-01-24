/**
 * Created by yilong on 2017/1/24.
 */
//选择修改个人信息还是修改密码
$(".feedback").on('click',function(){
    $(this).addClass('index');
    $(".handbook").removeClass('index');
});
$(".handbook").on('click',function(){
    $(this).addClass('index');
    $(".feedback").removeClass('index');
});