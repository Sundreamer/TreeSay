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
        result[0] && delete result[0].password;
        jsonWrite(res, result[0]);
    });
});

// 通过用户 ID 获取用户所有喜欢的文章
router.get('/getlikebyid', function(req, res, next) {
    var userID = req.session.userID;

    userDao.queryAllLike(userID, function(result) {
        jsonWrite(res, result);
    });
});

// 通过用户名获取用户信息（用于在注册时检测用户名是否已被注册）
router.get('/isreg/:username', function(req, res, next) {
    var username = req.params.username;

    userDao.queryByUser(username, function(result) {
        result[0] ? jsonWrite(res, false) : jsonWrite(res, true);
    });
});

// 注册（昵称默认与用户名相同，注册成功后，将用户 id 和 头像存入会话）
router.post('/register', function(req, res, next) {
    var user = req.body.user,
        pwd = hashPw(req.body.user, req.body.password),
        nickname = req.body.user;
    
    userDao.addUser([user, pwd, nickname], function(result) {
        result.affectedRows > 0 ? jsonWrite(res, true) : jsonWrite(res, false);
    });
});

// 登录（登录成功后，将用户 id 和 头像存入会话）
router.post('/login', function(req, res, next) {
    var user = req.body.user,
        pwd = hashPw(req.body.user, req.body.password);
    
    userDao.queryByUP([user, pwd], function(result) {
        if (result.length > 0) {
            req.session.userID = result[0].id;
            req.session.avatar = result[0].avatar;
            jsonWrite(res, true);
        } else {
            jsonWrite(res, false);
        }
    });
});

// 退出登录（清除会话）
router.get('/quit', function(req, res, next) {
    req.session.userID = null;
    req.session.avatar = null;
    res.redirect('/');
});

// 修改密码（需要存在会话）
router.post('/modifypwd', function(req, res, next) {
    if (req.session.userID) {
        var userID = req.body.userId,
            pwd = hashPw(req.body.user, req.body.password);

        userDao.modPass([userID, pwd], function(result) {
            result.affectedRows > 0 ? jsonWrite(res, true) : jsonWrite(res, false);
        });
    } else {
        jsonWrite(res, undefined);
    }
});

// 用户更新个人信息时，先把当前信息返回给客户端（需要存在会话）
router.get('/upuserinfo', function(req, res, next) {
    if (req.session.userID) {
        var userID = req.session.userID;

        userDao.queryById(userID, function(result) {
            result[0] && delete result[0].password;
            jsonWrite(res, result[0]);
        });
    } else {
        jsonWrite(res, undefined);
    }
});
// 用户更新个人信息（需要存在会话）
router.post('/upuserinfo', function(req, res, next) {
    if (req.session.userID) {
        var userID = req.session.userID,
            nickname = req.body.nickname,
            signature = req.body.signature;

        userDao.upUserInfo([nickname, signature, userID], function(result) {
            result.affectedRows > 0 ? jsonWrite(res, true) : jsonWrite(res, false);
        });
    } else {
        jsonWrite(res, undefined);
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
    } else {
        jsonWrite(res, undefined);
    }
});

// 删除文章 - （需要存在会话）
router.get('/delarticle/:articleID', function(req, res, next) {
    if (req.session.userID) {
        var articleID = req.params.articleID;

        articleDao.delArticle(articleID, function(result) {
            result.affectedRows > 0 ? jsonWrite(res, true) : jsonWrite(res, false);
        });
    } else {
        jsonWrite(res, undefined);
    }
});

// 通过文章 ID 获取文章信息(唯一)
router.get('/getarticlebyid/:articleID', function(req, res, next) {
    var articleID = req.params.articleID;

    articleDao.queryById(articleID, function(result) {
        jsonWrite(res, result[0]);
    });
});

// 通过用户 ID 获取该用户的所有文章
router.get('/getarticlebyuser/:userID', function(req, res, next) {
    var userID = req.params.userID;

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

// 查询用户是否喜欢了该文章
router.get('/getislike/:articleID', function(req, res, next) {
    // 如果用户没有登录，直接返回 false
    if (req.session.userID) {
        var articleID = req.params.articleID,
            userID = req.session.userID;

        userDao.queryisLike([userID, articleID], function(result) {
            result[0].count > 0 ? jsonWrite(res, true) : jsonWrite(res, false);
        });
    } else {
        jsonWrite(res, undefined);
    }
});

// 更新文章的喜欢数量
router.post('/upartcount/:articleID', function(req, res, next) {
    var articleID = req.params.articleID,
        userID = req.session.userID,
        count = req.body.count,
        isLike = count > 0 ? 'insertLike' : 'delLike';

    articleDao.updateCount([count, articleID]);
    userDao[isLike]([userID, articleID], function(result) {
        jsonWrite(res, true);
    });
});

// 通过文章 ID 获取该文章的所有评论
router.get('/getcommbyartid/:articleID', function(req, res, next) {
    var articleID = res.params.articleID;

    commentDao.queryByArt(articleID, function(result) {
        jsonWrite(res, result);
    });
});

// 通过评论 ID 获取该评论下的评论
router.get('/getcommbytarget/:targetID', function(req, res, next) {
    var targetID = req.params.targetID;

    commentDao.queryByTarget(targetID, function(result) {
        jsonWrite(res, result);
    });
});

// 更新评论的点赞数量
router.post('/upcommlike/:commentID', function(req, res, next) {
    var commentID = req.params.commentID,
        count = req.body.count;
    
    commentDao.updateLike([count, commentID]);
    jsonWrite(res, true);
});

// 通过用户 ID 获取该用户发表的所有评论 - （需要会话）
router.get('/getcommbyuser/:userID', function(req, res, next) {
    if (req.session.userID) {
        var userID = req.session.userID;

        commentDao.queryByUser(userID, function(result) {
            jsonWrite(res, result);
        });
    } else {
        jsonWrite(res, undefined);
    }
});

// 获取首页文章列表信息 - 每次获取 24 条数据
router.get('/getindexart/:pageID', function(req, res, next) {
    var pageID = req.params.pageID,
        start = pageID * 12,
        end = start + 23;

    articleDao.queryByRange([start, end], function(result) {
        result.forEach((val, index) => { delete val.content; });
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
            result[0] && delete result[0].password;
            data.user = result[0];
            resolve();
        });
    });
    promise.then(() => {
        articleDao.queryByUser(userID, (result) => {
            result.forEach((val, index) => { delete val.content; });
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
            resolve();
        });
    });
    promise.then(() => {
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
        // 更新文章的评论数
        articleDao.updateComm(articleID);
    });
});

module.exports = router;