//引入optionModule模块
var option = require("../modules/optionModule");
// 展示index页面轮播图
module.exports.showCarousel = (req, res) => {
  option.getCarouselData((err, result) => {
    if (err) {
      res.json({
        code: 1,
        msg: "服务器异常"
      });
    } else {
      res.json({
        code: 0,
        msg: "成功读取数据",
        result: JSON.parse(result[0].value)
      });
    }
  });
};
// 展示页面导航栏
module.exports.showNavigator = (req, res) => {
  option.getNavData((err, result) => {
    if (err) {
      res.json({
        code: 1,
        msg: "服务器异常"
      });
    } else {
      res.json({
        code: 0,
        msg: "成功读取数据",
        result: JSON.parse(result[0].value)
      });
    }
  });
};
