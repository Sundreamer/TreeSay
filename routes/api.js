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

// 密码加密
function hashPw(user, pwd) {
    var hash = crypto.createHash('md5');
    hash.update(user + pwd);
    return hash.digest('hex');
}

/**
 * 简单接口： 只从一张表里获取信息
 */

// 通过用户 ID 获取用户信息（唯一，密码字段不返回）
router.get('/getuserbyid/:userID', function(req, res, next) {
    var id = req.params.userID;

    userDao.queryById(id, function(result) {
        delete result[0].password;
        jsonWrite(res, result[0]);
    });
});

// 通过用户名获取用户信息（唯一，密码字段不返回）
router.get('/getuserbyuser/:username', function(req, res, next) {
    var username = req.params.username;

    userDao.queryByUser(username, function(result) {
        delete result[0].password;
        jsonWrite(res, result[0]);
    });
});

// 注册（昵称默认与用户名相同，注册成功后，将用户 id 和 头像存入会话）
router.post('/register', function(req, res, next) {
    var user = req.body.user,
        pwd = hashPw(req.body.user, req.body.password),
        nickname = req.body.user;
    
    userDao.addUser([user, pwd, nickname], function(result) {
        if (result.affectedRows > 0) {
            jsonWrite(res, true);
        } else {
            jsonWrite(res, false);
        }
    });
});

// 登录（登录成功后，将用户 id 和 头像存入会话）
router.post('/login', function(req, res, next) {
    var user = req.body.user,
        pwd = hashPw(req.body.user, req.body.password);
    
    userDao.queryByUser([user, pwd], function(result) {
        if (result.length > 0) {
            req.session.userID = result[0].id;
            req.session.avatar = result[0].avatar;
            jsonWrite(res, true);
        } else {
            jsonWrite(res, false);
        }
    });
});

// 修改密码（需要存在会话）
router.post('/modifypwd', function(req, res, next) {
    if (req.session.userID) {
        var userID = req.body.userId,
            pwd = hashPw(req.body.user, req.body.password);

        userDao.modPass([userID, pwd], function(result) {
            result.affectedRows > 0 ? jsonWrite(res, true) : jsonWrite(res, false);
        });
    }
});

// 添加新文章 - (需要存在会话)
router.post('/addarticle', function(req, res, next) {  
    if (req.session.userID) {
        var userID = req.session.userID,
            title = req.body.title,
            abstract = req.body.abstract,
            content = req.body.content,
            cover = req.body.cover || '/images/article.jpg';
        
        articleDao.addArticle([userID, title, abstract, content, cover], function(result) {
            result.affectedRows > 0 ? jsonWrite(res, true) : jsonWrite(res, false);
        });
    }
});

// 删除文章 - （需要存在会话）
router.get('/delarticle', function(req, res, next) {
    if (req.session.userID) {
        var articleID = req.query.articleID,
            userID = req.session.userID;

        articleDao.delArticle(articleID, function(result) {
            result.affectedRows > 0 ? jsonWrite(res, true) : jsonWrite(res, false);
        });
    }
});

// 通过文章 ID 获取文章信息(唯一)
router.get('/getarticlebyid/:articleID', function(req, res, next) {
    var articleID = req.params['articleID'];

    articleDao.queryById(articleID, function(result) {
        jsonWrite(res, result[0]);
    });
});

// 通过用户 ID 获取该用户的所有文章
router.get('/getarticlebyuser/:userID', function(req, res, next) {
    var userID = req.params['userID'];

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

// 更新文章的点赞数量
router.get('/uparticlecount/:articleID', function(req, res, next) {
    var articleID = req.params.articleID;

    articleDao.updateCount(articleID, function(result) {
        jsonWrite(res, true);        // 不管数据库操作结果如何，都返回true
    });
});

// 通过文章 ID 获取该文章的所有评论
router.get('/getcommbyartid/:articleID', function(req, res, next) {
    var articleID = res.params.articleID;

    commentDao.queryByArt(articleID, function(result) {
        jsonWrite(result);
    });
});

// 通过评论 ID 获取该评论下的评论
router.get('/getcommbytarget/:targetID', function(req, res, next) {
    var targetID = req.params.targetID;

    commentDao.queryByTarget(targetID, function(result) {
        jsonWrite(result);
    });
});

// 获取首页文章列表信息 - 每次获取 12 条数据
router.get('/getindexart/:pageID', function(req, res, next) {
    var pageID = req.params.pageID,
        start = 12 * pageID,
        end = start + 11;

    articleDao.queryByRange([start, end], function(result) {
        jsonWrite(res, result);
    });
});

/**
 * 综合接口: 一次返回两种及两张表以上的信息
 * 适用场景：当要获取的信息分别存储在多个表中时，可以通过此接口只发送一次请求来获取所有的信息
 * 同时可以避免书写一个过于复杂的 sql 语句
 */ 

// 通过用户 id 获取用户主页所需信息（用户信息，用户文章信息）
router.get('/userpage/:userID', function(req, res, next) {
    var userID = req.params.userID,
        data = {};
    
    var promise = new Promise((resolve, reject) => {
        userDao.queryById(userID, (result) => {
            delete result[0].password;
            data.user = result[0];
            resolve();
        });
    });
    promise.then(() => {
        articleDao.queryByUser(userID, (result) => {
            for (var i = 0, len = result.length; i < len; i++) {
                delete result[i].content;
            }
            data.article = result;
            jsonWrite(res, data);
        });
    });
});

// 通过文章 id 获取文章详情页信息（作者信息，文章信息，评论信息）
router.get('/artpage/:articleID', function(req, res, next) {
    var artID = req.params.articleID,
        data = {};

    var promise = new Promise((resolve, reject) => {
        articleDao.queryById(artID, (result) => {
            data.article = result[0];
            resolve(result[0]['user_id']);
        });
    });
    promise.then((userID) => {
        userDao.queryById(userID, (result) => {
            delete result[0].password;
            data.user = result[0];
        });
    }).then(() => {
        commentDao.queryByArt(artID, (result) => {
            data.comment = result;
            jsonWrite(res, data);
        });
    });
});

// 添加新评论 - 评论表添加新的数据，更新文章表的评论数
router.post('/addcomment', function(req, res, next) {
    var userID = req.session.userID,
        articleID = req.body.articleID,
        targetID = req.body.targetID || null,
        content = req.body.content;

    commentDao.addComment([userID, articleID, targetID, content], function(result) {
        // 添加新评论成功后，返回评论者的信息
        userDao.queryById(userID, function(result) {
            delete result[0].password;
            jsonWrite(res, result[0]);
        });
    });
    articleDao.updateComm(articleID);
});

module.exports = router;