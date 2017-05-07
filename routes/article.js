var express = require('express');
var router = express.Router();

// 文章详情
router.get('/', function(req, res, next) {
    res.render('article', {});
});

// 写文章
router.get('/newarticle', function(req, res, next) {
    if (req.session.userID) {
        res.render('newArticle', { 
            isLogin: true,
            userID: req.session.userID,
            avatar: req.session.avatar,
        });
    } else {
        res.render('newArticle', { 
            isLogin: false,
            userID: 0,
            avatar: '',
        });
    };
});

module.exports = router;