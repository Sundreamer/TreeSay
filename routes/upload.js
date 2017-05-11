var express = require('express');
var formidable = require('formidable');
var fs = require('fs');
var router = express.Router();
var userDao = require('../model/userDao');

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

router.post('/avatar', function(req, res, next) {
    if (!req.session.userID) return;
    var form = new formidable.IncomingForm();       // 创建上传表单
    form.encoding = 'utf-8';
    form.uploadDir = 'public/images/avatar';        // 设置上传图片临时保存目录
    form.keepExtensions = true;                     // 保留文件后缀
    form.maxFieldsSize = 3 * 1024 * 1024;           // 文件大小，单位（字节）

    form.parse(req, function(err, fields, files) {
        if (err) {
            jsonWrite(res, err);
            return;
        }

        // 检测上传的文件类型并设置后缀名
        var extName = '';  
        switch (files.avatar.type) {
            case 'image/pjpeg':
            case 'image/jpeg':
                extName = '.jpg';
                break;
            case 'image/png':
            case 'image/x-png':
                extName = '.png';
                break;
        }
        if(extName.length === 0){
            jsonWrite(res, '只支持png和jpg格式图片');
            return;
        }

        // 生成图片文件名
        var avatarName = '/' + Date.now() + extName;
        // 图片存储地址
        var newPath = form.uploadDir + avatarName;
        // 前台显示地址(也是数据库存储的地址)
        var showUrl = '/images/avatar' + avatarName;
        // 文件重命名（因为路径没变，跟临时存储目录一致）
        fs.renameSync(files.avatar.path, newPath);
        // 把新头像的地址存储到数据库
        userDao.upAvatar([showUrl, req.session.userID], function(result) {
            // 更新会话中存储的头像地址
            req.session.avatar = showUrl;
            result.affectedRows > 0 ? jsonWrite(res, {url: showUrl}) : jsonWrite(res, false);
        });
    });
});

module.exports = router;