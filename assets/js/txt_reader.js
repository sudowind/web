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

        var tool_bar = '<div class="tool_bar">' +
            '<div class="btn save-progress">书签</div>' +
            '<div class="btn change-option" data-container="body" data-toggle="popover" data-placement="bottom"' +
            ' data-content="" data-html="true">A</div>' +
            '</div><hr/><div class="select-pop"><div class="color-panel color-yellow"></div></div>';

        var content = '<div class="reader-content">{0}</div>'.format(options.data);

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
            // console.log($(this).scrollTop());
            // console.log($('.reader-content p:nth-child(19)').position().top);
            // var elem = $(this).find('p');
            // for (var i = 1; i < elem.length; ++i) {
            //     if ($('.reader-content p:nth-child({0})'.format(i)).position().top < 10 && $('.reader-content p:nth-child({0})'.format(i + 1)).position().top >= 10) {
            //         current_para = i + 1;
            //     }
            // }
            // if ($('.reader-content p:nth-child(1)').position().top == 44) {
            //     current_para = 1;
            // }
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
                    console.log($(elem[i]).attr('start'));
                    console.log(top);
                    console.log(scroll_top);
                    break;
                }
            }
        });

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

        if (options.remote_url) {
            console.log(options.remote_url);
            $.ajax({
                url: options.remote_url,
                type: 'get',
                contentType: 'application/x-www-form-urlencoded; charset=GBK',
                success: function (data) {

                    data = data.replace(/\n/g, '</p><p>&nbsp;</p><p>');
                    $('.reader-content').html('<p>{0}</p>'.format(data));
                    var elem = $('.reader-content').find('p');
                    var total = 0;
                    for (var i in elem) {
                        if ($(elem[i])) {
                            // console.log($(elem[i]).html());
                            var tmp_content = $(elem[i]).html();
                            var current_length = tmp_content.length;
                            if (tmp_content == '&nbsp;') {
                                current_length -= 6;
                            }

                            $(elem[i]).attr('start', total);
                            total += current_length;
                        }
                    }
                }
            });
            // $('.reader-content').load(options.remote_url);
        }

        return this;
    };
})(jQuery);

function set_attr(attr, e) {
    var size = $(e).css(attr);
    $('.reader-content').css(attr, size);
    if (attr == 'background') {
        $('.txt-reader').css(attr, size);
    }
}

// function choose_color() {
//     $('.color-choose-div').toggle();
// }
