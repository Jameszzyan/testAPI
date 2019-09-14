var express = require("express");
// 引入评论模块
var commentController = require("../controllers/commnetController");
var router = express.Router();
router
  // 后端渲染
  // 展示评论页面
  .get("/admin/comments/:id", commentController.showCommentPage)

  //   前端ajax
  // 获取该用户所有文章的评论
  .post("/get_comments", commentController.get_comments)
  // 评论项状态更改为批准
  .post("/comment_approve", commentController.comment_approve)
  // 删除该评论项
  .post("/comment_delete", commentController.comment_delete)
  // 评论项状态更改为拒绝
  .post("/comment_reject", commentController.comment_reject);

module.exports = router;
