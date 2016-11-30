/**
 * Created by yilong on 2016/10/21.
 */
$(".unopen").click(function(){
    $(".section").css("display","block");
    $(".cover").css("display","block");
})
$(".section-retract").click(function(){
    $(".section").css("display","none");
    $(".cover").css("display","none");
})
$(".title img").click(function(){
    $(this).attr("src","../../../assets/img/student/tasks/label.png");
})
$(".out").on('click',function(){
    window.open('read.html?book_id=' + $.getUrlParam('book_id') + '&task_id=' + $.getUrlParam('task_id'), '_self');
})
