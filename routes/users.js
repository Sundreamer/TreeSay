var express = require('express');
var router = express.Router();

// 用户登录
router.get('/login', function(req, res, next) {
    res.render('login');
});

// 用户注册
router.get('/register', function(req, res, next) {
    res.render('register');
});

/* 获取用户个人主页 */
router.get('/:userID', function(req, res, next) {
    if (req.session.userID) {
        res.locals.isSelf = req.session.userID == req.params.userID ? true : false;
        res.render('user', {
            isLogin: true,
            userID: req.session.userID,
            avatar: req.session.avatar,
        });
    } else {
        res.locals.isSelf = false;
        res.render('user', { 
            isLogin: false,
            userID: 0,
            avatar: '',
        });
    };
});

module.exports = router;
