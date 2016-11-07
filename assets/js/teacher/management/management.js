/**
 * Created by yilong on 2016/10/26.
 */
$(".out").click(function(){
    $("#myModal").removeClass('modal fade in').addClass('modal fade');
    $("#myModal").css("display","none");
})

$(".content .class-name p span").click(function(){
    $(this).siblings().attr("class","");
    $(this).attr("class","index");
})