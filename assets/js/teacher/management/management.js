/**
 * Created by yilong on 2016/10/26.
 */
function left_bar_cb() {
    $('#management_button').attr('class', 'side-button-selected left-side-button');
}
//学生列表的性别以及是否修改密码的参数
var gender = '';
var passwordStatus = '';


var name = '';
var schoolEntranceDate = '';
//教师添加学生模态框
$(".add-task").on('click',function(){
    $(".form-add-student").css("display","block");
    $(".form-change-pwd").css("display","none");

    $(".form-add-student p .name").focus(function(){
        $(".form-add-student .point_name").css('display','none');
    });

    $(".form-add-student .time input").focus(function(){
        $(".form-add-student .point_time").css('display','none');
    });

});

//添加学生的事件
$("#sure_add_student").on('click',function(){
    name = $(".form-add-student p .name").val();
    schoolEntranceDate = $("#time").val();

    if(name == ''){
        $(".form-add-student .point_name").css('display','inline');
    }
    if(schoolEntranceDate == ''){
        $(".form-add-student .point_time").css('display','inline');
    }
    if($(".form-add-student .point_name").css('display') == 'none' && $(".form-add-student .point_time").css('display') == 'none'){
        $(".modal").modal('hide');
        add_student($(".class-name .index").attr('value'));
    }

});

function add_student(classId){
    name = $(".form-add-student p .name").val();
    if(name.length > 4 || name.length < 2 ){
        my_tip.alert('请填写正确格式的姓名');
        return;
    }
    schoolEntranceDate = $("#time").val();

    var password = "123456";

    if($("#boy").is(":checked")) {
        var gender = "1";
    }else if($("#girl").is(":checked")) {
        var gender = "2";
    }

    $.ajax({
        xhrFields: {
            withCredentials: true
        },
        contentType: 'application/json',
        type: 'POST',
        url: URL_BASE + '/users/web/class/'+ classId +'/student',
        data: JSON.stringify([{
            "gender": gender,
            "name":name,
            "info":{
                "schoolEntranceDate":schoolEntranceDate
            },
            "password":password,
            "userType": "2"
        }]),
        success: function() {
            has_load_page = false;
            $(".student-information").remove();
            load_student_info($(".class-name .index").attr('value'), 1);
        }
    });
}

//选择班级的button事件
$(".content .class-name p").on('click','span',function(){
    $(".student-information").remove();
    $(this).siblings().attr("class","");
    $(this).attr("class","index");

    has_load_page = false;
    load_student_info($(".class-name .index").attr('value'), 1);
});

var has_load_page = false;
//加载学生信息

function load_student_info(classId, page){
    var html = '';
    $.ajax({
        xhrFields: {
            withCredentials: true
        },
        type: 'GET',
        url: URL_BASE + '/users/web/class/'+ classId +'/students',
        data: {
            classId : classId
        },
        success: function(data) {
            //console.log(data);
            var element_count= 18;
            var start_id = (page - 1) * element_count;
            var end_id = start_id + element_count;
            if (end_id > data.length) {
                end_id = data.length;
            }
            //console.log(start_id);
            for (var i = start_id; i < end_id; ++i) {
                if(data[i].gender == '1'){
                    gender = '男';
                }else if(data[i].gender == '2'){
                    gender = '女';
                }
                console.log(data[i].passwordStatus);
                if(data[i].passwordStatus == '1'|| data[i].passwordStatus == '2' ){
                    passwordStatus = '正常';
                }else if(data[i].passwordStatus == '3'){
                    passwordStatus = '修改密码';
                }
                html += fill_student(data[i]);

            }
            if (!has_load_page) {
                has_load_page = true;
                var page_count = Math.ceil((data.length * 1.0) / element_count);
                $('#tasks-index').createPage({
                    pageCount: page_count,
                    current: 1,
                    backFn: function(p) {
                        load_student_info(classId, p);
                    }
                });
            }
            $('.information ul').remove();
            $(".information .head").after(html);

            //删除学生点击事件
            $(".delete").on('click',function(){
                var studentId = this.value;
                var student_name = $(this).parent().children().eq(1).text();
                var text = '<p>'+'确定删除学生  '+'<span>'+ student_name +'</span>'+'  的个人信息么？'+'</p>';

                my_tip.bind(text, function() {
                    $.ajax({
                        xhrFields: {
                            withCredentials: true
                        },
                        type: 'POST',
                        url: URL_BASE + '/users/web/student/'+ studentId + '/delete',
                        success: function() {
                            has_load_page = false;
                            $(".student-information").remove();
                            load_student_info($(".class-name .index").attr('value'), 1)
                        }
                    });
                });
            });

            //老师给学生修改密码
            $(".student-information").on('click','.red',function(){
                $(".form-add-student").css("display","none");
                $(".form-change-pwd").css("display","block");

                var studentName = $(this).parent().children().eq(1).text();
                var studentId = $(this).parent().children().eq(0).text();
                $(".studentId").html(studentId);
                $(".studentName").html(studentName);

                $("#newPassword").on('click',function(){
                    //var change_studentId = $(".studentId").val();
                    var newPassword = $(".change-pwd").val();
                    //console.log(studentId);
                    var text = '<p>修改密码成功</p>';
                    $.ajax({
                        xhrFields: {
                            withCredentials: true
                        },
                        data: {
                            newPassword:newPassword
                        },
                        type: 'PUT',
                        url: URL_BASE + '/users/web/student/' + studentId + '/password',
                        success: function() {
                            $("#myModal").modal('hide');
                            load_student_info($(".class-name .index").attr('value'), 1);
                            my_tip.bind(text, function() {

                            });

                        }
                    });
                })

            });
        },
        error: ajax_error_handler
    });
}

