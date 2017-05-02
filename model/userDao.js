/*  
 *  user 表 的 CRUD 模块
 */
var mysql = require('mysql');
var config = require('./config');

// 封装一些常用的 sql 语句
var sql = {
    insert:'INSERT INTO user(id, name, age) VALUES(0,?,?)',
	update:'update user set name=?, age=? where id=?',
	delete: 'delete from user where id=?',
	queryById: 'select * from user where id=?',
	queryAll: 'select * from user'
};

// 向前台返回JSON方法的简单封装
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

var pool = mysql.createPool(config);

module.exports = {
    queryById: function(req, res, next) {
        pool.getConnection(function(err, connection) {
            var id = req.query.id;
            connection.query(sql.queryById, id, function(err, rows, fields) {
                jsonWrite(res, rows);
                connection.release();
            });
        });
    },
    queryAll: function(req, res, next) {
        pool.getConnection(function(err, connection) {
            connection.query(sql.queryAll, function(err, rows, fields) {
                jsonWrite(res, rows);
                connection.release();
            });
        });
    }
};