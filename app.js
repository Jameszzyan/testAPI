var express = require("express");
var app = express();
// 引入body-parser模块处理post传过来的数据
var bodyParser = require("body-parser");
// 引入express-session模块调用cookie
var session = require("express-session");
//引入路由器模块
var pageRouter = require("./router/pageRouter");
var adminRouter = require("./router/adminRouter");
var eassyRouter = require("./router/eassyRouter");
var commentRouter = require("./router/commentRouter");
var userRouter = require("./router/userRouter");
// 引入path模块
var path = require("path");

// 创建监听端口3001
app.listen(3001, () => {
  console.log("please visit http://127.0.0.1:3001");
});

// 使用ejs引擎渲染文件
app.set("view engine", "ejs");
// 确定渲染文件目录
app.set("views", path.join(__dirname, "views"));

// 静态文件托管(主要是public和uploads文件夹)
app.use("/assets", express.static(path.join(__dirname, "assets")));
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// 引入session中间件
app.use(
  session({
    name: "login",
    secret: "womujia",
    //强制未更改的session
    resave: false,
    //是否存储未初始化的session数据
    saveUninitialized: false,
    // cookie相关参数
    cookie: {
      maxAge: 1000 * 60 * 60 * 24 * 7
    }
  })
);
// 判断用户是否登陆过网站，防止不是本网站的用户直接访问
app.use((req, res, next) => {
  // 如果req.session的isLogined值为true，或者是访问其他网站（与admin无关）以及登录页面，可以继续往下执行，否则直接跳转登陆页面进行验证
  if (
    (req.session.isLogined && req.session.isLogined == true) ||
    req.url.indexOf("/admin") == -1 ||
    req.url == "/admin/login"
  ) {
    next();
  } else {
    res.redirect("/admin/login");
  }
});

// 允许前端跨域访问
app.all('*', function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header('Access-Control-Allow-Headers', 'Content-type');
  res.header("Access-Control-Allow-Methods", "PUT,POST,GET,DELETE,OPTIONS,PATCH");
  res.header('Access-Control-Max-Age',1728000);//预请求缓存20天
  next();  
});

// 引入bodyParser中间件
app.use(bodyParser.urlencoded({ extended: false }));

//添加路由中间件
app.use(pageRouter);
app.use(adminRouter);
app.use(eassyRouter);
app.use(commentRouter);
app.use(userRouter);
