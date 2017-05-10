/**
 * 观察者模式
 */
var Observer = (function() {
    var messages = {};

    return {
        // 注册消息
        add: function(type, fn) {
            if (typeof messages[type] === 'undefined') {
                messages[type] = [fn];
            } else {
                messages[type].push(fn);
            }
        },
        // 发布消息
        emit: function(type) {
            if(!messages[type]) return;
            var args = Array.prototype.slice.call(arguments, 1);

            for (var i = 0, len = messages[type].length; i < len; i++) {
                messages[type][i].apply(this, args);
            }
        },
        // 移除消息
        remove: function(type, fn) {
            if (!messages[type]) return;
            for (var i = messages[type].length - 1; i >= 0; i--) {
                messages[type][i] === fn && messages[type][i].splice(i, 1);
            }
        },
    };
});