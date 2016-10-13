/**
 * Created by yilong on 2016/10/12.
 */

function left_bar_cb() {
    $('#tasks_button').attr('class', 'side-button-selected left-side-button');
}

$(".book .sort .read").click(function(){
    $(".book .sort .read").addClass("index");
    $(".book .sort .reading").removeClass("index");
    $(".list").hover(
        function(){
            $(this).find(".list-book .remove ").css({"display":"block"});
        },
        function(){
            $(this).find(".list-book .remove ").css({"display":"none"});
        }
    )
});
$(".book .sort .reading").click(function(){
    $(".book .sort .reading").addClass("index");
    $(".book .sort .read").removeClass("index");
    $(".list").off("mouseenter mouseleave");
});

