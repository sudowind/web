/**
 * Created by wind on 2017/1/18.
 */

function right_bar_cb() {
    $('#teacher_management_button').attr('class', 'side-button-selected left-side-button');
}

//添加老师函数
$("#sure_add_teacher").click(function(){
    $(".modal").modal('hide');
    add_teacher();
});
function add_teacher(){
    var name = $(".add-teacher p .name").val();
    if(name == ''){
        my_tip.alert('请填写教师姓名');
        return;
    }
    if(name.length > 4 || name.length < 2 ){
        my_tip.alert('请填写正确格式的姓名');
        return;
    }
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
            $('.information ul').remove();
            init_grade();
            $("#teacher_list_all").css("display","block");
            $("#teacher_list_class").css("display","none");
            load_teacher(1);
        }
    });
}
var has_load_page = false;
//切分年级的函数
function init_grade() {
    var date = new Date();
    var base_year = 1900 - 6 + date.getYear();
    if (date.getMonth() >= 7) {
        base_year += 1;
    }
    var gn = ['一年级', '二年级', '三年级', '四年级', '五年级', '六年级'];
    var html = '<span class="option" value="{0}">一年级</span>'.format((base_year).toString());
    for (var i = 1; i < 6; ++i) {
        html += '<span class="option" value="{0}">{1}</span>'.format((base_year + i).toString(), gn[i]);
    }
    html = '<span class="index option" value="1">全部</span>' + html + '<span class="option" value="0">未带班</span>';
    $('.class-name .grade').html(html).on('click','span',function (){
        $(this).addClass('index').siblings().removeClass('index');
        //$(this);
        $(".information ul").remove();
        has_load_page = false;
        // 全部和未带班都会进入同一个加载函数
        if($(this).attr('value') <= 1){
            $("#teacher_list_all").css("display","block");
            $("#teacher_list_class").css("display","none");
            load_teacher(1);
        }else{
            $("#teacher_list_all").css("display","none");
            $("#teacher_list_class").css("display","block");
            grade_teacher(1);
        }
    });
}



//加载教师信息
var html = '';
var classes = '';
var classes_list = '';
function load_teacher(page){
    var with_class = Number($('.index').attr('value'));
    $.ajax({
        xhrFields: {
            withCredentials: true
        },
        type: 'GET',
        url: URL_BASE + '/users/web/school/current/teacher/list',
        data: {
            isAuth: true,
            withClass: with_class
        },
        success: function(data) {
            //console.log(data);

            var flag = Number($(".grade .index").attr('value'));
            // console.log(flag);
            // if (!flag) {
            //     // 只保留没有班级的老师
            //     var tmp_data = [];
            //     for (var i = 0; i < data.length; ++i) {
            //         if (data[i].classes.length == 0) {
            //             tmp_data.push(data[i]);
            //         }
            //     }
            //     data = tmp_data;
            //     // console.log(data);
            // }

            var element_count = 18;
            var start_id = (page - 1) * element_count;
            var end_id = start_id + element_count;
            if (end_id > data.length) {
                end_id = data.length;
            }
            //console.log(start_id);
            //console.log(end_id);
            for(var i = start_id; i < end_id; ++i){
                if(data[i].gender == '1'){
                    gender = '男';
                }else if(data[i].gender == '2'){
                    gender = '女';
                }
                if(!with_class){
                    html = fill_teacher_null(data[i]);
                    $(".information").append(html);
                }else{
                    classes_list = '';
                    html = fill_teacher(data[i]);
                    $(".information").append(html);
                }
            }

            if (!has_load_page) {
                has_load_page = true;
                var page_count = Math.ceil((data.length * 1.0) / element_count);
                $('#teacher_list_all').createPage({
                    pageCount: page_count,
                    current: 1,
                    backFn: function(p) {
                        $('.information ul').remove();
                        load_teacher(p);
                    }
                });
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
                            console.log(has_load_page);
                            has_load_page = false;
                            load_teacher(1)
                        }
                    });
                });
            });
        }
    });
}

