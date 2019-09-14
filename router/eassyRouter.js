var express = require("express");
// 引入文章控制器模块
var eassyController = require("../controllers/eassyController");
var router = express.Router();
// 展示文章相关页面
router
  // 后端渲染
  // 展示文章列表页面
  .get("/admin/posts/:id", eassyController.showAlleassy)
  //   展示文章新增及编辑页面(这里使用use判断新增和编辑页面)
  .use("/admin/post-add", eassyController.showEassyAdd)
  // 展示分类目录页面
  .get("/admin/categories/:id", eassyController.showEassyCategories)

  // 前端ajax
  // 获取用户所有文章相关信息
  .post("/get_eassyList", eassyController.showEassyList)
  // 更改文章的状态为trashed（销毁）
  .post("/change_status", eassyController.change_status)
  // 获取用户编辑文章的所有信息
  .post("/get_data_by_id", eassyController.get_data_by_id)
  // 上传特色文件
  .post("/uploadFeature", eassyController.upload_feature)
  // 获取所有分类
  .post("/get_all_categories", eassyController.get_all_categories)
  // 新增用户文章
  .post("/addEassy", eassyController.addEassy)
  // 修改用户文章
  .post("/modifyEassy", eassyController.modifyEassy)
  // 增加新的文章种类
  .post("/add_category", eassyController.add_category)
  // 删除文章种类
  .post("/delete_category", eassyController.delete_category);
module.exports = router;
