/**
 * 策略模式 - 表单验证
 */
var Validator = (function(){
	// 验证算法 - 通过验证返回 true
	var method = {
		require: function(ele) {
			var value = ele.value.replace(/^\s*|\s*$/g, '');
			return value !== '';
		},
		repeat: function(ele) {
			return ele[0].value === ele[1].value;
		},
		email: function(ele) {
			var reg = /^[a-zA-Z0-9_-]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/;
			return reg.test(ele.value);
		},
	}

	// 添加验证算法
	var addValidMethod = function(type, fn) {
		if (method[type]) {
			return false;
		} else {
			method[type] = fn;
			return true;
		}
	}

	// 单个验证
	var validOne = function(type, ele, cb) {
		if (method[type](ele)) {
			return true
		} else {
			cb && cb();
			return false;
		}
	}

	// 验证组
	var validGroup = function() {
		var group = [];
		return {
			add: function(type, ele, cb) {
				if (typeof method[type] === 'function') {
					group.push(function() {
						if (method[type](ele)) {
							return true;
						} else {
							cb && cb();
							return false;
						}
					});
				}
			},
			emit: function() {
				for (var i = 0, len = group.length; i < len; i++) {
					if (!group[i]()) {
						return false;
					}
				}
				return true;
			},
		};
	};

	// 返回
	return {
		addValid: addValidMethod,
		validOne: validOne,
		validGroup: validGroup,
	};
})();
	
