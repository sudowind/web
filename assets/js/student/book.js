/**
 * Created by wind on 2016/10/10.
 */
function submit_comment() {
    // alert($('#user_comment').val());
    $('#myModal').modal('show');
    setTimeout(function(){ $('#myModal').modal('hide'); }, 1000);
};
//简介与评论之间的tab切换函数
function tab_comment(){
    $('.book-comment').css("display","none");
    $('.book-detail-content').css("display","block");
    $('.nav-button').css("background","#fb9e1d");
    $('.nav-button-two').css("background","#fff");
    $('.comments').css("color","#000000");
    $('.introduce').css("color","#ffffff");
    $('.nav-button img').attr("src","../../../assets/img/student/book/intro_selected.png");
    $('.nav-button-two img').attr("src","../../../assets/img/student/book/comment_unselected.png");

}
function tab_introduce(){
    $('.book-comment').css("display","block");
    $('.book-detail-content').css("display","none");
    $('.nav-button').css("background","#fff");
    $('.nav-button-two').css("background","#fb9e1d");
    $('.comments').css("color","#ffffff");
    $('.introduce').css("color","#000000");
    $('.nav-button img').attr("src","../../../assets/img/student/book/intro_unselected.png");
    $('.nav-button-two img').attr("src","../../../assets/img/student/book/comment_selected.png");
}
//添加书库之后确认日期的点击事件
$('.modal-footer .btn').one("click",function(){
    $("#myModal").css("display","none");
    $(".book-image .btn").html("已添加“阅读任务”");

});

















