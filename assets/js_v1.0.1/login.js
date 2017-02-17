/**
 * Created by wind on 2017/1/6.
 */

/* 探测浏览器种类 */
// function whichTransitionEvent(){
//     var t;
//     var el = document.createElement('fakeelement');
//     var transitions = {
//         'transition':'transitionend',
//         'OTransition':'oTransitionEnd',
//         'MozTransition':'transitionend',
//         'WebkitTransition':'webkitTransitionEnd'
//     };
//
//     for(t in transitions){
//         if( el.style[t] !== undefined ){
//             return transitions[t];
//         }
//     }
// }
//
// /* 监听变换事件! */
// var transitionEvent = whichTransitionEvent();
// var e = document.getElementById('school_master');
// transitionEvent && e.addEventListener(transitionEvent, function() {
//     console.log('Transition complete!  This is the callback, no library needed!');
//     $('.rotate-div').each(function() {
//         if ($(this).attr('state') !== '6') {
//             // console.log($(this).attr('class'));
//             $(this).removeClass('tmp-rotate-6');
//         }
//     });
//     var obj = $('.rotate-6');
//     obj.removeClass('rotate-6').addClass('tmp-rotate-6');
//
//     if ($._data($('.rotate-div')[0], 'events') == undefined) {
//
//     }
//
// });

var tip_modal_color;
var int;

function start_snowing() {
    $('.rotate-div').css('left', ($(window).get(0).innerWidth - 300) / 2);

    $('#snowCanvas').attr("width", $(window).get(0).innerWidth).attr("height", $(window).get(0).innerHeight);
//            $('#snowCanvas').css('width', screen.availWidth).css('height', screen.availHeight);

    $('#page_footer').load('../include/html/footer.html', function() {
        $('.qrcode').attr('src', '../assets/img/qrcode.png');
        $('.footer').css('marginTop', '0').css('width', '100%');
    });
    /* --- config start --- */

    var snowCanvasId        = "snowCanvas", // id of the canvas to use
        framerate           = 40,           // which fps rate to use, this is not followed exactly
        flakeNumberModifier = 0.1,          // change this to change the number of flakes
        fallSpeedModifier   = 0.5;          // falling speed

    /* ---- config end ---- */

    var canvas       = document.getElementById(snowCanvasId),
        context      = canvas.getContext("2d"),
        width        = canvas.width,
        height       = canvas.height,
        numFlakes    = Math.min(width, 3000) * height / 400 * flakeNumberModifier,
        flakes       = [],
        TWO_PI       = Math.PI * 2,
        radHeight    = 40,
        flake        = document.createElement("CANVAS"),
        flakeContext = flake.getContext("2d");

    //console.log(width);
    //console.log(height);

    // create flake grafic
    flake.width = 8;
    flake.height = 8;
    flakeContext.fillStyle = "#fff";
    flakeContext.beginPath();
    flakeContext.arc(4, 4, 4, 0, TWO_PI);
    flakeContext.fill();

    // init snowflakes
    for(var x = 0; x <numFlakes; x++) {
        flakes[x] = getRandomFlake(true);
    }

    // start tick at specified fps
    int = window.setInterval(tick, Math.floor(1000 / framerate));

    // main routine
    function tick() {
        var posX = 0,
            imageData;

        // reset canvas for next frame
        context.clearRect(0, 0, width, height);

        for(var x = 0; x < numFlakes; x++) {
            // calculate changes to snowflake
            posX = flakes[x].x +  Math.sin(flakes[x].yMod + flakes[x].y / radHeight * (5 - flakes[x].size)) * flakes[x].waveSize * (1 - flakes[x].size);
            flakes[x].y += flakes[x].size * fallSpeedModifier; // bigger flakes are nearer to screen, thus they fall faster to create 3d effect

            // if snowflake is out of bounds, reset
            if(flakes[x].y > height + 5) {
                flakes[x] = getRandomFlake();
            }

            // draw snowflake
            context.globalAlpha = (flakes[x].size - 1) / 3;
            context.drawImage(flake, posX, flakes[x].y, flakes[x].size, flakes[x].size);
        }

        // repeat 3000px wide strip with snowflakes to fill whole canvas
        if(width > 3000) {
            context.globalAlpha = 1;
            context.drawImage(canvas, 3000, 0);
            if(width > 600) context.drawImage(canvas, 600, 0);
            if(width > 1200) context.drawImage(canvas, 1200, 0);
            if(width > 2400) context.drawImage(canvas, 2400, 0);
        }
    }

    // randomize flake data
    function getRandomFlake(init) {
        return {
            x: range(10, 3100),
            y: init ? range(-5, height + 5) : -5,
            size: Math.max(range(1, 6), 1),
            yMod: range(0, 150),
            waveSize: range(1, 8)
        };
    }

    // get a random number inside a range
    function range(start, end) {
        return Math.random() * (end - start) + start;
    }
}