function fill_student(data){
    var Color = '';
    var red = '';
    var modal_string = '';
    //console.log(passwordStatus)
    if(passwordStatus =='修改密码'){
        Color = "color: red;cursor: pointer;";
        red = "red";
        modal_string =' " data-toggle="modal" data-target="#myModal";';
    }
    return      '<ul class="student-information">'
                    +'<li class="account">'+ data.id+'</li>'
                    +'<li class="name">'+ data.name+'</li>'
                    +'<li class="gender">'+ gender +'</li>'
                    +'<li class="time">'+ data.info.schoolEntranceDate+'</li>'
                    +'<li class="state ' + red + '" style="' + Color +  '" ' + modal_string + ' >'+ passwordStatus +'</li>'
                    +'<li id="del" class="delete" value="' + data.id + '">删除</li>'
                +'</ul>';
}

//获取老师所带班级
function load_classname(){
    var html = '';
    $.ajax({
        xhrFields: {
            withCredentials: true
        },
        type: 'GET',
        url: URL_BASE + '/users/web/class/teacher/current/list',
        success: function(data) {
            //创建所带班级button
            var class_id = data[0].id;
            for(var i = 0; i < data.length; i++){
                //console.log(data);
                html += fill_classname(data[i]);
            }
            $(".class-name p").append(html);
            $(".class-name p span").eq(0).addClass("index");
            load_student_info(class_id, 1);
        }
    });
}
var num = 0;
function fill_classname(data){
    num++;
    return    '<span value="'+ data.id +'">'+ data.name + '</span>';
}


//搜索框搜索学生事件
$(".button").on("click",function(){
    var text = '';
    var classId = $(".class-name p .index").attr('value');
    var search = $(".frame input").val();
    var hint = '<p>'+'学生姓名不能为空'+'</p>';
    if(search == ''){
        my_tip.alert(hint);
        return;
    }
    $.ajax({
        xhrFields: {
            withCredentials: true
        },
        contentType: 'application/json',
        type: 'GET',
        url: URL_BASE + '/users/web/class/'+ classId +'/students',
        success: function(data) {
            for(var i = 0; i < data.length; ++i){
                if(data[i].name.indexOf(search) !== -1){
                    if(data[i].gender == '1'){
                        gender = '男';
                    }else if(data[i].gender == '2'){
                        gender = '女';
                    }

                    if(data[i].passwordStatus == '1'|| data[i].passwordStatus == '2' ){
                        passwordStatus = '正常';
                    }else if(data[i].passwordStatus == '3'){
                        passwordStatus = '修改密码';
                    }

                    text += fill_student(data[i]);
                }
            }
            $('.information ul').remove();
            $(".information .head").after(text);
        }
    });
});
$(".back").on('click',function(){
    $("#myModal").modal('hide');
});