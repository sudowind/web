/**
 * Created by wind on 2016/11/2.
 */

function left_bar_cb() {
    $('#tasks_button').attr('class', 'side-button-selected left-side-button');
}

function init () {

    var h = Number($('.select-part').height());

    $('.book-part').css('height', (1050 - h).toString());

}

$('.option').click(function () {
    $(this).siblings().removeClass('index');
    $(this).addClass('index');
});
