/**
 * Created by wind on 2017/1/12.
 */
(function ($) {
    $.fn.init_reader = function (options) {
        options = options || {};

        var obj = $(this);

        var height = obj.height();
        var width = obj.width();
        obj.html('');

        var tool_bar = '<div class="tool_bar">' +
            '<div class="btn save-progress">书签</div>' +
            '<div class="btn change-option" data-container="body" data-toggle="popover" data-placement="bottom"' +
            ' data-content="" data-html="true">A</div>' +
            '</div>';

        var content = '<div class="reader-content"><div class="color-choose-div"><canvas id="color_canvas" width="430px" height="430px"></canvas></div></div>';

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
        });

        // $('.reader-content').append('<p>123</p>');

        // $('.color-choose-div').click(function (e) {
        //     e = e || window.event;
        //     console.log(e);
        //     var ctx = document.getElementById('color_canvas').getContext('2d');
        //     var c = ctx.getImageData(e.clientX, e.clientY, 480, 480).data;
        //     console.log(c);
        // });

        return this;
    };
})(jQuery);

function set_attr(attr, e) {
    var size = $(e).css(attr);
    $('.reader-content').css(attr, size);
}

// function choose_color() {
//     $('.color-choose-div').toggle();
// }
