/**
 * Created by wind on 2016/10/24.
 */
var TipModal = function() {};

var my_tip = new TipModal();

TipModal.prototype.alert = function (a) {
    // alert(a);
    $('#tmp_modal').load('../../../include/html/modal_base.html', function () {
        $('#modal_info').html(a);
        $('#myModal').modal('show');
    });
};

