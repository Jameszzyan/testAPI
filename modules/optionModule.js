/* 该模块主要针对数据库中options表的数据进行处理 */

// 引入连接mysql头部的模块
var connection = require("./connectSQL");
// 设置函数根据id获取options表里面的value数据
module.exports.getDataById = (id, callback) => {
  var str = "SELECT value FROM options WHERE options_id=" + id;
  connection.query(str, (err, result) => {
    if (err) return callback(err, null);
    callback(null, result);
  });
};
// 轮播图数据从数据库options表中id=10的value中获得
module.exports.getCarouselData = callback => {
  this.getDataById(10, callback);
};
// 页面导航栏数据从数据库options表中id=9的value中获得
module.exports.getNavData = callback => {
  this.getDataById(9, callback);
};
