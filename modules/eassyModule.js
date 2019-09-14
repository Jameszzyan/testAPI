// 该模块主要对文章数据进行处理
// 引入连接mysql头部的模块
var connection = require("./connectSQL");
module.exports = {
  //   找出当前用户所编写所有文章的分类，以便后端进行渲染
  find_categories_by_id(id, callback) {
    var str = `SELECT Distinct cate.alias,cate.name FROM categories AS cate,posts WHERE cate.categories_id=posts.category_id AND posts.status != 'trashed' AND posts.user_id=?`;
    connection.query(str, id, (err, result) => {
      if (err) return callback(err, null);
      callback(null, result);
    });
  },

  //  找出目前分类对应页数的数据
  find_all_categories(currentPage, pageSize, callback) {
    var str = `SELECT * FROM categories WHERE name != '未分类' LIMIT ${(currentPage -
      1) *
      pageSize},${pageSize}`;
    connection.query(str, (err, result) => {
      if (err) return callback(err, null);
      callback(null, result);
    });
  },

  // 找出所有分类的总数
  find_total_categories(callback) {
    var str = `SELECT count(*) AS total FROM categories WHERE name != '未分类'`;
    connection.query(str, (err, result) => {
      if (err) return callback(err, null);
      callback(null, result);
    });
  },

  //   找出当前用户所编写的所有文章的具体信息，反映给前端进行渲染(文章id、文章的标题、作者、分类名字、分类别名、发表时间、状态),同时加上筛选判断
  data_part_by_id(obj, callback) {
    var str = `SELECT posts.posts_id AS id,posts.title AS title,users.nickname AS author,cate.name AS cateName,cate.alias AS cate_alias,posts.created_time AS time,posts.status AS status 
    FROM categories AS cate,posts,users
    WHERE posts.user_id = users.user_id AND cate.categories_id = posts.category_id AND posts.user_id =${
      obj.id
    } AND posts.status != 'trashed'`;
    if (obj.cate) {
      str += ` AND cate_alias = '${obj.cate}'`;
    }
    if (obj.status) {
      str += ` AND posts.status = '${obj.status}'`;
    }
    str += ` ORDER BY id DESC LIMIT ${(obj.currentPage - 1) * obj.pageSize},${
      obj.pageSize
    }`;
    connection.query(str, (err, result) => {
      if (err) return callback(err, null);
      callback(null, result);
    });
  },

  // 获取用户所有文章的总数
  get_total_eassy(id, callback) {
    var str = `SELECT count(*) AS total FROM categories AS cate,posts,users 
    WHERE posts.user_id = users.user_id AND cate.categories_id = posts.category_id AND posts.user_id =? AND posts.status != 'trashed'`;
    connection.query(str, id, (err, result) => {
      if (err) return callback(err, null);
      callback(null, result);
    });
  },

  // 找出用户对应id文章的信息
  data_all_by_id(id, callback) {
    var str = `SELECT posts.*,cate.alias AS cateName FROM posts,categories AS cate WHERE cate.categories_id = posts.category_id AND posts_id = ?`;
    connection.query(str, id, (err, result) => {
      if (err) return callback(err, null);
      callback(null, result);
    });
  },

  //   将用户文章的状态变成trashed
  change_status(id, callback) {
    var str = `UPDATE posts SET status='trashed' WHERE posts_id = ?`;
    connection.query(str, id, (err, result) => {
      if (err) return callback(err, null);
      callback(null, result);
    });
  },

  //   新增用户编辑的文章相关信息
  add_data(arr, callback) {
    var str = `INSERT INTO posts (posts_id,alias,title,feature,created_time,content,views,likes,status,user_id,category_id) VALUES (NULL,?,?,?,?,?,0,0,?,?,?)`;
    connection.query(str, arr, (err, result) => {
      if (err) return callback(err, null);
      callback(null, result);
    });
  },

  //   修改用户之前编辑的文章相关信息
  modify_data(obj, posts_id, callback) {
    var str = `UPDATE posts SET ? WHERE posts_id = ?`;
    connection.query(str, [obj, posts_id], (err, result) => {
      if (err) return callback(err, null);
      callback(null, result);
    });
  },

  // 新增文章种类
  add_category(obj, callback) {
    var str = `INSERT INTO categories (categories_id,alias,name) VALUES (NULL,'${
      obj.alias
    }','${obj.name}')`;
    connection.query(str, (err, result) => {
      if (err) return callback(err, null);
      callback(null, result);
    });
  },

  // 删除文章种类
  delete_category(id, callback) {
    var str = `DELETE FROM categories WHERE categories_id = ${id}`;
    connection.query(str, (err, result) => {
      if (err) return callback(err, null);
      callback(null, result);
    });
  }
};
