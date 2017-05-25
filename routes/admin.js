var express = require('express');
var router = express.Router();
var userDao = require('../model/userDao');
var articleDao = require('../model/articleDao');
var commentDao = require('../model/commentDao');

// 向前台返回JSON的方法的简单封装
var jsonWrite = function (res, result) {
    // 当 sql 语句有错误时，返回的结果就是 undefined
	if(typeof result === 'undefined') {
		res.json({
			success: false,
			msg: '操作失败'
		});
	} else {
        res.set('Access-Control-Allow-Origin', '*');
		res.json({
            success: true,
            result: result,
        });
	}
};

router.get('/', function(req, res, next) {
    res.render('admin');
});

// 获取用户数量
router.get('/getusercount', function(req, res, next) {
    userDao.queryCount(null, function(result) {
        jsonWrite(res, result[0]);
    });
});

// 获取一页的用户数据（100条）
router.get('/getuser/:pageID', function(req, res, next) {
    var pageID = req.params.pageID,
        start = pageID * 100,
        end = start + 99;

    userDao.queryByRange([start, end], function(result) {
        jsonWrite(res, result);
    });
});

// 删除用户
router.get('/deluser/:userID', function(req, res, next) {
    var userID = req.params.userID;

    userDao.delUser(userID, function(result) {
        result.affectedRows > 0 ? jsonWrite(res, true) : jsonWrite(res, false);
    });
});

// 获取文章数量
router.get('/getartcount', function(req, res, next) {
    articleDao.queryCount(null, function(result) {
        jsonWrite(res, result[0]);
    });
});

// 获取一页的文章数据（100条）
router.get('/getart/:pageID', function(req, res, next) {
    var pageID = req.params.pageID,
        start = pageID * 100,
        end = start + 99;

    articleDao.queryByRange([start, end], function(result) {
        result.forEach((val, index) => { delete val.content; });
        jsonWrite(res, result);
    });
});

// 删除文章
router.get('/delarticle/:articleID', function(req, res, next) {
    var articleID = req.params.articleID;

    articleDao.delArticle(articleID, function(result) {
        result.affectedRows > 0 ? jsonWrite(res, true) : jsonWrite(res, false);
    });
});

// 获取评论数量
router.get('/getcommcount', function(req, res, next) {
    commentDao.queryCount(null, function(result) {
        jsonWrite(res, result[0]);
    });
});

// 获取一页的评论数据（100条）
router.get('/getcomment/:pageID', function(req, res, next) {
    var pageID = req.params.pageID,
        start = pageID * 100,
        end = start + 99;
    
    commentDao.queryByRange([start, end], function(result) {
        jsonWrite(res, result);
    });
});

// 删除评论
router.get('/delcomment/:commentID', function(req, res, next) {
    var commentID = req.params.commentID;

    commentDao.delComment(commentID, function(result) {
        result.affectedRows > 0 ? jsonWrite(res, true) : jsonWrite(res, false);
    });
});

module.exports = router;