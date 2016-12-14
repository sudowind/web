
function right_bar_cb() {
    $('#teacher_management_button').attr('class', 'side-button-selected left-side-button');
}

$('.content .class-name p span').click(function () {
    $(this).siblings().removeClass('index');
    $(this).addClass('index');
});


//添加老师函数
function add_teacher(){
    var name = $(".add-teacher p .name").val();
    if($("#boy").is(":checked")) {
        var gender = "1";
    }else if($("#girl").is(":checked")) {
        var gender = "2";
    }
    var password = "123456";

    $.ajax({
        xhrFields: {
            withCredentials: true
        },
        contentType: 'application/json',
        type: 'POST',
        url: URL_BASE + '/users/web/school/current/teacher',
        data: JSON.stringify([{
            "gender": gender,
            "name":name,
            //"info":{
            //    "schoolEntranceDate":schoolEntranceDate
            //},
            "password":password,
            "userType": "3"
        }]),
        success: function() {
            $(".student-information").remove();
            load_student_info($(".class-name .index").attr('value'), 1);
        }
    });
}





//切分年级的函数
init_grade();
function init_grade() {
    var date = new Date();
    var base_year = 1900 - 6 + date.getYear();
    if (date.getMonth() >= 7) {
        base_year += 1;
    }
    var html = '<span class="index option" value="{0}">{0}级</span>'.format(base_year.toString());
    for (var i = 1; i < 6; ++i) {
        html += '<span class="option" value="{0}">{0}级</span>'.format((base_year + i).toString());
    }
    $('.class-name .grade').html(html).on('click','span',function (){
        $(this).siblings().removeClass('index');
        $(this).addClass('index');
    });
}
