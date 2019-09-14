var express = require("express");
var router = express.Router();
// 引入用户处理控制器模块
var userController = require("../controllers/userController");
router
  // 后端渲染
  // 展示用户列表页面
  .get("/admin/users/:id", userController.showUserPage)

  // 前端aiax
  // 获取所有用户的相关信息
  .post("/get_users_data", userController.get_users_data)
  // 添加用户
  .post("/add_user", userController.add_user)
  // 检查新增用户的别名是否已经被使用
  .post("/user_alias_check", userController.user_alias_check);
module.exports = router;
