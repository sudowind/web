$(".out").click(function(){
    $("#myModal").removeClass('modal fade in').addClass('modal fade');
    $("#myModal").css("display","none");
})

$('.content .class-name p span').click(function () {
    $(this).siblings().removeClass('index');
    $(this).addClass('index');
});