var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
    if (req.session.userID) {
        res.render('index', { 
            title: 'TreeSay（树说） - 点滴生活',
            isLogin: true,
            userID: req.session.userID,
            avatar: req.session.avatar,
        });
    } else {
        res.render('index', { 
            title: 'TreeSay（树说） - 点滴生活',
            isLogin: false,
            userID: 0,
            avatar: '',
        });
    }   
});

module.exports = router;
