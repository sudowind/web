function left_bar_cb() {
    $('#messages_button').attr('class', 'side-button-selected left-side-button');
}


var button_class = ['teacher_task','message'];
function on_button_click(e){
    if ($(e).attr('value') == '0') {
        for (var i = 0; i < button_class.length; ++i) {
            var button = button_class[i];
            if (button != $(e).attr('class')) {
                $('.'+ button).css('color', '#000000').attr('value', '0').css('background', '#f9f9f9');
                $('.'+ button + ' img').attr('src', '../../../assets/img/student/news/' + button+ '_unselect.png');
                $('.list').css('display', 'block');
                $('.message-content').css('display','none');
            }
            else {
                $('.'+ button).css('color', '#ffffff').attr('value', '1').css('background', '#fb9e1d');
                $('.'+ button + ' img').attr('src', '../../../assets/img/student/news/' + button + '_select.png');
                $('.list').css('display', 'none');
                $('.message-content').css('display','block');

            }
        }
    }
}

$('.message-content .button').click(function () {
    window.open('../library/index.html', '_self');
});