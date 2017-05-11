/*  
 *  user 用户表 的 CRUD 模块
 */
var mysql = require('mysql');
var config = require('./config');

// 用户表常用的 sql 语句
var sql = {
    insert:'insert into user(user, password, nickname) values(?,?,?)',
	delete: 'delete from user where id=?',
	updatePass: 'update user set password=? where id=?',
    updateInfo: 'update user set nickname=?,signature=? where id=?',
    updateAvatar: 'update user set avatar=? where id=?',
	queryById: 'select * from user where id=?',
	queryAll: 'select * from user',
    queryByUser: 'select * from user where user=?',
    queryByUP: 'select * from user where user=? and password=?',
};

var pool = mysql.createPool(config);

// 数据库操作
function crud(sql, param, cb) {
    pool.getConnection(function(err, connection) {
        connection.query(sql, param, function(err, rows) {
            cb && cb(rows);
            connection.release();
        });
    });
}

module.exports = {
    queryById: function(param, cb) {
        crud(sql.queryById, param, cb);
    },
    queryAll: function(param, cb) {
        crud(sql.queryAll, param, cb);
    },
    queryByUser: function(param, cb) {
        crud(sql.queryByUser, param, cb);
    },
    addUser: function(param, cb) {
        crud(sql.insert, param, cb);
    },
    delUser: function(param, cb) {
        crud(sql.delete, param, cb);
    },
    modPass: function(param, cb) {
        crud(sql.updatePass, param, cb);
    },
    upUserInfo: function(param, cb) {
        crud(sql.updateInfo, param, cb);
    },
    upAvatar: function(param, cb) {
        crud(sql.updateAvatar, param, cb);
    },
    queryByUP: function(param, cb) {
        crud(sql.queryByUP, param, cb);
    }
};