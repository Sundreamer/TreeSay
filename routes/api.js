var express = require('express');
var crypto = require('crypto');
var router = express.Router();
var userDao = require('../model/userDao');
var articleDao = require('../model/articleDao');
var commentDao = require('../model/commentDao');

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

// 密码加密
function hashPw(user, pwd) {
    var hash = crypto.createHash('md5');
    hash.update(user + pwd);
    return hash.digest('hex');
}

// 通过用户 ID 获取用户信息
router.get('/getuserbyid', function(req, res, next) {
    var id = req.query.id;
    userDao.queryById(id, function(result) {
        jsonWrite(res, result);
    });
});

// 通过用户名获取用户信息
router.get('/getuserbyusername', function(req, res, next) {
    var username = req.query.user;

    userDao.queryByUser(username, function(result) {
        jsonWrite(res, result);
    });
});

// 获取所有用户
router.get('/getalluser', function(req, res, next) {
    userDao.queryAll(null, function(result) {
        jsonWrite(res, result);
    });
});

// 注册
router.post('/register', function(req, res, next) {
    var user = req.body.user,
        pwd = hashPw(req.body.user, req.body.password),
        nickname = req.body.user;
    
    userDao.addUser([user, pwd, nickname], function(result) {
        result.affectedRows > 0 ? res.json({result: true}) : res.json({result: false});
    });
});

// 登录
router.post('/login', function(req, res, next) {
    var user = req.body.user,
        pwd = hashPw(req.body.user, req.body.password);
    
    userDao.queryByUser([user, pwd], function(result) {
        if (result[0].password === pwd) {
            req.session.user = req.body.user;
            res.json({result: true});
        } else {
            res.json({result: false});
        }
    });
});

// 修改密码
router.post('/modifypwd', function(req, res, next) {
    var userID = req.body.userId,
        pwd = hashPw(req.body.user, req.body.password);

    userDao.modPass([userID, pwd], function(result) {
        result.affectedRows > 0 ? res.json({result: true}) : res.json({result: false});
    });
});

// 删除用户
router.get('/deluser', function(req, res, next) {
    var userID = req.query.userID;

    userDao.delUser(userID, function(result) {
        result.affectedRows > 0 ? res.json({result: true}) : res.json({result: false});
    });
});

// 添加新文章
router.post('/addarticle', function(req, res, next) {
    var userID = req.body.userID,
        title = req.body.title,
        content = req.body.content;
    
    articleDao.addArticle([userID, title, content], function(result) {
        result.affectedRows > 0 ? res.json({result: true}) : res.json({result: false});
    });
});

// 删除文章
router.get('/delarticle', function(req, res, next) {
    var articleID = req.query.articleID;

    articleDao.delArticle(articleID, function(result) {
        result.affectedRows > 0 ? res.json({result: true}) : res.json({result: false});
    });
});

// 通过文章 ID 获取文章信息
router.get('/getarticlebyid', function(req, res, next) {
    var articleID = req.query.articleID;

    articleDao.queryById(articleID, function(result) {
        jsonWrite(res, result);
    });
});

// 通过用户 ID 获取该用户的所有文章
router.get('getarticlebyuserid', function(req, res, next) {
    var userID = req.query.userID;

    articleDao.queryByUser(userID, function(result) {
        jsonWrite(res, result);
    });
});

// 获取某一范围的文章 - 按照文章发布时间降序排序（最新的文章在最前）
router.get('/getarticlebyrange', function(req, res, next) {
    var m = req.query.start,
        n = req.query.end;

    articleDao.queryByRange([m, n], function(result) {
        jsonWrite(res, result);
    });
});

// 添加新评论
router.post('/addcomment', function(req, res, next) {
    var userID = req.body.userID,
        articleID = req.body.articleID,
        targetID = req.body.targetID || null,
        content = req.body.content;

    commentDao.addComment([userID, articleID, targetID, content], function(result) {
        result.affectedRows > 0 ? res.json({result: true}) : res.json({result: false});
    });
})

// 通过评论 ID 删除评论
router.get('/delcomment', function(req, res, next) {
    var commentID = req.query.commentID;

    commentDao.delComment(commentID, function(result) {
        result.affectedRows > 0 ? res.json({result: true}) : res.json({result: false});
    });
});

// 通过文章 ID 获取该文章的所有评论
router.get('/getcommbyart', function(req, res, next) {
    var articleID = res.query.articleID;

    commentDao.queryByArt(articleID, function(result) {
        jsonWrite(result);
    });
});

// 通过用户 ID 获取该用户发表的所有评论
router.get('/getcommbyuser', function(req, res, next) {
    var userID = req.query.userID;

    commentDao.queryByUser(userID, function(result) {
        jsonWrite(result);
    });
});

// 通过评论 ID 获取该评论下的评论
router.get('/getcommbytarget', function(req, res, next) {
    var targetID = req.query.targetID;

    commentDao.queryByTarget(targetID, function(result) {
        jsonWrite(result);
    });
})

module.exports = router;