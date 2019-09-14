var express = require("express");
// 引入页面渲染模块
var pageController = require("../controllers/pageController");
// 引入页面分部数据模块
var optionController = require("../controllers/optionController");
var router = express.Router();
router
  // 页面渲染
  //展示index页面(后端渲染)
  .get("/", pageController.showIndexPage)
  //展示index页面的轮播图(前端渲染)
  .get("/showCarousel", optionController.showCarousel)

  // 展示主要页面的导航栏(前端渲染)
  .get("/showNavigator", optionController.showNavigator)
  // 展示主要页面的评论区(前端渲染)
  .get("/showComment", pageController.showComment)

  // 展示不同list页面的content
  // 展示category/funny部分(后端渲染)
  .get("/category/funny", pageController.showFunnyContent)
  // 展示category/living部分(后端渲染)
  .get("/category/living", pageController.showLivingContent)
  // 展示category/tech部分(后端渲染)
  .get("/category/tech", pageController.showTechContent)
  // 展示category/trval部分(后端渲染)
  .get("/category/travel", pageController.showTravelContent)

  // 展示detail页面
  .get("/detail", pageController.showDetailPage);
module.exports = router;
