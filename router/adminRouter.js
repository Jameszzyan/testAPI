var express = require("express");
// 引入用户控制器模块
var adminController = require("../controllers/adminController");
var router = express.Router();
router
  // 展示admin相关页面(后端渲染)
  // 展示登录页面
  .get("/admin/login", adminController.showLoginPage)
  // 展示用户主页面
  .get("/admin/:id", adminController.showIndexPage)
  // 展示用户个人资料中心页面
  .get("/admin/profile/:id", adminController.showProfilePage)
  // 展示用户修改密码页面
  .get("/admin/password-reset/:id", adminController.showPasswordPage)

  // 前端ajax请求
  // 根据数据库返回的数据检测用户登陆情况
  .post("/userCheck", adminController.userCheck)
  // 更改用户上传的头像进行更改
  .post("/avatarUpload", adminController.avatarUpload)
  // 更改用户信息（不包括密码）
  .post("/information_update", adminController.information_update)
  // 更改用户密码
  .post("/password_reset", adminController.password_reset)
  // 清除浏览器的session
  .post("/clearSession", adminController.clearSession);
module.exports = router;
