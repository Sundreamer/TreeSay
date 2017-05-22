/*  
 *  user 用户表 的 CRUD 模块
 */
var mysql = require('mysql');
var config = require('./config');

// 用户表常用的 sql 语句（包括 like 表的增删查操作）
var sql = {
    insert:'insert into user(user, password, nickname) values(?,?,?)',
    insertLike: 'insert into likearticle(user_id, article_id) values(?,?)',
	delete: 'delete from user where id=?',
    delLike: 'delete from likearticle where user_id=? and article_id=?',
	updatePass: 'update user set password=? where id=?',
    updateInfo: 'update user set nickname=?,signature=? where id=?',
    updateAvatar: 'update user set avatar=? where id=?',
    queryCount: 'select count(*) as count from user',
	queryById: 'select * from user where id=?',
	queryByRange: 'select * from user limit ?,?',
    queryByUser: 'select * from user where user=?',
    queryByUP: 'select * from user where user=? and password=?',
    queryisLike: 'select count(*) as count from likearticle where user_id=? and article_id=?',
    queryAllLike: 'select * from likeartview where user_id=?',
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
    queryCount: function(param, cb) {
        crud(sql.queryCount, param, cb);
    },
    queryById: function(param, cb) {
        crud(sql.queryById, param, cb);
    },
    queryByRange: function(param, cb) {
        crud(sql.queryByRange, param, cb);
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
    },
    insertLike: function(param, cb) {
        crud(sql.insertLike, param, cb);
    },
    delLike: function(param, cb) {
        crud(sql.delLike, param, cb);
    },
    queryisLike: function(param, cb) {
        crud(sql.queryisLike, param, cb);
    },
    queryAllLike: function(param, cb) {
        crud(sql.queryAllLike, param, cb);
    },
};