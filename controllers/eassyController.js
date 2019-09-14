// 引入文章数据处理模块
var eassyModule = require("../modules/eassyModule");
// 引入formidable模块
var formidable = require("formidable");
// 引入moment模块
var moment = require("moment");
module.exports = {
  // 后端渲染文章信息主页面
  showAlleassy(req, res) {
    var url = req.url;
    var arr = url.split("/");
    var id = arr[arr.length - 1];
    // 用户退出登录以后，session中相应的值变为null，需要重定向登录页面，防治越权访问
    if (req.session["data" + id] == null) {
      res.redirect("/admin/login");
      return;
    }
    var { avatar, nickname, user_id } = req.session["data" + id];
    eassyModule.find_categories_by_id(id, (err, result) => {
      if (err) return console.log(err);
      res.render("admin/posts", {
        id: user_id,
        avatar: avatar,
        nickname: nickname,
        result: result
      });
    });
  },
  // 获取文章有关信息进行前端渲染
  showEassyList(req, res) {
    eassyModule.data_part_by_id(req.body, (err, result1) => {
      if (err) return console.log(err);
      eassyModule.get_total_eassy(req.body.id, (err, result2) => {
        if (err) return console.log(err);
        res.json({
          code: 0,
          result: result1,
          total: result2[0].total
        });
      });
    });
  },
  // 后端渲染新增及修改页面的相关内容
  showEassyAdd(req, res) {
    var url = req.url;
    var arr1 = url.split("/");
    var arr2 = arr1[arr1.length - 1].split("?");
    var id = arr2[0];
    // 用户退出登录以后，session中相应的值变为null，需要重定向登录页面，防治越权访问
    if (req.session["data" + id] == null) {
      res.redirect("/admin/login");
      return;
    }
    var { avatar, nickname, user_id } = req.session["data" + id];
    res.render("admin/post-add", {
      id: user_id,
      avatar: avatar,
      nickname: nickname
    });
  },
  // 后端渲染文章分类页面
  showEassyCategories(req, res) {
    var url = req.url;
    var arr = url.split("/");
    var id = arr[arr.length - 1];
    // 用户退出登录以后，session中相应的值变为null，需要重定向登录页面，防治越权访问
    if (req.session["data" + id] == null) {
      res.redirect("/admin/login");
      return;
    }
    var { avatar, nickname, user_id } = req.session["data" + id];
    res.render("admin/categories", {
      id: user_id,
      avatar: avatar,
      nickname: nickname
    });
  },
  // 找出用户对应id文章的信息进行前端渲染
  get_data_by_id(req, res) {
    eassyModule.data_all_by_id(req.body.id, (err, result) => {
      if (err) {
        return res.json({
          code: 1,
          msg: "该用户没有该文章"
        });
      }
      result[0].created_time = moment(result[0].created_time).format(
        "YYYY-MM-DDTHH:mm:ss"
      );
      res.json({
        code: 0,
        msg: "成功读取",
        result: result[0]
      });
    });
  },
  // 将用户文章的状态变为trashed
  change_status(req, res) {
    eassyModule.change_status(req.body.id, (err, result) => {
      if (err)
        return res.json({
          code: 1,
          msg: "更新失败"
        });
      if (result.affectedRows > 0) {
        res.json({
          code: 0,
          msg: "更新成功"
        });
      } else if (result.affectedRows == 0) {
        res.json({
          code: 2,
          msg: "更新失败"
        });
      }
    });
  },
  // 上传特色文件
  upload_feature(req, res) {
    var form = new formidable.IncomingForm();
    form.encoding = "utf-8";
    form.uploadDir = __dirname + "/../uploads";
    form.keepExtensions = true;
    form.maxFileSize = 10 * 1024 * 1024;
    form.parse(req, function(err, fields, files) {
      if (err)
        return res.json({
          code: 1,
          msg: "上传失败"
        });
      // 上传的文件路径默认为本机路径，需要修改为服务器端使用的路径
      var path = files.feature.path;
      var arr = path.split("\\");
      path = "/uploads/" + arr[arr.length - 1];
      res.json({
        code: 0,
        msg: "上传成功",
        feature: path
      });
    });
  },
  // 新增用户文章
  addEassy(req, res) {
    var {
      alias,
      title,
      feature,
      created_time,
      content,
      status,
      user_id,
      category_id
    } = req.body;
    var arr = [];
    arr[0] = alias;
    arr[1] = title;
    arr[2] = feature;
    arr[3] = created_time;
    arr[4] = content;
    arr[5] = status;
    arr[6] = user_id;
    arr[7] = category_id;
    eassyModule.add_data(arr, (err, result) => {
      if (err)
        return res.json({
          code: 1,
          msg: "文章加入失败"
        });
      if (result.affectedRows == 0) {
        res.json({
          code: 2,
          msg: "文章加入失败"
        });
      } else if (result.affectedRows > 0) {
        res.json({
          code: 0,
          msg: "文章加入成功"
        });
      }
    });
  },
  // 修改用户文章
  modifyEassy(req, res) {
    var posts_id = req.body.posts_id;
    delete req.body.posts_id;
    eassyModule.modify_data(req.body, posts_id, (err, result) => {
      console.log(err);
      if (err)
        return res.json({
          code: 1,
          msg: "文章更新失败"
        });
      if (result.affectedRows == 0) {
        res.json({
          code: 2,
          msg: "文章没有更新"
        });
      } else if (result.affectedRows > 0) {
        res.json({
          code: 0,
          msg: "文章更新成功"
        });
      }
    });
  },
  // 获取对应页码的分类进行前端渲染
  get_all_categories(req, res) {
    eassyModule.find_all_categories(
      req.body.currentPage,
      req.body.pageSize,
      (err, result1) => {
        console.log(err);
        if (err)
          return res.json({
            code: 1,
            msg: "读取失败"
          });
        eassyModule.find_total_categories((err, result2) => {
          if (err)
            return res.json({
              code: 2,
              msg: "读取失败"
            });
          res.json({
            code: 0,
            msg: "读取成功",
            result: result1,
            total: result2[0].total
          });
        });
      }
    );
  },
  // 增加新的文章种类
  add_category(req, res) {
    eassyModule.add_category(req.body, (err, result) => {
      console.log(err);
      if (err)
        return res.json({
          code: 1,
          msg: "文章种类增加失败"
        });
      if (result.affectedRows > 0) {
        res.json({
          code: 0,
          msg: "文章种类增加成功"
        });
      }
    });
  },
  // 删除文章种类
  delete_category(req, res) {
    eassyModule.delete_category(req.body.id, (err, result) => {
      console.log(err);
      if (err)
        return res.json({
          code: 1,
          msg: "文章种类删除失败"
        });
      if (result.affectedRows > 0) {
        res.json({
          code: 0,
          msg: "文章种类删除成功"
        });
      }
    });
  }
};