window.onload = function() {
    start_snowing();

    $('#login_button').click(function () {
        login();
    })
};

function login() {
    var account = $('#account').val();
    var password = $('#password').val();
    // var user_type = $('.main-button').attr('value');
    // user_type = 5;

    if (!account || !password) {
        my_tip.alert('请填写用户名和密码！', {'color': tip_modal_color});
        return;
    }
    $.ajax({
        type: 'POST',
        url: URL_BASE + '/users/open/login',
        xhrFields: {
            withCredentials: true
        },
        data: {
            account: account,
            password: password,
            userType: user_type
        },
        success: function (data) {
            console.log(data.success);
            if (data.success) {
                console.log(user_type);
                // alert(data.loginCount);
                switch (user_type) {
                    case 2:
                        if (data.loginCount == 0)
                            // window.open('../../../v1.0.1/student/home/first.html', '_self');
                            window.open('../../../v1.0.1/student/home/home.html', '_self');
                        else
                            window.open('../../../v1.0.1/student/home/home.html', '_self');
                        break;
                    case 3:
                        if (data.loginCount == 0)
                            window.open('../../../v1.0.1/teacher/library/library.html', '_self');
                        else
                            window.open('../../../v1.0.1/teacher/library/library.html', '_self');
                        break;
                    case 4:
                        window.open('../../../v1.0.1/school_master/library/library.html', '_self');
                        break;
                }
                setCookie('USER', data.userId);
                //判断是否记住密码,设置cookie
                if($('#remember_password').is(':checked')){
                    setCookie('username', $('#account').val().trim(),7);
                    setCookie('userpassword', $('#password').val().trim(),7);
                    setCookie('usertype',data.userType,7);
                }else{
                    delCookie('username');
                    delCookie('usertype');
                    delCookie('userpassword');
                }
            }
            else {
                my_tip.alert(data.message, {'color': tip_modal_color});
            }
        }
    });
}

$(window).resize(resizeCanvas);
function resizeCanvas() {
    var canvas = $('#snowCanvas');

    canvas.attr("width", $(window).get(0).innerWidth);
    canvas.attr("height", $(window).get(0).innerHeight);
//            context.fillRect(0, 0, canvas.width(),canvas.height());
    $('.rotate-div').css('left', ($(window).get(0).innerWidth - 300) / 2);
    $('body').css('padding-top', ($(window).get(0).innerHeight - 400) / 2);
    window.clearInterval(int);
    start_snowing();
}
// resizeCanvas();

var r = 300;
var user_type;

var pos = [
    {
        x: 0,
        z: 0,
        'z-index': 4
    },
    {
        x: 1.732 * r / 2,
        z: -r / 2,
        'z-index': 3
    },
    {
        x: 1.732 * r / 2,
        z: -1.5 * r,
        'z-index': 2
    },
    {
        x: 0,
        z: -2 * r,
        'z-index': 1
    },
    {
        x: -1.732 * r / 2,
        z: -1.5 * r,
        'z-index': 2
    },
    {
        x: -1.732 * r / 2,
        z: -r / 2,
        'z-index': 3
    }
];
var curr_deg = [0, 60, 120, 180, 240, -60];

