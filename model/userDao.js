/*  
 *  user 表 的 CRUD 模块
 */
var mysql = require('mysql');
var config = require('./config');

// 封装一些常用的 sql 语句
var sql = {
    insert:'insert into user(user, password, nickname) values(?,?,?)',
	delete: 'delete from user where id=?',
	updatePass:'update user set password=? where id=?',
	queryById: 'select * from user where id=?',
	queryAll: 'select * from user',
    queryByUser: 'select * from user where user=?'
};

var pool = mysql.createPool(config);

module.exports = {
    queryById: function(req, res, cb) {
        pool.getConnection(function(err, connection) {
            var id = req.query.id;
            connection.query(sql.queryById, id, function(err, rows) {
                cb && cb(rows);
                connection.release();
            });
        });
    },
    queryAll: function(req, res, cb) {
        pool.getConnection(function(err, connection) {
            connection.query(sql.queryAll, function(err, rows) {
                cb && cb(rows);
                connection.release();
            });
        });
    },
    queryByUser: function(req, res, cb) {
        pool.getConnection(function(err, connection) {
            var user = req.query.user || req.body.user;
            connection.query(sql.queryByUser, user, function(err, rows) {
                cb && cb(rows);
                connection.release();
            });
        });
    },
    addUser: function(req, res, cb) {
        pool.getConnection(function(err, connection) {
            var user = req.body.user;
            var pwd = req.body.password;
            connection.query(sql.insert, [user, pwd, user], function(err, rows) {
                cb && cb(rows);
                connection.release();
            });
        });
    }
};