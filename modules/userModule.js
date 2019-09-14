var connection = require("./connectSQL");
module.exports = {
  //   获取所有用户的信息
  get_users_data(currentPage, pageSize, callback) {
    var str = `SELECT * FROM users ORDER BY user_id DESC LIMIT ${(currentPage -
      1) *
      pageSize},${pageSize}`;
    connection.query(str, (err, result) => {
      if (err) return callback(err, null);
      callback(null, result);
    });
  },
  //   获取所有用户的总数
  get_total_users(callback) {
    var str = `SELECT count(*) AS total FROM users`;
    connection.query(str, (err, result) => {
      if (err) return callback(err, null);
      callback(null, result);
    });
  },
  //  新增用户到数据库
  add_user(obj, callback) {
    var str = `INSERT INTO users(user_id,alias,email,password,nickname,avatar,briefIntro,status) VALUES(NULL,'${
      obj.alias
    }','${obj.email}','${obj.password}','${
      obj.nickname
    }','/uploads/avatar.jpg',NULL,'unactivated')`;
    connection.query(str, (err, result) => {
      if (err) return callback(err, null);
      callback(null, result);
    });
  },
  // 检查新增用户的别名是否已经被使用
  user_alias_check(alias, callback) {
    var str = `SELECT count(*) AS amount FROM users WHERE alias = '${alias}' `;
    connection.query(str, (err, result) => {
      if (err) return callback(err, null);
      callback(null, result);
    });
  }
};
