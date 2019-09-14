// 引入用户数据库模块
var users = require("../modules/adminModule");
// 引入formidable模块
var formidable = require("formidable");
module.exports = {
  // 展示用户主页面
  showIndexPage(req, res) {
    var url = req.url;
    var arr = url.split("/");
    var id = arr[arr.length - 1];
    // 用户退出登录以后，session中相应的值变为null，需要重定向登录页面，防治越权访问
    if (req.session["data" + id] == null) {
      res.redirect("/admin/login");
      return;
    }
    var avatar = req.session["data" + id].avatar;
    var nickname = req.session["data" + id].nickname;
    var user_id = req.session["data" + id].user_id;
    users.eassyData_by_id(id, (err, result) => {
      if (err) return console.log(err);
      var obj = result[0][0];
      var origin = {
        id: user_id,
        avatar: avatar,
        nickname: nickname,
        ...obj
      };
      res.render("admin/index", origin);
    });
  },
  // 展示用户登录页面
  showLoginPage(req, res) {
    res.render("admin/login", {});
  },
  // 展示用户个人中心页面
  showProfilePage(req, res) {
    var url = req.url;
    var arr = url.split("/");
    var id = arr[arr.length - 1];
    // 用户退出登录以后，session中相应的值变为null，需要重定向登录页面，防治越权访问
    if (req.session["data" + id] == null) {
      res.redirect("/admin/login");
      return;
    }
    // es5旧语法
    /* var avatar = req.session.data.avatar;
    var nickname = req.session.data.nickname;
    var email = req.session.data.email;
    var alias = req.session.data.alias;
    var briefIntro = req.session.data.briefIntro; */

    // es6新语法
    var { user_id, avatar, nickname, email, alias, briefIntro } = req.session[
      "data" + id
    ];
    res.render("admin/profile", {
      id: user_id,
      avatar: avatar,
      nickname: nickname,
      email: email,
      alias: alias,
      briefIntro: briefIntro
    });
  },
  // 展示用户密码更改页面
  showPasswordPage(req, res) {
    var url = req.url;
    var arr = url.split("/");
    var id = arr[arr.length - 1];
    // 用户退出登录以后，session中相应的值变为null，需要重定向登录页面，防治越权访问
    if (req.session["data" + id] == null) {
      res.redirect("/admin/login");
      return;
    }
    var avatar = req.session["data" + id].avatar;
    var nickname = req.session["data" + id].nickname;
    var user_id = req.session["data" + id].user_id;
    res.render("admin/password-reset", {
      id: user_id,
      avatar: avatar,
      nickname: nickname
    });
  },

  // 根据数据库返回的数据检测用户是否存在
  userCheck(req, res) {
    users.data_by_email(req.body.email, (err, result) => {
      if (err)
        return res.json({
          code: 1,
          msg: "服务器异常，请重试"
        });
      if (result[0]) {
        if (result[0].password == req.body.password) {
          var id = result[0].user_id;
          req.session.isLogined = true;
          req.session["data" + id] = result[0];
          res.json({
            code: 0,
            msg: "成功登录",
            id: result[0].user_id
          });
        } else {
          res.json({
            code: 2,
            msg: "密码错误"
          });
        }
      } else {
        res.json({
          code: 3,
          msg: "不存在该用户"
        });
      }
    });
  },
  // 更新用户上传的头像
  avatarUpload(req, res) {
    var form = new formidable.IncomingForm();
    form.encoding = "utf-8";
    form.uploadDir = __dirname + "/../uploads";
    form.keepExtensions = true;
    form.maxFileSize = 10 * 1024 * 1024;
    form.maxFieldSize = 10 * 1024 * 1024;
    form.parse(req, function(err, fields, files) {
      if (err)
        return res.json({
          code: 1,
          msg: "上传失败"
        });
      // 上传的文件路径默认为本机路径，需要修改为服务器端使用的路径
      var path = files.avatar.path;
      var arr = path.split("\\");
      path = "/uploads/" + arr[arr.length - 1];
      res.json({
        code: 0,
        msg: "上传成功",
        avatar: path
      });
    });
  },
  // 更新用户信息（不包括密码）
  information_update(req, res) {
    var { user_id, alias, nickname, briefIntro, avatar } = req.body;
    req.session["data" + user_id].alias = alias;
    req.session["data" + user_id].nickname = nickname;
    req.session["data" + user_id].briefIntro = briefIntro;
    req.session["data" + user_id].avatar = avatar;
    users.data_update(req.body, req.body.user_id, (err, result) => {
      if (err)
        return res.json({
          code: 1,
          msg: "更新失败"
        });
      if (result.affectedRows == 1) {
        res.json({
          code: 0,
          msg: "更新成功"
        });
      } else {
        res.json({
          code: 2,
          msg: "用户信息没有改变"
        });
      }
    });
  },
  // 更改用户密码
  password_reset(req, res) {
    var id = req.body.user_id;
    users.data_by_id(id, (err, result) => {
      console.log(result);
      if (err)
        return res.json({
          code: 1,
          msg: "密码修改失败"
        });
      if (result[0].password == req.body.oldPassword) {
        var update = { password: req.body.newPassword };
        users.data_update(update, id, (err, result) => {
          console.log(result);
          if (err)
            return res.json({
              code: 2,
              msg: "密码修改失败"
            });
          if (result.affectedRows > 0) {
            res.json({
              code: 0,
              msg: "密码修改成功"
            });
          } else {
            res.json({
              code: 3,
              msg: "密码修改失败"
            });
          }
        });
      } else {
        res.json({
          code: 4,
          msg: "旧密码不正确"
        });
      }
    });
  },
  // 清除浏览器的session
  clearSession(req, res) {
    req.session["data" + req.body.id] = null;
    res.json({
      code: 0,
      msg: "成功清除session"
    });
  }
};
