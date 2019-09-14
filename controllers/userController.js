// 引入用户列表操作模块
var userModule = require("../modules/userModule");
module.exports = {
  // 后端渲染用户列表页面
  showUserPage(req, res) {
    var url = req.url;
    var arr = url.split("/");
    var id = arr[arr.length - 1];
    // 用户退出登录以后，session中相应的值变为null，需要重定向登录页面，防治越权访问
    if (req.session["data" + id] == null) {
      res.redirect("/admin/login");
      return;
    }
    var { avatar, nickname, user_id } = req.session["data" + id];
    res.render("admin/users", {
      id: user_id,
      avatar: avatar,
      nickname: nickname
    });
  },
  // 获取用户列表数据进行前端渲染
  get_users_data(req, res) {
    userModule.get_users_data(
      req.body.currentPage,
      req.body.pageSize,
      (err, result1) => {
        if (err)
          return res.json({
            code: 1,
            msg: "数据读取失败"
          });
        userModule.get_total_users((err, result2) => {
          if (err)
            return res.json({
              code: 2,
              msg: "数据读取失败"
            });
          res.json({
            code: 0,
            msg: "数据读取成功",
            result: result1,
            total: result2[0].total
          });
        });
      }
    );
  },
  // 将前端新增用户的信息添加到数据库
  add_user(req, res) {
    userModule.add_user(req.body, (err, result) => {
      console.log(err);
      if (err)
        return res.json({
          code: 1,
          msg: "新增用户失败"
        });
      if (result.affectedRows > 0) {
        res.json({
          code: 0,
          msg: "新增用户成功"
        });
      }
    });
  },
  // 检查新增用户的别名是否已经被使用
  user_alias_check(req, res) {
    userModule.user_alias_check(req.body.alias, (err, result) => {
      if (err) return console.log(err);
      if (result[0].amount == 0) {
        res.json({
          code: 0,
          msg: "该用户别名尚未被使用"
        });
      } else if (result[0].amount == 1) {
        res.json({
          code: 1,
          msg: "该用户别名已被使用"
        });
      }
    });
  }
};
