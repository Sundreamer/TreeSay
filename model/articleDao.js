/**
 * article 文章表的 CRUD 模块
 */
var mysql = require('mysql');
var config = require('./config');

// 文章表常用 sql 语句
var sql = {
    insert: 'insert into article(user_id, title, abstract, content, cover) values(?,?,?,?,?)',
    delete: 'delete from article where id=?',
    updateComm: 'update article set comments=comments+1 where id = ?',
    updateCount: 'update article set count=count+? where id = ?',
    queryCount: 'select count(*) as count from article',
    queryById: 'select * from article where id=?',
    queryByUser: 'select * from article where user_id=? order by article.time desc',
    queryByRange: 'select id,title,time,abstract,count,cover,comments from article order by article.time desc limit ?,?',
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
    updateComm: function(param, cb) {
        crud(sql.updateComm, param, cb);
    },
    updateCount: function(param, cb) {
        crud(sql.updateCount, param, cb);
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
    queryCount: function(param, cb) {
        crud(sql.queryCount, param, cb);
    }
};