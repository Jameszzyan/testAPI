/* 该模块主要针对数据库中页面有关的数据进行处理 */
// 引入连接mysql头部的模块
var connection = require("./connectSQL");
module.exports = {
  // 设置随机函数
  getRandomNumber(max) {
    var random = Math.floor(Math.random() * max);
    return random;
  },
  // 设置数据库随机读取recommend内容命令字符串
  setRandomOrder() {
    var random_of_categories = this.getRandomNumber(4);
    var arr = ["funny", "living", "tech", "travel"];
    var listNumber = 3;
    var str1 = "SELECT * FROM " + arr[random_of_categories] + " WHERE ";
    var num = [];
    while (num.length < listNumber) {
      var element = this.getRandomNumber(5) + 1;
      num.forEach((item, index) => {
        if (item == element) num.splice(index, 1);
      });
      num.push(element);
    }
    num.sort(function(a, b) {
      return a - b;
    });
    for (var i = 0; i < listNumber; i++) {
      str1 += arr[random_of_categories] + "_id=" + num[i] + " or ";
    }
    var str2 = str1.slice(0, -4);
    var str3 = str2.trim();
    return str3;
  },

  // 根据两次随机选择得到需要渲染的分类及其内容
  get_data_of_recommend(callback) {
    var str = this.setRandomOrder();
    console.log(str);
    connection.query(str, (err, result) => {
      if (err) return callback(err, null);
      callback(null, result);
    });
  },

  // 获取允许发布的评论数据
  get_data_of_comment(callback) {
    var str =
      "select author,createdTime,content,comment_status,avatar from comments,users where comments.author=users.nickname and comment_status not in('rejected')";
    connection.query(str, (err, result) => {
      if (err) return callback(err, null);
      callback(null, result);
    });
  },

  // 获取list页面主要数据(funny、living、tech和travel)
  get_data_of_list(content, callback) {
    var str = "select * from " + content;
    connection.query(str, (err, result) => {
      if (err) return callback(err, null);
      callback(null, result);
    });
  },

  // 后去detail页面主要数据(funny、living、tech和travel)
  get_data_of_detail(callback) {}
};