var v2index_r = {
    1: 5,
    2: 2,
    3: 3,
    4: 4,
    5: 6,
    6: 7
};

var v2index = {
    1: 3,
    2: 2,
    3: 5,
    4: 7,
    5: 6,
    6: 4
};

var ROTATE_TIME = 0.5;

$('.rotate-div').click(function() {
    var value = $(this).attr('value');

    if (value == 6) {

        $('.rotate-div').each(function () {
            var curr_value = Number($(this).attr('value'));
            $(this).css('z-index', v2index_r[curr_value]);

            var curr_state = Number($(this).attr('state'));
            curr_deg[curr_state - 1] += 60;
            var pos_index = (curr_deg[curr_state - 1] % 360) / 60;
            while(pos_index < 0) {
                pos_index += 6;
            }
            // if (curr_state == 1)
            //     console.log(pos[pos_index]);
            TweenMax.to($(this), ROTATE_TIME, {
                rotationY:curr_deg[curr_state - 1],
                x: pos[pos_index].x,
                z: pos[pos_index].z,
                'z-index': pos[pos_index]['z-index'],
                ease: Linear.easeNone
            });
            curr_value -= 1;
            if (curr_value < 1)
                curr_value = 6;
            if (curr_value < 4) {
                $(this).find('div').hide(500);
            }
            else {
                $(this).find('div').show(500);
            }

            $(this).attr('value', curr_value);
        })
    }
    else if (value == 5) {
        var color = $(this).css('background-color');
        tip_modal_color = color;
        $('#select_part').hide(0, function () {
            $('#login_part').show();
            $('#login_button').css('background', color);
        });
        //根据点击端口存cookie
        user_type = Number($(this).attr('type'));
        setCookie('user_type',user_type);

        //记住密码功能
        var usertype = getCookie('usertype');
        if(user_type == usertype){

            //判断cookie中是否有帐号密码
            $(function(){
                //获取cookie
                var username = getCookie('username');
                var userpassword = getCookie('userpassword');
                var usertype = getCookie('usertype');
                if(username != "" && userpassword != ""){
                    $("#account").val(username);
                    $("#password").val(userpassword);
                    $('#remember_password').attr('checked','true');
                }
            });
        }
    }
    else if (value == 4) {

        $('.rotate-div').each(function () {
            var curr_value = Number($(this).attr('value'));
            $(this).css('z-index', v2index[curr_value]);

            var curr_state = Number($(this).attr('state'));
            curr_deg[curr_state - 1] -= 60;
            var pos_index = (curr_deg[curr_state - 1] % 360) / 60;
            while(pos_index < 0) {
                pos_index += 6;
            }
            if (curr_state == 1)
                console.log('reverse');
            TweenMax.to($(this), ROTATE_TIME, {
                rotationY:curr_deg[curr_state - 1],
                x: pos[pos_index].x,
                z: pos[pos_index].z,
                'z-index': pos[pos_index]['z-index'],
                ease: Linear.easeNone
            });

            curr_value += 1;
            if (curr_value > 6)
                curr_value = 1;
            if (curr_value < 4) {
                $(this).find('div').hide(500);
            }
            else {
                $(this).find('div').show(500);
            }

            $(this).attr('value', curr_value);
        })
    }
});
//根据登录端口注册
function select_sign_in(){
    getCookie(user_type);
    switch (user_type) {
        case 2:
            window.open('../../../v1.0.1/student/sign_in.html', '_self');
            break;
        case 3:
            window.open('../../../v1.0.1/teacher/sign_in.html', '_self');
            break;
        case 4:
            window.open('../../../v1.0.1/school_master/sign_in.html', '_self');
            break;
    }
}
//忘记密码
function forget_pwd(){
    window.open('../../../v1.0.1/find_pwd.html', '_self');
}
//返回选择端口界面
function out_login(){
    window.open('../../../v1.0.1/login.html','_self');
}