$.ajax({
  url: "/showCarousel",
  type: "get",
  dataType: "json",
  success: function(data) {
    if (data.code == 0) {
      // 使用template模板渲染
      var html = template("carousel", data);
      $(".swipe-wrapper").html(html);
      // 创建轮播图的轮播提示
      var len = $(".wrap").length;
      for (var i = 0; i < len; i++) {
        $("<span></span>").appendTo($(".cursor"));
      }
      $(".cursor span:eq(0)").addClass("active");
      // 使用swipe插件进行无缝轮播（轮播图不能少于两张，只有两张时轮播图增加复制的两张图（共四张））
      var swiper = new Swipe(document.querySelector(".swipe"), {
        // 自动播放间隔
        auto: 3000,
        // 每次轮播以后执行的函数，参数包括index和element
        transitionEnd: function(index, element) {
          $(".cursor span")
            .eq(index)
            .addClass("active")
            .siblings()
            .removeClass("active");
        }
      });
      // 设置箭头进行左右切换
      $(".arrow.prev").on("click", function(event) {
        // 使用swipe插件自带方法prev()
        swiper.prev();
      });
      $(".arrow.next").on("click", function(event) {
        // 使用swipe插件自带方法next()
        swiper.next();
      });
    }
  }
});
