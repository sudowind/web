/**
 * Created by yilong on 2016/10/26.
 */
function right_bar_cb() {
    $('#management_button').attr('class', 'side-button-selected left-side-button');
}
//学生列表的性别以及是否修改密码的参数
var gender = '';
var passwordStatus = '';
//教师添加学生模态框
$(".add-task").on('click',function(){
    $(".form-add-student").css("display","block");
    $(".form-change-pwd").css("display","none");
});

//添加学生的事件
$("#sure_add_student").on('click',function(){
    $(".modal").modal('hide');
    add_student($("#className").val());
});

function add_student(classId){
    var name = $(".form-add-student p .name").val();
    if($("#boy").is(":checked")) {
        var gender = "1";
    }else if($("#girl").is(":checked")) {
        var gender = "2";
    }
    var schoolEntranceDate = $("#time").val();
    var password = "123456";

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
            console.log(data)
            var element_count = 18;
            var start_id = (page - 1) * element_count;
            var end_id = start_id + element_count;
            if (end_id > data.length) {
                end_id = data.length;
            }
            for (var i = start_id; i < end_id - start_id; ++i) {
                if(data[i].gender == '1'){
                    gender = '男';
                }else if(data[i].gender == '2'){
                    gender = '女';
                }

                if(data[i].passwordStatus == '1' || data[i].passwordStatus == '2'){
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
                    var studentId = $(".studentId").val();
                    var newPassword = $(".change-pwd").val();
                    var text = '<p>修改密码成功</p>';
                    $.ajax({
                        xhrFields: {
                            withCredentials: true
                        },
                        type: 'PUT',
                        url: URL_BASE + '/users/web/student/' + studentId + '/password?newPassword=' + newPassword +  '',
                        success: function() {
                            $(".form-change-pwd").css("display","none");
                            //$('.modal').modal('hide');
                            my_tip.bind(text, function() {

                            });


                        }
                    });
                })

            });
        },
        error: ajax_error_handler
    });
};
var Color = '';
var red = '';
var modal_string = '';
function fill_student(data){
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
                +'</ul>'
}

//获取老师所带班级
function load_classname(){
    var html = '';
    var add_className_html = '';
    var add_className_num = 0;

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
            //添加学生模态框的班级选项
            for(var i = 0;i < data.length; i++){
                add_className_html += '<option value="'+ data[i].id +'">'+ data[i].name +'</option>'
            }
            $("#className").append(add_className_html);
            load_student_info(class_id, 1);
        }
    });
}
var num = 0;
function fill_classname(data){
    num++;
    return    '<span value="'+ data.id +'">'+ data.name + '</span>';
}