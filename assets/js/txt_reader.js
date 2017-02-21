/**
 * Created by wind on 2017/1/12.
 */
(function ($) {
    $.fn.init_reader = function (options) {
        options = options || {};

        var obj = $(this);

        var current_para = 0;

        var height = obj.height();
        var width = obj.width();
        obj.html('');

        var save_button = '';

        if ($.getUrlParam('task_id')) {
            save_button = '<div class="btn save-progress">保存</div>'
        }

        var tool_bar = '<div class="tool_bar"><span class="chapter-title"></span>' +
            save_button +
            '<div class="btn change-option" data-container="body" data-toggle="popover" data-placement="bottom"' +
            ' data-content="" data-html="true">A</div>' +
            '</div><hr/><div class="select-pop"><div class="color-panel color-yellow"></div></div>';

        var content = '<div class="reader-wrapper"><div class="reader-content">{0}</div><div class="slide-menu"></div></div><div class="right-tool-bar"><div class="right-button menu-button">目录</div></div>'.format(options.data);

        obj.append(tool_bar);
        obj.append(content);

        var pop_content =
           '<div>' +
               '&nbsp;<span class="option-small" onclick="set_attr(\'font-size\', this);">A</span>&nbsp;&nbsp;&nbsp;&nbsp;' +
               '<span class="option-medium" onclick="set_attr(\'font-size\', this);">A</span>&nbsp;&nbsp;&nbsp;&nbsp;' +
               '<span class="option-large" onclick="set_attr(\'font-size\', this);">A</span><hr>' +
           '<div class="color-panel color-grey" onclick="set_attr(\'background\', this);"></div>' +
           '<div class="color-panel color-green" onclick="set_attr(\'background\', this);"></div>' +
           '<div class="color-panel color-yellow" onclick="set_attr(\'background\', this);"></div>' +
           '</div>';
        $('.change-option').attr('data-content', pop_content);
        $('[data-toggle=popover]').popover();

        $('.reader-content').click(function () {
            $('[data-toggle=popover]').popover('hide');
            // $('.color-choose-div').hide();
        }).scroll(function () {

        }).mouseup(function (e) {
            e = e || window.event;
            var left = e.clientX;
            var top = e.clientY;

            // console.log(left);
            // console.log(top);

            var select_text;
            var select_obj;
            if(document.selection){ //IE浏览器下
                select_text = document.selection.createRange().text;//返回选中的文字
                select_obj = document.selection.createRange();
            }
            else{  //非IE浏览器下
                select_text = window.getSelection().toString();//返回选中的文字
                select_obj = window.getSelection();
            }

            if (select_text.length > 0){}
                // $('.select-pop').css('top', top).css('left', left).css('display', 'block');
            else
                $('.select-pop').css('display', 'none');

            // console.log(select_obj);
        });

        var start_time = new Date();

        $('.save-progress').click(function () {
            // console.log(current_para);
            var obj = $('.reader-content');
            var scroll_top = obj.scrollTop();
            var elem = obj.find('p');
            var count = 0;
            for (var i in elem) {
                count += 1;
                var top = $(elem[i]).position().top;
                if (top >= 44) {
                    // console.log($(elem[i]).attr('start'));
                    // console.log(top);
                    // console.log(scroll_top);
                    var end_time = new Date();
                    $.ajax({
                        xhrFields: {
                            withCredentials: true
                        },
                        type: 'POST',
                        url: URL_BASE + '/tasks/web/task/student/current/' + $.getUrlParam('task_id') + '/record',
                        contentType: 'application/json',
                        data: JSON.stringify({
                            "createTime": 0,
                            "currentPage": $(elem[i]).attr('start'),
                            "endTime": end_time.getTime(),
                            "id": 0,
                            "onlineStatus": "1",
                            "startTime": start_time.getTime(),
                            "taskId": 0
                        }),
                        success: function () {
                            // my_tip.alert('haha');
                            load_progress();
                            my_tip.alert('记录成功！');
                        },
                        error: error_handler({400: function(){
                            my_tip.alert('保存进度不能小于当前已读进度！');
                        }})
                    });
                    break;
                }
            }
        });

        $('.menu-button').click(function () {
            var right = $('.slide-menu').css('right');
            // console.log(right);
            if (right == '0px') {
                $('.slide-menu').css('right', '-603px');
            }
            else if (right == '-603px'){
                $('.slide-menu').css('right', '0px');
            }
        });

        var index = [];
        // 获取当前阅读进度
        var task_id = $.getUrlParam('task_id');
        // 获取目录内容
        $.ajax({
            url: URL_BASE + '/books/web/book/{0}/content'.format($.getUrlParam('book_id')),
            xhrFields: {
                withCredentials: true
            },
            type: 'get',
            data: {
                page: 0
            },
            success: function (data) {
                if (data.status == 'withTxt') {
                    var index_html = '';
                    for (var i in data.bookIndex) {
                        index_html += '<div value="{0}" offset="{2}" onclick="load_content({0}, {2}, \'{1}\');">{1}</div>'.format(Number(i) + 1, data.bookIndex[i].title, data.bookIndex[i].startOffset);
                        index.push({
                            title: data.bookIndex[i].title,
                            chapter: Number(i) + 1,
                            offset: data.bookIndex[i].startOffset
                        });
                    }
                    $('.slide-menu').html(index_html);
                    //首次加载，并不一定是第一页
                    if (!task_id) {
                        load_content(index[0].chapter, index[0].offset, index[0].title);
                    }
                    else {
                        $('.progress').show();
                        $('.progress-message').show();
                        $.ajax({
                            xhrFields: {
                                withCredentials: true
                            },
                            type: 'GET',
                            url: URL_BASE + '/tasks/web/task/' + task_id,

                            success: function (data) {
                                var curr_page = data.currentPage;
                                var total_page = data.totalPage;
                                TOTAL_PAGE = total_page;
                                var percent = Math.round(curr_page * 100.0 / total_page);
                                $('.progress-bar').css('width', percent.toString() + '%');
                                $('.progress-message').find('span').html(percent);

                                for (var i = 0; i < index.length - 1; ++i) {
                                    if (curr_page >= index[i].offset && curr_page < index[i + 1].offset) {

                                        load_content(index[i].chapter, index[i].offset, index[i].title, curr_page);
                                    }
                                }
                            },
                            error: error_handler()
                        });
                    }
                }
            }
        });


        // if (task_id) {
        //
        // }

        // $('.reader-content').append('<p>123</p>');

        // $('.color-choose-div').click(function (e) {
        //     e = e || window.event;
        //     console.log(e);
        //     var ctx = document.getElementById('color_canvas').getContext('2d');
        //     var c = ctx.getImageData(e.clientX, e.clientY, 480, 480).data;
        //     console.log(c);
        // });

        // 如果有存在的阅读进度，跳转到这个位置，大致是这样的写法
        // $('.reader-content').scrollTop($('.reader-content p:nth-child(18)').position().top-44);

        // if (options.remote_url) {
        //     load_txt(options.remote_url);
        //     // $('.reader-content').load(options.remote_url);
        // }

        return this;
    };
})(jQuery);

