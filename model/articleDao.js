/**
 * article 文章表的 CRUD 模块
 */
var mysql = require('mysql');
var config = require('./config');

// 文字版常用 sql 语句
var sql = {
    insert: 'insert into article(user_id, title, content) values(?,?,?)',
    delete: 'delete from article where id=?',
    queryById: 'select * from article where id=?',
    queryByUser: 'select id,title,time,count from article where user_id=?',
    queryByRange: 'select * from article order by article.time desc limit ?,?'
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
    addArticle: function(param, cb) {
        crud(sql.insert, param, cb);
    },
    delArticle: function(param, cb) {
        crud(sql.delete, param, cb);
    },
    queryById: function(param, cb) {
        crud(sql.queryById, param, cb);
    },
    queryByUser: function(param, cb) {
        crud(sql.queryByUser, param, cb);
    },
    queryByRange: function(param, cb) {
        crud(sql.queryByRange, param, cb);
    },
};