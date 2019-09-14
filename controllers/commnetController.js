// 引入评论数据处理模块
var commentModule = require("../modules/commentModule");
module.exports = {
  // 后端渲染评论页面
  showCommentPage(req, res) {
    var url = req.url;
    var arr = url.split("/");
    var id = arr[arr.length - 1];
    // 用户退出登录以后，session中相应的值变为null，需要重定向登录页面，防治越权访问
    if (req.session["data" + id] == null) {
      res.redirect("/admin/login");
      return;
    }
    var { avatar, nickname, user_id } = req.session["data" + id];
    res.render("admin/comments", {
      id: user_id,
      avatar: avatar,
      nickname: nickname
    });
  },
  // 获取评论相关信息进行前端渲染（分页操作）
  get_comments(req, res) {
    commentModule.data_by_userId(
      req.body.id,
      req.body.currentPage,
      req.body.pageSize,
      (err, result1) => {
        console.log(err);
        if (err)
          return res.json({
            code: 1,
            msg: "文章评论查询失败"
          });
        commentModule.get_total_comments(req.body.id, (err, result2) => {
          console.log(err);
          if (err)
            return res.json({
              code: 2,
              msg: "文章评论查询失败"
            });
          return res.json({
            code: 0,
            msg: "文章评论查询成功",
            result: result1,
            total: result2[0].total
          });
        });
      }
    );
  },
  // 将评论状态变为批准
  comment_approve(req, res) {
    var arr = JSON.parse(req.body.arr);
    var param = [];
    param.push(arr);
    console.log(param);
    commentModule.change_status(param, "approved", (err, result) => {
      console.log(err);
      if (err)
        return res.json({
          code: 1,
          msg: "数据更新失败"
        });
      if (result.affectedRows == 0) {
        res.json({
          code: 2,
          msg: "数据保持不变"
        });
      } else {
        res.json({
          code: 0,
          msg: "数据更新成功"
        });
      }
    });
  },
  // 删除评论项
  comment_delete(req, res) {
    var arr = JSON.parse(req.body.arr);
    var param = [];
    param.push(arr);
    commentModule.comment_delete(param, (err, result) => {
      console.log(err);
      if (err)
        return res.json({
          code: 1,
          msg: "数据更新失败"
        });
      if (result.affectedRows == 0) {
        res.json({
          code: 2,
          msg: "数据保持不变"
        });
      } else {
        res.json({
          code: 0,
          msg: "数据更新成功"
        });
      }
    });
  },
  // 将评论状态变为拒绝
  comment_reject(req, res) {
    var arr = JSON.parse(req.body.arr);
    var param = [];
    param.push(arr);
    commentModule.change_status(param, "rejected", (err, result) => {
      console.log(err);
      if (err)
        return res.json({
          code: 1,
          msg: "数据更新失败"
        });
      if (result.affectedRows == 0) {
        res.json({
          code: 2,
          msg: "数据保持不变"
        });
      } else {
        res.json({
          code: 0,
          msg: "数据更新成功"
        });
      }
    });
  }
};
