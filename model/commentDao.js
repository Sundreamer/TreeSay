/**
 * comment 评论表 CRUD 模块
 */
var mysql = require('mysql');
var config = require('./config');

// 评论表常用 sql 语句
var sql = {
    insert: 'insert into comment(user_id, article_id, target_id, content) values(?,?,?,?)',
    delete: 'delete from comment where id=?',
    queryByArt: 'select * from comment where article_id=?',
    queryByUser: 'select * from comment where user_id=?',
    queryByTarget: 'select * from comment where target_id=?',
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
    addComment: function(param, cb) {
        crud(sql.insert, param, cb);
    },
    delComment: function(param, cb) {
        crud(sql.delete, param, cb);
    },
    queryByArt: function(param, cb) {
        crud(sql.queryByArt, param, cb);
    },
    queryByUser: function(param, cb) {
        crud(sql.queryByUser, param, cb);
    },
    queryByTarget: function(param, cb) {
        crud(sql.queryByTarget, param, cb);
    },
};