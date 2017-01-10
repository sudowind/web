/**
 * Created by wind on 2016/10/24.
 */
// 使用方法：在html中定义#tmp_modal的空元素，然后调用my_tip.alert()即可

var TipModal = function() {};

var my_tip = new TipModal();

// 仅作为提示
TipModal.prototype.alert = function (a, b) {
    // alert(a);
    $('#tmp_modal').load('../../../include/html/modal_base.html', function () {
        $('#modal_info').html(a);
        $('#my_tip_modal').modal('show');
        if (b != undefined) {
            $('#modal_confirm_button').click(b);
        }
    });
};

// 可以为按钮绑定一个事件
TipModal.prototype.bind = function(a, b) {
    $('#tmp_modal').load('../../../include/html/modal_two_choice.html', function () {
        $('#modal_info').html(a);
        $('#modal_confirm_button').click(b);
        $('#my_tip_modal').modal('show');
    });
};

