(function() {
  // 前端渲染所有分类栏
  let currentPage = 1;
  let pageSize = 3;
  function render() {
    $.ajax({
      url: "/get_all_categories",
      type: "post",
      data: {
        currentPage: currentPage,
        pageSize: pageSize
      },
      dataType: "json",
      success: data => {
        if (data.code == 0) {
          var html = template("all_categories", data);
          $("tbody").html(html);
          var pageSum = Math.ceil(data.total / pageSize);
          if (pageSum == 0) {
            pageSum = 1;
          }
          setPage(currentPage, pageSum, render);
        }
      }
    });
  }

  render();

  // bootstrappagination函数
  function setPage(pageCurrent, pageSum, callback) {
    $(".pagination").bootstrapPaginator({
      //设置版本号
      bootstrapMajorVersion: 3,
      // 显示第几页
      currentPage: pageCurrent,
      // 总页数
      totalPages: pageSum,
      //当单击操作按钮的时候, 执行该函数, 调用ajax渲染页面
      onPageClicked: function(event, originalEvent, type, page) {
        // 把当前点击的页码赋值给currentPage, 调用ajax,渲染页面
        currentPage = page;
        callback && callback();
      }
    });
  }

  // 设置文本框获得焦点后错误提示取消
  $("form input").on("focus", function(event) {
    $("div.alert-danger").css({
      display: "none"
    });
  });

  // 新增种类
  $("input.btn-primary").on("click", function(event) {
    $.ajax({
      url: "/add_category",
      type: "post",
      beforeSend: () => {
        // 判断所有输入框均不能为空
        if ($("#name").val() == "") {
          var str = `<strong>错误！</strong>名称不能为空`;
          $("div.alert-danger")
            .html(str)
            .css({
              display: "block"
            });
          return false;
        } else if ($("#alias").val() == "") {
          var str = `<strong>错误！</strong>别名不能为空`;
          $("div.alert-danger")
            .html(str)
            .css({
              display: "block"
            });
          return false;
        }
      },
      data: $("form").serialize(),
      dataType: "json",
      success: data => {
        if (data.code == 0) {
          location.reload();
        } else if (data.code == 1) {
          alert("该种类已存在，请重新添加");
        }
      }
    });
  });

  // 删除种类
  $("tbody").on("click", "a.btndel", function(event) {
    event.preventDefault();
    if (window.confirm("是否删除该文章种类")) {
      $.ajax({
        url: "/delete_category",
        type: "post",
        data: {
          id: $(this).data("id")
        },
        dataType: "json",
        success: data => {
          if (data.code == 0) {
            location.reload();
          }
        }
      });
    }
  });
})();
