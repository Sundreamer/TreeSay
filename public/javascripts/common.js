
// 公共方法
var common =  {
    // 转换数据库取出来的时间格式
    formatTime: function(time) {
        return new Date(time).toLocaleString();
    },

    // 取字符串中的数字
    getNum: function(str) {
        return parseInt(str.replace(/[^\d]/g, ''));
    },

    // 信息提示
    showTip: function(msg) {
        $('.msg-tip').text(msg).addClass('show-tip');
        setTimeout(function() {
            $('.msg-tip').removeClass('show-tip');
        }, 6000);
    },

    // 设置 cookie
    setCookie: function (cname, cvalue, exdays) {
        var d = new Date();
        d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));
        var expires = "expires=" + d.toUTCString();
        document.cookie = cname + "=" + cvalue + "; " + expires;
    },

    // 清除 cookie 设置有效期为过期时间即可
    clearCookie: function(cname) {
        setCookie(cname, '', -1);
    }
}

$(function() {
    // 用户退出
    $('#quit').click(function(e) {
        $.get('api/quit', function(data) {
            if (data.result) {
                location.href = '/';
                // common.clearCookie('skey');
            }
        });
    });
});
