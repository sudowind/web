/**
 * Created by yilong on 2016/10/26.
 */
$("#check").click(function(){
    $(".del").css("display","none");
    $(".form-add-student").css("display","none");
    $(".form-change-pwd").css("display","block");
    $(".modal-body").css({
        width:"620",
        height:"460",
        top:"-110px",
        left:"0px"
    });
});
$(".add-task").click(function(){
    $(".del").css("display","none");
    $(".form-add-student").css("display","block");
    $(".form-change-pwd").css("display","none");
    $(".modal-body").css({
        width:"620",
        height:"460",
        top:"-110px",
        left:"0px"
    })
});
$("#del").click(function(){
    $(".modal-body").css({
        width:"490",
        height:"190",
        top:"-40px",
        left:"90px"
    });
    $(".del").css("display","block");
    $(".form-add-student").css("display","none");
    $(".form-change-pwd").css("display","none");
});


$(".content .class-name p span").click(function(){
    $(this).siblings().attr("class","");
    $(this).attr("class","index");
});