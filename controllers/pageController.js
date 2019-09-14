// 引入pageContentModule模块
var page = require("../modules/pageModule");
// 展示index页面
module.exports.showIndexPage = (req, res) => {
  // 获取随机推荐栏渲染所需的数据并使用后端渲染title，目的是为了SEO搜索
  page.get_data_of_recommend((err, result) => {
    if (err) return console.log(err);
    res.render("index", { recommend: result });
  });
};

// 展示list页面(funny、living、tech和travel)
module.exports.showFunnyContent = (req, res) => {
  this.showList("funny", req, res);
};
module.exports.showLivingContent = (req, res) => {
  this.showList("living", req, res);
};
module.exports.showTechContent = (req, res) => {
  this.showList("tech", req, res);
};
module.exports.showTravelContent = (req, res) => {
  this.showList("travel", req, res);
};

// list页面渲染函数
module.exports.showList = (category, req, res) => {
  page.get_data_of_list(category, (err1, result1) => {
    if (err1) return console.log(err1);
    result1.forEach((item, index) => {
      item.write_time = item.write_time.slice(0, -9);
    });
    page.get_data_of_recommend((err2, result2) => {
      if (err2) return console.log(err2);
      var arr = {
        funny: "奇趣事",
        living: "会生活",
        tech: "潮科技",
        travel: "美奇迹"
      };
      console.log(arr[category]);
      res.render("list", {
        head: arr[category],
        content: result1,
        recommend: result2
      });
    });
  });
};

// 展示detail页面
module.exports.showDetailPage = (req, res) => {
  // 获取随机推荐栏以及页面主要内容渲染所需的数据并使用后端渲染title，目的是为了SEO搜索
  page.get_data_of_recommend((err, result1) => {
    if (err) return console.log(err);
    res.render("detail", { recommend: result1 });
  });
};

// 获取评论区数据并传递给前端进行渲染(index、list和detail页面)
module.exports.showComment = (req, res) => {
  page.get_data_of_comment((err, result) => {
    if (err)
      return res.json({
        code: 1,
        msg: "读取失败"
      });
    res.json({
      code: 0,
      msg: "读取成功",
      result: result
    });
  });
};
