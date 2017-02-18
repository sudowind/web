/**
 * Created by yilong on 2017/2/17.
 */


var curr_page = 1;
var total_page = 0;//总页数
var max_page = 0;   // 已读到的页面

$('.up').click(function () {
    curr_page -= 1;
    if (curr_page == 0)
        curr_page = 1;
    load_pdf_page(curr_page);
});

$('.down').click(function () {
    curr_page += 1;
    if (curr_page > total_page)
        curr_page = total_page;
    load_pdf_page(curr_page);
});

function load_task_info() {
    var task_id = $.getUrlParam('task_id');
    if (task_id != null) {
        $.ajax({
            xhrFields: {
                withCredentials: true
            },
            type: 'GET',
            url: URL_BASE + '/tasks/web/task/' + task_id,
            success: function(data) {
                 //console.log(data)
                // do some thing
                max_page = data.currentPage;
                if (max_page == 0)
                    max_page = 1;
                curr_page = max_page;
                load_pdf_page(max_page);
            },
            error: error_handler()
        });
    }else{
        $(".save").css('display','none');
    }
}

//读取pdf
function load_pdf_page(page) {
    //console.log(page)
    $.ajax({
        xhrFields: {
            withCredentials: true
        },
        type: 'get',
        url: URL_BASE + '/books/web/book/{0}/content'.format($.getUrlParam('book_id')),
        data: {
            page: page
        },
        success: function (data) {
            $('iframe').attr('src', '{0}#toolbar=0&navpanes=0&scrollbar=0'.format(data.url));
            total_page = data.totalPage;
        }
    })
}


//保存pdf阅读进度
function record() {
    //console.log(curr_page+' | '+ max_page);
    if (curr_page <= max_page) {
        my_tip.alert('当前页页码需大于上次保存页码');
        return;
    }
    var end_time = new Date();
    end_time.setMinutes(end_time.getMinutes() - 1);
    end_time.setSeconds(0);
    $.ajax({
        async: false,
        xhrFields: {
            withCredentials: true
        },
        type: 'post',
        url: URL_BASE + '/tasks/web/task/student/current/' + $.getUrlParam('task_id') + '/record',
        contentType: 'application/json',
        data: JSON.stringify({
            "createTime": 0,
            "currentPage": Number(curr_page),
            "endTime": end_time.setMilliseconds(0),
            "id": 0,
            "onlineStatus": "1",
            "startTime": start_time.setMilliseconds(0),
            "taskId": 0
        }),
        success: function (data) {
            //console.log(data)
            $('.title img').attr("src","../../../assets/img/student/tasks/label.png");
            var progress = curr_page / total_page;
            $('.progress-bar').css('width', '{0}%'.format(Math.ceil(progress * 100)));
            $('.ratio span').html(Math.ceil(progress * 100));
            my_tip.alert('阅读进度保存成功');
        },
        error: error_handler()
    })
}