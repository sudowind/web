/**
 * Created by yilong on 2016/11/17.
 */
function right_bar_cb() {
    $('#guide_button').attr('class', 'side-button-selected right-side-button');
}

$(".list").on('click','p',function(){
    $(".list p").removeClass();
    $(this).addClass('index');
})