/**
 * Created by wind on 2017/1/20.
 *
 * 所有message相关的api
 */

var MessageHandler = function () {
    this.log = function(data) {
        console.log(data);
    };

    this._reference_type = {
        ClassTransfer: {
            title: '转让班级提醒',
            img: '../../../assets/img/v1.0.1/message/transfer.png'
            // 跳转到班级管理
        },
        NewJoinClassRequest: {
            title: '审核学生',
            img: '../../../assets/img/v1.0.1/message/pending.png'
            // 跳转到班级管理
        },
        ClassAuthenticate: {
            title: '被认证',
            img: '../../../assets/img/v1.0.1/message/certification.png'
            // 不跳转
        },
        JoinClassRequestGranted: {
            title: '加入班级审核结果',
            img: '../../../assets/img/v1.0.1/message/join.png'
            // 不跳转
        },
        JoinClassRequestRejected: {
            title: '加入班级审核结果',
            img: '../../../assets/img/v1.0.1/message/join.png'
            // 不跳转
        }
    };

    this.rend = function (data) {
        var content = data.messageBody.baseBody;
        var items = data.messageBody.items;
        for (var i = 0; i < items.length; ++i) {
            content = content.replace('{{' + Number(1 + i) +'}}', '<span style="color={0}">{1}</span>'.format(items[i].color, items[i].value));
        }
        var date = new Date(data.createTime);
        var date_str = date.getFullDate();
        var unread = ' unread';
        if (data.checked)
            unread = '';
        // console.log(content);

        var content_html = '';
        if (['ClassTransfer', 'NewJoinClassRequest'].indexOf(data.referenceType) >= 0) {
            // 需要跳转到班级管理页面，老师端
            content_html = '<p style="cursor: pointer" class="cont" onclick="window.open(\'../management/management.html?class_id={1}\', \'_self\');">{0}</p>'.format(content, data.reference.classId);
        }
        else {
            content_html = '<p class="cont">{0}</p>'.format(content);
        }

        return '<div class="list{0}" value="{1}">'.format(unread, data.id) +
            '<p class="head-img">' +
            '<img src="{0}" alt=""/>'.format(this._reference_type[data.referenceType].img) +
            '</p>' +
            '<div class="right-content">' +
            '<p class="tit">{0}</p>'.format(this._reference_type[data.referenceType].title) +
            '<p class="time">{0}</p>'.format(date_str) +
            content_html +
            '</div>' +
            '</div>';
    }
};

var message = new MessageHandler();