//根据年级获取老师
var userId = '';
function grade_teacher(page){
    var grade = $(".grade .index").attr('value');
    //console.log(grade);
    $.ajax({
        xhrFields: {
            withCredentials: true
        },
        type: 'GET',
        url: URL_BASE + '/users/web/school/current/grade/'+ grade + '/teacher/list',
        success: function(data) {
            var element_count = 18;
            var start_id = (page - 1) * element_count;
            var end_id = start_id + element_count;
            if (end_id > data.length) {
                end_id = data.length;
            }
            for(var i = start_id; i < end_id; i++){
                //console.log(data[i].id);
                userId = data[i].id;
                //按照对应年级获取到所有老师、再根据id获取教师信息
                $.ajax({
                    xhrFields: {
                        withCredentials: true
                    },
                    contentType: 'application/json',
                    type: 'GET',
                    url: URL_BASE + '/users/web/user/'+ userId + '',
                    success: function(data) {
                        //console.log(data.classes);
                        if(data.gender == '1'){
                            gender = '男';
                        }else if(data.gender == '2'){
                            gender = '女';
                        }
                        classes_list = '';
                        html = fill_teacher(data);
                        $(".information").append(html);


                        //根据年级删除老师的函数
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
                                        has_load_page = false;
                                        grade_teacher(1)
                                    }
                                });
                            });
                        });
                    }
                });
            }
            //分页
            if (!has_load_page) {
                has_load_page = true;
                var page_count = Math.ceil((data.length * 1.0) / element_count);
                $('#teacher_list_class').createPage({
                    pageCount: page_count,
                    current: 1,
                    backFn: function(p) {
                        $('.information ul').remove();
                        grade_teacher(p);
                    }
                });
            }
        }
    });
}

//生成教师list
function fill_teacher(data){
    //console.log(data.classes);
    classes_list = '';
    // for(var j = 0;j < data.classes.length;j++){
    //     classes = fill_class(data.classes[j]);
    //     classes_list += classes;
    // }
    //console.log(classes_list);
    return      '<ul class="teacher-information" value="' + data.id + '">'
        +'<li class="account">T'+ data.id+'</li>'
        +'<li class="name">'+ data.name+'</li>'
        +'<li class="gender">'+ gender +'</li>'
        // +'<li class="className">'
        // +'<div class="dropdown">'
        // +'<button class="btn btn-default dropdown-toggle" type="button" id="dropdownMenu1" data-toggle="dropdown">' + data.classes[0].name + '<span class="caret"></span></button>'
        // +'<ul class="dropdown-menu" role="menu" aria-labelledby="dropdownMenu1" teacher_id="'+ data.id + '">' + classes_list + '</ul>'
        // +'</div>'
        // +'</li>'
        +'<li id="del" value="' + data.id + '"></li>'
        +'</ul>'
}
//生成不带班级的教师list
function fill_teacher_null(data){
    //console.log(data.classes);
    return      '<ul class="teacher-information" value="' + data.id + '">'
        +'<li class="account">T'+ data.id+'</li>'
        +'<li class="name">'+ data.name+'</li>'
        +'<li class="gender">'+ gender +'</li>'
        // +'<li class="className">'
        // +'<div class="dropdown">'
        // +'<button class="btn btn-default dropdown-toggle" type="button" id="dropdownMenu1" data-toggle="dropdown">' + ' 无分配班级 '+ '</button>'
        // +'</div>'
        // +'</li>'
        +'<li id="del" class="delete" value="' + data.id + '"><u>删除</u></li>'
        +'</ul>'
}
//生成教师所带班级下拉菜单的li
function fill_class(list){
    //console.log(list)
    return  '<li role="presentation"><a role="menuitem" tabindex="-1" href="#">'+ list.name +'</a></li>'
}

//搜索框搜索老师事件
$(".button").on("click",function(){
    var search = $(".frame input").val();
    var hint = '<p>'+'教师姓名不能为空'+'</p>';
    if(search == ''){
        my_tip.alert(hint);
        return;
    }
    $("#teacher_list_all").css("display","none");
    $("#teacher_list_class").css("display","none");
    //$("#teacher_list_search").css("display","block");
    $('.information ul').remove();
    //var search_page = 1;
    var with_auth = Number($('.index').attr('value'));
    if (with_auth > 0) {
        with_auth = 1;
    }
    $.ajax({
        xhrFields: {
            withCredentials: true
        },
        contentType: 'application/json',
        type: 'GET',
        url: URL_BASE + '/users/web/school/current/teacher/list',
        success: function(data) {
            //console.log(data);
            //var element_count = 18;
            //var start_id = (search_page - 1) * element_count;
            //var end_id = start_id + element_count;
            //if (end_id > data.length) {
            //    end_id = data.length;
            //}
            //console.log(start_id);
            for(var i = 0; i < data.length; ++i){
                if(data[i].name.indexOf(search) !== -1){
                    if(data[i].gender == '1'){
                        gender = '男';
                    }else if(data[i].gender == '2'){
                        gender = '女';
                    }
                    if(!with_auth){
                        html = fill_teacher_null(data[i]);
                        $(".information").append(html);
                    }else{
                        classes_list = '';
                        html = fill_teacher(data[i]);
                        $(".information").append(html);
                    }
                }
            }
            $(".grade").children().removeClass();
            $(".grade").children().eq(0).addClass('index');
        }
    });
});

$(".back").on('click',function(){
    $("#myModal").modal('hide');
});















