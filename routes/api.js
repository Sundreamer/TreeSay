var express = require('express');
var router = express.Router();
var userDao = require('../model/userDao');

// 向前台返回JSON的方法的简单封装
var jsonWrite = function (res, result) {
    // 当 sql 语句有错误时，返回的结果就是 undefined
	if(typeof result === 'undefined') {
		res.json({
			code:'1',
			msg: '操作失败'
		});
	} else {
		res.json(result);
	}
};

// 通过用户 id 获取用户信息
router.get('/getuserbyid', function(req, res, next) {
    userDao.queryById(req, res, function(result) {
        jsonWrite(res, result);
    });
});

// 通过用户名获取用户信息 - 在登录时判断用户名是否已存在
router.get('/getuserbyusername', function(req, res, next) {
    userDao.queryByUser(req, res, function(result) {
        jsonWrite(res, result);
    });
});

// 获取所有用户
router.get('getalluser', function(req, res, next) {
    userDao.queryAll(req, res, function(result) {
        jsonWrite(res, result);
    });
});

module.exports = router;