/**
 * 公共的一些通用方法
 */
var common = {
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
}
