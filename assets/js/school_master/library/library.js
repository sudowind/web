/**
 * Created by yilong on 2016/11/7.
 */
$(".book .grade span").click(function(){
    $(this).siblings().attr("class","");
    $(this).attr("class","index");
})
$(".book .sort span").click(function(){
    $(this).siblings().attr("class","");
    $(this).attr("class","index");
})
$(".book .read-lv .button span").click(function(){
    $(this).siblings().attr("class","");
    $(this).attr("class","index");
})