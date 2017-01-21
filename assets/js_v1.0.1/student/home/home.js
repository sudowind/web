/**
 * Created by wind on 2017/1/10.
 */
(function init() {
    var join_class = function () {
        $('#join_class_modal').find('.modal-info div:nth-child(5)').html('');
        $('#join_class_modal').modal('show');
    };

    $('.info-class').click(join_class);
    $('.no-top-list .btn').click(join_class);

    $('#send_apply').click(function () {
        var join_code = $('#class_code').val();
        console.log(join_code);
        if (join_code == '')
            return;
        var error_message = $('#join_class_modal').find('.modal-info div:nth-child(5)');
        //检查班级code是否有效
        $.ajax({
            xhrFields: {
                withCredentials: true
            },
            type: 'post',
            url: URL_BASE + '/users/web/join/checkClassJoinCode',
            data: {
                joinCode: join_code
            },
            success: function (data) {
                error_message.html('&nbsp;');
                $.ajax({
                    xhrFields: {
                        withCredentials: true
                    },
                    type: 'post',
                    url: URL_BASE + '/users/web/join/studentJoinClass',
                    data: {
                        joinCode: join_code
                    },
                    success: function (data) {
                        $('#join_class_modal').modal('hide');
                        my_tip.alert('你的加入班级申请已发送，老师审核通过后即可加入班级');
                        check_join_status();
                    },
                    error: error_handler()
                });
            },
            error: error_handler({400: function () {
                error_message.html('班级代码错误，请核对');
            }})
        });

    })

})();
