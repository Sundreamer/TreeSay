
// 公共方法
var Common =  {
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

    // 添加表情图片数据
    getFaceGif: function(ele) {
        var faces = [
            {key: ':1.gif', url: '<img src="/images/face/1.gif" alt="1.gif" />'},
            {key: ':2.gif', url: '<img src="/images/face/2.gif" alt="2.gif" />'},
            {key: ':3.gif', url: '<img src="/images/face/3.gif" alt="3.gif" />'},
            {key: ':4.gif', url: '<img src="/images/face/4.gif" alt="4.gif" />'},
            {key: ':5.gif', url: '<img src="/images/face/5.gif" alt="5.gif" />'},
            {key: ':6.gif', url: '<img src="/images/face/6.gif" alt="6.gif" />'},
            {key: ':7.gif', url: '<img src="/images/face/7.gif" alt="7.gif" />'},
            {key: ':8.gif', url: '<img src="/images/face/8.gif" alt="8.gif" />'},
            {key: ':9.gif', url: '<img src="/images/face/9.gif" alt="9.gif" />'},
            {key: ':10.gif', url: '<img src="/images/face/10.gif" alt="10.gif" />'},
            {key: ':11.gif', url: '<img src="/images/face/11.gif" alt="11.gif" />'},
            {key: ':12.gif', url: '<img src="/images/face/12.gif" alt="12.gif" />'},
            {key: ':13.gif', url: '<img src="/images/face/13.gif" alt="13.gif" />'},
            {key: ':14.gif', url: '<img src="/images/face/14.gif" alt="14.gif" />'},
            {key: ':15.gif', url: '<img src="/images/face/15.gif" alt="15.gif" />'},
            {key: ':16.gif', url: '<img src="/images/face/16.gif" alt="16.gif" />'},
            {key: ':17.gif', url: '<img src="/images/face/17.gif" alt="17.gif" />'},
            {key: ':18.gif', url: '<img src="/images/face/18.gif" alt="18.gif" />'},
            {key: ':19.gif', url: '<img src="/images/face/19.gif" alt="19.gif" />'},
            {key: ':20.gif', url: '<img src="/images/face/20.gif" alt="20.gif" />'},
            {key: ':21.gif', url: '<img src="/images/face/21.gif" alt="21.gif" />'},
            {key: ':22.gif', url: '<img src="/images/face/22.gif" alt="22.gif" />'},
            {key: ':23.gif', url: '<img src="/images/face/23.gif" alt="23.gif" />'},
            {key: ':24.gif', url: '<img src="/images/face/24.gif" alt="24.gif" />'},
            {key: ':25.gif', url: '<img src="/images/face/25.gif" alt="25.gif" />'},
            {key: ':26.gif', url: '<img src="/images/face/26.gif" alt="26.gif" />'},
            {key: ':27.gif', url: '<img src="/images/face/27.gif" alt="27.gif" />'},
            {key: ':28.gif', url: '<img src="/images/face/28.gif" alt="28.gif" />'},
            {key: ':29.gif', url: '<img src="/images/face/29.gif" alt="29.gif" />'},
            {key: ':30.gif', url: '<img src="/images/face/30.gif" alt="30.gif" />'},
            {key: ':31.gif', url: '<img src="/images/face/31.gif" alt="31.gif" />'},
            {key: ':32.gif', url: '<img src="/images/face/32.gif" alt="32.gif" />'},
        ];
        var faceList = '';
        faces.forEach(function(val, index) {
            faceList += '<li>' + val.url + '</li>';
        });
        return faceList;
    },

    // 对评论中的表情进行替换
    handleComment: function(content) {
        content = content.replace(/:(.+?):/g, function (match, k1) {
            return '<img src="/images/face/' + k1 + '"/>';
        })
        return content.replace(/<\/?\w+>/g, '').replace(/<[^img].+?>/g, '');
    },
}