var TOTAL_PAGE = 0;

function set_attr(attr, e) {
    var size = $(e).css(attr);
    $('.reader-content').css(attr, size);
    if (attr == 'background') {
        $('.txt-reader').css(attr, size);
    }
}

var st = new Date();
function finish_read() {
    var et = new Date();
    $.ajax({
        xhrFields: {
            withCredentials: true
        },
        type: 'POST',
        url: URL_BASE + '/tasks/web/task/student/current/' + $.getUrlParam('task_id') + '/record',
        contentType: 'application/json',
        data: JSON.stringify({
            "createTime": 0,
            "currentPage": TOTAL_PAGE,
            "endTime": et.getTime(),
            "id": 0,
            "onlineStatus": "1",
            "startTime": st.getTime(),
            "taskId": 0
        }),
        success: function () {
            // my_tip.alert('haha');
            load_progress();
            my_tip.alert('恭喜你已读完全书！');
        },
        error: error_handler({400: function(){
            my_tip.alert('进度已保存，请勿重复点击！');
        }})
    });
}

function load_txt(page, url, offset, current) {
    //offset是起始偏移
    // console.log(url);
    var next_page = $('.slide-menu').find('[value={0}]'.format(page + 1)).attr('onclick');
    var next_page_html = '<div style="border-top: solid 1px #3c97cf">全书已读完，点击<a style="cursor: pointer" onclick="finish_read();">确认</a>完成阅读</div>';
    if (next_page) {
        // console.log(next_page);
        next_page_html = '<div style="border-top: solid 1px #3c97cf">本章已读完，点击前往<a style="cursor: pointer" onclick="{0}">下一章</a></div>'.format(next_page);
    }
    else if (!$.getUrlParam('task_id')) {
        next_page_html = '<div style="border-top: solid 1px #3c97cf">全书已读完</div>';
    }

    $.ajax({
        // xhrFields: {
        //     withCredentials: true
        // },
        url: url,
        type: 'get',
        // contentType: 'application/x-www-form-urlencoded; charset=utf-8',
        success: function (data) {
            // console.log(data);
            data = data.replace(/\n/g, '</p><p>');
            $('.reader-content').html('<p>{0}</p>{1}'.format(data, next_page_html));
            var elem = $('.reader-content').find('p');
            var total = offset;
            var top = 0;
            for (var i in elem) {
                if ($(elem[i])) {
                    // console.log($(elem[i]).html());
                    var tmp_content = $(elem[i]).html();
                    if (tmp_content) {
                        var current_length = tmp_content.length + 1;
                        // if (tmp_content == '&nbsp;') {
                        //     current_length -= 7;
                        // }

                        $(elem[i]).attr('start', total);
                        if (current) {
                            if (total <= current && total + current_length > current) {
                                // console.log(current);
                                if (i > 0)
                                    top = $(elem[i - 1]).position().top;
                            }
                        }
                        total += current_length;
                    }
                    else {
                        break;
                    }
                }
            }
            // console.log(top);
            $('.reader-content').scrollTop(top);
        }
    });
}

function load_content(page, offset, title, current) {
    // console.log(page);
    $.ajax({
        url: URL_BASE + '/books/web/book/{0}/content'.format($.getUrlParam('book_id')),
        xhrFields: {
            withCredentials: true
        },
        type: 'get',
        data: {
            page: page
        },
        success: function (data) {
            $('.chapter-title').html(title);
            // console.log(data.url);
            if (current) {
                load_txt(page, data.url, offset, current);
            }
            else {
                load_txt(page, data.url, offset);
            }
            $('.slide-menu').css('right', '-603px');
        }
    });
}

