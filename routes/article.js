var express = require('express');
var router = express.Router();


// 写文章
router.get('/newarticle', function(req, res, next) {
    if (req.session.userID) {
        res.render('newArticle', { 
            isLogin: true,
            userID: req.session.userID,
            avatar: req.session.avatar,
        });
    } else {
        res.redirect('/users/login');
    };
});

// 文章详情
router.get('/:articleID', function(req, res, next) {
    if (req.session.userID) {
        res.render('article', { 
            isLogin: true,
            userID: req.session.userID,
            avatar: req.session.avatar,
        });
    } else {
        res.render('article', { 
            isLogin: false,
            userID: 0,
            avatar: '',
        });
    };
});

module.exports = router;