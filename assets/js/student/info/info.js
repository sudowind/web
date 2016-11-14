/**
 * Created by yilong on 2016/10/13.
 */
function Change() {
    document.getElementById("boy").disabled = false;
    document.getElementById("girl").disabled = false;
    $(".laydate").css("display","inline");
    $(".mail").css("display","inline");
    $(".btn").css("display","inline");
    $(".code").css("display","block");
    $(".change-info").css("display","none");
    $(".off").css("display","inline");
    $(".sure").css("display","inline");
}
function Sure(){
    document.getElementById("boy").disabled = true;
    document.getElementById("girl").disabled = true;
    $(".laydate").css("display","none");
    $(".mail").css("display","none");
    $(".btn").css("display","none");
    $(".code").css("display","none");
    $(".change-info").css("display","block");
    $(".off").css("display","none");
    $(".sure").css("display","none");
}
function Back(){
    document.getElementById("boy").disabled = true;
    document.getElementById("girl").disabled = true;
    $(".laydate").css("display","none");
    $(".mail").css("display","none");
    $(".btn").css("display","none");
    $(".code").css("display","none");
    $(".change-info").css("display","block");
    $(".off").css("display","none");
    $(".sure").css("display","none");
}
//$(function(){
//    var ChImg = $("#change-head").val();
//    //$("#head").attr("src","ChImg");
//    console.log(ChImg);
//    //console.log(ChImg.substring(12));
//    $.ajax({
//        xhrFields: {
//            withCredentials: true
//        },
//        type: 'PUT',
//        url: 'http://debian8-01.internal.enjoyreading.com:8082/users/web/user/current/headimg',
//        data: {
//            img: ChImg
//        },
//        success: function(data) {
//            alert(1);
//        },
//        error:function(data){
//            alert(2)
//        }
//    });
//})




;(function(window,document){
    var myUpload = function(option) {
        var file,
            fd = new FormData(),
            xhr = new XMLHttpRequest(),
            loaded, tot, per, uploadUrl,input;

        input = document.createElement("input");
        input.setAttribute('id',"myUpload-input");
        input.setAttribute('type',"file");
        input.setAttribute('name',"files");

        input.click();

        uploadUrl = option.uploadUrl;
        callback = option.callback;
        uploading = option.uploading;
        beforeSend = option.beforeSend;

        input.onchange= function(){
            file = input.files[0];
            if(beforeSend instanceof Function){
                if(beforeSend(file) === false){
                    return false;
                }
            }

            fd.append("files", file);

            xhr.onreadystatechange = function() {
                if (xhr.readyState == 4 && xhr.status == 200) {
                    if(callback instanceof Function){
                        callback(xhr.responseText);
                    }
                }
            }

            //侦查当前附件上传情况
            xhr.upload.onprogress = function(evt) {
                loaded = evt.loaded;
                tot = evt.total;
                per = Math.floor(100 * loaded / tot); //已经上传的百分比
                if(uploading instanceof Function){
                    uploading(per);
                }
            };

            xhr.open("post", uploadUrl);
            xhr.send(fd);
        }
    };

    window.myUpload = myUpload;
})(window,document);

function upload(labelID,fileID){
    var ol = document.getElementById(labelID);
    var of = document.getElementById(fileID);
    var res = false;
    try{
        if(FormData!=undefined && FormData!=null){
            res = true;
        }
    }
    catch(e){}
    if(res==true){
        ol.onclick = function(e){
            console.log(this);
            console.log(e);
            //用法
            //触发文件上传事件
            myUpload({
                //上传文件接收地址
                uploadUrl: "/users/web/user/current/headimg",
                //选择文件后，发送文件前自定义事件
                //file为上传的文件信息，可在此处做文件检测、初始化进度条等动作
                beforeSend: function(file) {
                    console.log("begin upload");
                },
                //文件上传完成后回调函数
                //res为文件上传信息
                callback: function(res) {
                    console.log(res);
                },
                //返回上传过程中包括上传进度的相关信息
                //详细请看res,可在此加入进度条相关代码
                uploading: function(res) {
                    console.log(res);
                }
            });
        }
    }
    //else{
        //ol.setAttribute("for",fileID);
        //if(oiframe.attachEvent){
        //    oiframe.attachEvent('onload', function(){
        //        var responseData = oiframe.contentWindow.document.body.innerHTML;
        //        console.log(responseData);
        //        console.log('ie iframe onload');
        //    });
        //}
        //else{
        //    oiframe.onload = function(){
        //        var responseData = this.contentDocument.body.textContent || this.contentWindow.document.body.textContent;
        //        console.log(responseData);
        //        console.log("arived");
        //    };
        //}
        //of.onchange = function(){document.getElementsByTagName("form")[0].submit();}
    //}
}

