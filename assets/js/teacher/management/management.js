/**
 * Created by yilong on 2016/10/26.
 */
function right_bar_cb() {
    $('#management_button').attr('class', 'side-button-selected left-side-button');
}

$("#check").click(function(){
    $(".del").css("display","none");
    $(".form-add-student").css("display","none");
    $(".form-change-pwd").css("display","block");
    $(".modal-body").css({
        width:"620",
        height:"460",
        top:"-110px",
        left:"0px"
    });
});
$(".add-task").click(function(){
    $(".del").css("display","none");
    $(".form-add-student").css("display","block");
    $(".form-change-pwd").css("display","none");
    $(".modal-body").css({
        width:"620",
        height:"460",
        top:"-110px",
        left:"0px"
    })
});
$("#del").click(function(){
    $(".modal-body").css({
        width:"490",
        height:"190",
        top:"-40px",
        left:"90px"
    });
    $(".del").css("display","block");
    $(".form-add-student").css("display","none");
    $(".form-change-pwd").css("display","none");
});


$(".content .class-name p span").click(function(){
    $(this).siblings().attr("class","");
    $(this).attr("class","index");
});

//加载学生信息
function load_student_info(){
    $.ajax({
        xhrFields: {
            withCredentials: true
        },
        type: 'GET',
        url: URL_BASE + '/users/web/user/current',
        success: function(data) {
            console.log(data);
            $(".account").html(data.id);
            $(".name").html(data.name);


        }
    });
};

function fill_student(){
    return    '<ul class="student-information">'
                    +'<li class="account"></li>'
                    +'<li class="name"></li>'
                    +'<li class="gender"></li>'
                    +'<li class="time"></li>'
                    +'<li class="state"></li>'
                    +'<li id="check" data-toggle="modal" data-target="#myModal">查看</li>'
                    +'<li id="del" data-toggle="modal" data-target="#myModal">删除</li>'
                '</ul>'
}



























