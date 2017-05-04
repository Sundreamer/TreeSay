var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
    if (req.session.user) {
        res.render('index', { 
            title: 'TreeSay',
            isLogin: true,
            nickname: req.session.user
        });
    } else {
        res.render('index', { 
            title: 'TreeSay',
            isLogin: false,
            nickname: ''
        });
    }   
});

module.exports = router;
