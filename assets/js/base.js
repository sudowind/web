/**
 * Created by wind on 2016/11/10.
 */
var TASK_STATUS = {
    1: 'not assigned',
    2: 'not start',
    3: 'reading',
    4: 'completed'
};

Date.prototype.getFullDate = function() {
    // 给定Date，获取日期字符串
    var year = this.getFullYear().toString();
    var month = this.getMonth().toString();
    if (month.length < 2)
        month = '0' + month;
    var day = this.getDate().toString();
    if (day.length < 2)
        day = '0' + day;
    return '{0}-{1}-{2}'.format(year, month, day);
};

function open_mail_url(mail_address) {
    // 传入邮箱，打开邮箱登录页面
    var url = '';
    if (mail_address.indexOf('gmail') >= 0) {
        url = 'http://gmail.google.com';
    }
    else {
        url = 'http://mail.' + mail_address.split('@')[1]
    }
    window.open(url);
}

String.prototype.format = function(args) {
    // string的format函数
    if (arguments.length>0) {
        var result = this;
        if (arguments.length == 1 && typeof (args) == "object") {
            for (var key in args) {
                var reg=new RegExp ("({"+key+"})","g");
                result = result.replace(reg, args[key]);
            }
        }
        else {
            for (var i = 0; i < arguments.length; i++) {
                if(arguments[i]==undefined)
                {
                    return "";
                }
                else
                {
                    var reg=new RegExp ("({["+i+"]})","g");
                    result = result.replace(reg, arguments[i]);
                }
            }
        }
        return result;
    }
    else {
        return this;
    }
};