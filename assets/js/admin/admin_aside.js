(function() {
  // 防止页面跳转文章栏和导航栏收缩
  var href = location.href;
  var arr = href.split("/");
  var idName = arr[arr.length - 2];
  console.log(idName);
  if (
    href.indexOf("posts") != -1 ||
    href.indexOf("post-add") != -1 ||
    href.indexOf("categories") != -1
  ) {
    $("ul#menu-posts")
      .addClass("in")
      .attr({
        "aria-expanded": true
      });
    $("a." + idName).addClass("active");
  } else if (
    href.indexOf("nav-menus") != -1 ||
    href.indexOf("slides") != -1 ||
    href.indexOf("settings") != -1
  ) {
    $("ul#menu-settings")
      .addClass("in")
      .attr({
        "aria-expanded": true
      });
    $("a." + idName).addClass("active");
  }
})();
