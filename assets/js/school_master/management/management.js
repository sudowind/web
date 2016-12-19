
function right_bar_cb() {
    $('#teacher_management_button').attr('class', 'side-button-selected left-side-button');
}

//按照年级选择老师
//$('.content .class-name p span').click(function () {
//    $(this).siblings().removeClass('index');
//    $(this).addClass('index');
//
//});


//$(".grade .option").on('click',function(){
//    grade_teacher();
//    alert(2);
//});
//添加老师函数
$("#sure_add_teacher").click(function(){
    $(".modal").modal('hide');
    add_teacher();
});
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
            "password":password,
            "userType": "3"
        }]),
        success: function() {
            $(".teacher-information").remove();
            load_teacher();
        }
    });
}

//切分年级的函数

function init_grade() {
    var date = new Date();
    var base_year = 1900 - 6 + date.getYear();
    if (date.getMonth() >= 7) {
        base_year += 1;
    }
    var html = '<span class="option" value="{0}">{0}级</span>'.format(base_year.toString());
    for (var i = 1; i < 6; ++i) {
        html += '<span class="option" value="{0}">{0}级</span>'.format((base_year + i).toString());
    }
    html = '<span class="index option" value="1">全部</span>' + html;
    $('.class-name .grade').html(html).on('click','span',function (){
        $(this).siblings().removeClass('index');
        $(this).addClass('index');
        //grade_teacher();
        var Index = $(".grade .index").attr('value');
        //console.log(teacher_list);
        for(var i = 0; i < teacher_list.length; i++){
            console.log(teacher_list[i].classes);
            for(var j = 0; j < teacher_list[i].classes.length; j++){
                //console.log(teacher_list[i].classes[j].grade);
            }
        }

    });
}

var html = '';
var classes = '';
var classes_list = '';
var teacher_list = '';
function load_teacher(){
    $.ajax({
        xhrFields: {
            withCredentials: true
        },
        contentType: 'application/json',
        type: 'GET',
        url: URL_BASE + '/users/web/school/current/teacher/list',
        success: function(data) {
            teacher_list = data;
            //console.log(data[0].classes);
            for(var i = 0; i < data.length; i++){
                if(data[i].gender == '1'){
                    gender = '男';
                }else if(data[i].gender == '2'){
                    gender = '女';
                }
                if( data[i].classes == '' ){
                    html = fill_teacher_null(data[i]);
                    $(".information").append(html);
                }else{
                    html = fill_teacher(data[i]);
                    for(var j = 0;j < data[i].classes.length;j++){
                        //console.log(data[i].classes[j].name);
                        classes = fill_class(data[i].classes[j]);
                        //console.log(classes);
                        classes_list += classes;
                    }
                    $(".information").append(html);
                    //console.log(classes_list);
                    $(".dropdown-menu").append(classes_list);
                }


            }
            //删除老师的函数
            $(".delete").on('click',function(){
                var teacherId = this.value;
                var teacher_name = $(this).parent().children().eq(1).text();
                var text = '<p>'+'确定删除老师  '+'<span>'+ teacher_name +'</span>'+'  的个人信息么？'+'</p>';

                my_tip.bind(text, function() {
                    $.ajax({
                        xhrFields: {
                            withCredentials: true
                        },
                        type: 'POST',
                        url: URL_BASE + '/users/web/teacher/'+ teacherId + '/delete',
                        success: function() {
                            $(".teacher-information").remove();
                            load_teacher()
                        }
                    });
                });
            });
        }
    });
}


function grade_teacher(){
    var grade = $(".grade .index").attr('value');
    console.log(grade);
    //$.ajax({
    //    xhrFields: {
    //        withCredentials: true
    //    },
    //    type: 'GET',
    //    url: URL_BASE + '/users/web/school/current/grade/'+ grade + '/teacher/list',
    //    success: function(data) {
    //        console.log(data[0]);
    //        for(var i = 0; i < data.length; i++){
    //            if(data[i].gender == '1'){
    //                gender = '男';
    //            }else if(data[i].gender == '2'){
    //                gender = '女';
    //            }
    //            if( data[i].classes == '' ){
    //                html = fill_teacher_null(data[i]);
    //                $(".information").append(html);
    //            }else{
    //                html = fill_teacher(data[i]);
    //                for(var j = 0;j < data[i].classes.length;j++){
    //                    //console.log(data[i].classes[j].name);
    //                    classes = fill_class(data[i].classes[j]);
    //                    //console.log(classes);
    //                    classes_list += classes;
    //                }
    //                $(".information").append(html);
    //                //console.log(classes_list);
    //                $(".dropdown-menu").append(classes_list);
    //            }
    //        }
    //    }
    //});
}


function fill_teacher(data){
    //console.log(data.classes);
    return      '<ul class="teacher-information" value="' + data.id + '">'
                    +'<li class="account">'+ data.id+'</li>'
                    +'<li class="name">'+ data.name+'</li>'
                    +'<li class="gender">'+ gender +'</li>'
                    +'<li class="className">'
                    +'<div class="dropdown">'
                    +'<button class="btn btn-default dropdown-toggle" type="button" id="dropdownMenu1" data-toggle="dropdown">' + data.classes[0].name + '<span class="caret"></span></button>'
                    +'<ul class="dropdown-menu" role="menu" aria-labelledby="dropdownMenu1"></ul>'
                    +'</div>'
                    +'</li>'
                    +'<li id="del" class="delete" value="' + data.id + '">删除</li>'
                    +'</ul>'
}

function fill_teacher_null(data){
    //console.log(data.classes);
    return      '<ul class="teacher-information" value="' + data.id + '">'
        +'<li class="account">'+ data.id+'</li>'
        +'<li class="name">'+ data.name+'</li>'
        +'<li class="gender">'+ gender +'</li>'
        +'<li class="className">'
        +'<div class="dropdown">'
        +'<button class="btn btn-default dropdown-toggle" type="button" id="dropdownMenu1" data-toggle="dropdown">' + ' 无分配班级 '+ '</button>'
        +'</div>'
        +'</li>'
        +'<li id="del" class="delete" value="' + data.id + '">删除</li>'
        +'</ul>'
}

function fill_class(list){
    return  '<li role="presentation"><a role="menuitem" tabindex="-1" href="#">'+ list.name +'</a></li>'
}

























