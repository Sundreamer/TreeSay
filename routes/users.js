var express = require('express');
var router = express.Router();

/* 获取用户个人主页 */
router.get('/', function(req, res, next) {
    res.render('user', {});
});

module.exports = router;
