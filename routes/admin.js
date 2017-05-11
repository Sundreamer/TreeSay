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
		res.json({
            success: true,
            result: result,
        });
	}
};

router.get('/', function(req, res, next) {
    res.json({result: 'adminpage'});
});

// 获取所有用户
router.get('/api/getalluser', function(req, res, next) {
    userDao.queryAll(null, function(result) {
        jsonWrite(res, result);
    });
});

// 删除用户
router.get('/deluser', function(req, res, next) {
    var userID = req.query.userID;

    userDao.delUser(userID, function(result) {
        result.affectedRows > 0 ? jsonWrite(res, true) : jsonWrite(res, false);
    });
});

// 通过评论 ID 删除评论
router.get('/delcomment', function(req, res, next) {
    var commentID = req.query.commentID;

    commentDao.delComment(commentID, function(result) {
        result.affectedRows > 0 ? jsonWrite(res, true) : jsonWrite(res, false);
    });
});

// 通过用户 ID 获取该用户发表的所有评论
router.get('/getcommbyuser', function(req, res, next) {
    var userID = req.query.userID;

    commentDao.queryByUser(userID, function(result) {
        jsonWrite(res, result);
    });
});