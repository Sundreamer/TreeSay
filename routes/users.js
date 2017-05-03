var express = require('express');
var crypto = require('crypto');
var router = express.Router();
var userDao = require('../model/userDao');

// 密码加密
function hashPw(user, pwd) {
    var hash = crypto.createHash('md5');
    hash.update(user + pwd);
    return hash.digest('hex');
}

/* 获取用户个人主页 */
router.get('/', function(req, res, next) {
    res.render('user', {});
});

// 注册
router.post('/register', function(req, res, next) {
    req.body.password = hashPw(req.body.user, req.body.password);
    userDao.addUser(req, res, function(result) {
        result.affectedRows > 0 ? res.json({result: true}) : res.json({result: false});
    });
});

// 登录
router.post('/login', function(req, res, next) {
    var pwd = hashPw(req.body.user, req.body.password);
    userDao.queryByUser(req, res, function(result) {
        if (result[0].password === pwd) {
            req.session.user = req.body.user;
            res.json({result: true});
        } else {
            res.json({result: false});
        }
    });
});

module.exports = router;
