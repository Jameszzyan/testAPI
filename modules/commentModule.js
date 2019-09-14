var connection = require("./connectSQL");
module.exports = {
  // 获取用户文章对应的所有的评论
  data_by_userId(id, currentPage, pageSize, callback) {
    var str = `SELECT com.comments_id,com.author,com.content,posts.alias,com.createdTime,com.comment_status AS status FROM comments AS com,posts WHERE com.parent_id = posts.user_id AND com.post_id = posts.posts_id AND posts.user_id = ${id} ORDER BY com.comments_id DESC LIMIT ${pageSize} OFFSET ${(currentPage -
      1) *
      pageSize}`;
    console.log(str);
    connection.query(str, (err, result) => {
      if (err) return callback(err, null);
      callback(null, result);
    });
  },
  // 获取所有评论的总数以便前端进行渲染
  get_total_comments(id, callback) {
    var str = `SELECT count(*) AS total FROM comments AS com,posts WHERE com.parent_id = posts.user_id AND com.post_id = posts.posts_id AND posts.user_id = ${id}`;
    connection.query(str, (err, result) => {
      if (err) return callback(err, null);
      callback(null, result);
    });
  },
  // 改变评论项状态
  change_status(arr, status, callback) {
    var str = `UPDATE comments SET comment_status = '${status}' WHERE comments_id in (?)`;
    connection.query(str, arr, (err, result) => {
      if (err) return callback(err, null);
      callback(null, result);
    });
  },
  // 删除评论项
  comment_delete(arr, callback) {
    var str = `DELETE FROM comments WHERE comments_id in(?)`;
    connection.query(str, arr, (err, result) => {
      if (err) return callback(err, null);
      callback(null, result);
    });
  }
};
