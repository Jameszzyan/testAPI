// 对用户信息进行处理
// 引入连接mysql头部的模块
var connection = require("./connectSQL");
module.exports = {
  // 根据邮箱获取对应用户的信息
  data_by_email(email, callback) {
    var str = `SELECT * FROM users WHERE email='${email}'`;
    console.log(str);
    connection.query(str, (err, result) => {
      if (err) return callback(err, null);
      callback(null, result);
    });
  },
  // 根据用户id获取用户的信息
  data_by_id(user_id, callback) {
    var str = `SELECT * FROM users WHERE user_id=?`;
    console.log(str);
    connection.query(str, [user_id], (err, result) => {
      if (err) return callback(err, null);
      callback(null, result);
    });
  },
  // 根据用户id更新用户信息
  data_update(obj, user_id, callback) {
    var str = `UPDATE users SET ? WHERE user_id=?`;
    connection.query(str, [obj, user_id], (err, result) => {
      if (err) return callback(err, null);
      callback(null, result);
    });
  },
  // 根据用户id获取文章相关信息（使用mysql的procedure语句）
  eassyData_by_id(user_id, callback) {
    var str = `
    CALL eassy_information(${user_id},@t1,@t2,@t3,@t4,@t5);
    `;
    connection.query(str, (err, result) => {
      if (err) return callback(err, null);
      callback(null, result);
    });
  }
};
