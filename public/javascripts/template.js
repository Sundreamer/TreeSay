/**
 * 简单模板模式
 */

var Template = {

    // 去除模板字符串标签之间的换行与空格
    delSpace: function(str) {
        return str.replace(/(>\n\s+<){1}/g, '><').replace(/^\s+|\s+$/, '');
    },

    // 格式化字符串
    formatString: function(str, data) {
        return str.replace(/\{#\s*(\w+)\s*#\}/g, function(match, key) {
            return typeof data[key] === 'undefined' ? '' : data[key];
        });
    },

    // 模板生成器 - 带简单模板库
    view: function() {
        var v = {
            code: '<pre><code>{#code#}</code></pre>',
            img: '<img src="{#src#}" alt="{#alt#}" />',
        };
        if (Object.prototype.toString.call(name) === "[object Array]") {
            var tpl = '';
            for (var i = 0, len = name.length; i < len; i++) {
                tpl += arguments.callee(name[i]);
            }
            return tpl;
        } else {
            return v[name] || ('<'+ name +'>' + '{#' + name + '#}' + '</' + name + '>');
        }
    },
};