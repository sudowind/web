/**
 * Created by wind on 2016/11/4.
 */

function left_bar_cb() {
    $('#class_management_button').attr('class', 'side-button-selected left-side-button');
}

$('.select-grade .option').click(function () {
    $(this).siblings().removeClass('index');
    $(this).addClass('index');
});

$('.select-class .option').hover(
    function(){
        $(this).find('img').css({"display":"block"});
    },
    function(){
        $(this).find('img').css({"display":"none"});
    }
);

$('.select-class img').click(function() {
    my_tip.alert($(this).parent().text());
});

$('.grade-option').click(function () {
    $('.grade-option').css('background', '#ffffff').css('color', '#000000');
    $(this).css('background', '#fb9e1d').css('color', '#ffffff');
});

$('.class-option').click(function () {
    $('.class-option').css('background', '#ffffff').css('color', '#000000');
    $(this).css('background', '#fb9e1d').css('color', '#ffffff');
});

$('#class_input').click(function () {
    $('.class-option').css('background', '#ffffff').css('color', '#000000');
});

$('#create_class_button').click(function () {
    $('#create_class_button').hide();
    $('#create_class_box').show();
});