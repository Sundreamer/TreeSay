window.onload = function() {
    // 登录
    var loginBtn = document.querySelector('#login');
    loginBtn.onclick = function() {
        var data = {
            user: document.querySelectorAll('.loginbox input')[0].value,
            password: document.querySelectorAll('.loginbox input')[1].value
        }
        var xhr = new XMLHttpRequest();
        xhr.onreadystatechange = function() {
            if (xhr.readyState === 4) {
                if (xhr.status === 200) {
                    var data = JSON.parse(xhr.responseText);
                    data.result ? alert('登录成功') : alert('登录失败');
                }
            }
        };
        xhr.open('post', 'http://127.0.0.1:3000/users/login', true);
        xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
        xhr.send(convert(data));
    };

    // 注册
    var regBtn = document.querySelector('#reg');
    regBtn.onclick = function() {
        var data = {
            user: document.querySelectorAll('.regbox input')[0].value,
            password: document.querySelectorAll('.regbox input')[1].value
        }
        var xhr = new XMLHttpRequest();
        xhr.onreadystatechange = function() {
            if (xhr.readyState === 4) {
                if (xhr.status === 200) {
                    var data = JSON.parse(xhr.responseText);
                    data.result ? alert('注册成功') : alert('注册失败');
                }
            }
        };
        xhr.open('post', 'http://127.0.0.1:3000/users/register', true);
        xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
        xhr.send(convert(data));
    };

    // 处理 post 数据
    function convert(data) {
		var result = '';
		if(typeof data === 'object') {
			for (var key in data) {
				result += encodeURIComponent(key) + '=' + encodeURIComponent(data[key]) + '&';
			}
			return result.slice(0, -1);
		}
		return data;
	}

    // tab 选项卡
    var tabs = document.querySelectorAll('.tab li');
    var cons = document.querySelectorAll('.user>div');
    tabs.forEach(function(element, index) {
        element.onclick = function(e) {
            var other = index === 0 ? 1 : 0;
            this.classList.add('active');
            cons[index].classList.add('active');
            tabs[other].classList.remove('active');
            cons[other].classList.remove('active');
        }
    });
}