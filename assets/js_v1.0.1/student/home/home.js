/**
 * Created by wind on 2017/1/10.
 */
$('#select_year').select2({
    data: 2010,
    language: 'zh-CN'
});
$('#select_month').select2({
    data: 5,
    language: 'zh-CN'
});
$('#select_day').select2({
    data: 10,
    language: 'zh-CN'
});
$('#select_province').select2({
    data: 10,
    language: 'zh-CN'
});
$('#select_city').select2({
    data: 10,
    language: 'zh-CN'
});
$('#select_district').select2({
    data: 10,
    language: 'zh-CN'
});
$('#select_school').select2({
    data: 10,
    language: 'zh-CN'
});
$('#select_class').select2({
    data: 10,
    language: 'zh-CN'
});

(function init() {
    var join_class = function () {
        $('#join_class_modal').modal('show');
    };

    $('.info-class').click(join_class);
    $('.no-top-list .btn').click(join_class);
})();
