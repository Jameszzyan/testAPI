(function() {
  // 展示用户所有编写的文章
  let currentPage = 1;
  let pageSize = 3;
  // 封装函数以便setPage进行调用
  function render(obj) {
    $.ajax({
      url: "/get_eassyList",
      type: "post",
      data: {
        id: $("#user_id").val(),
        currentPage: currentPage,
        pageSize: pageSize,
        ...obj
      },
      dataType: "json",
      success: data => {
        if (data.code == 0) {
          var html = template("eassyList", data);
          $("table tbody").html(html);
          var pageSum = Math.ceil(data.total / pageSize);
          if (pageSum == 0) {
            pageSum = 1;
          }
          setPage(currentPage, pageSum, render);
        }
      }
    });
  }

  render({});

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

  // 设置筛选事件
  $("input.btnFilter").on("click", function(event) {
    var cate = $("select.cateSelector option:selected").val();
    var status = $("select.statusSelector option:selected").val();
    var obj = {};
    if (cate != "all") obj.cate = cate;
    if (status != "all") obj.status = status;
    render(obj);
  });

  // 删除文章(在数据库中将status设为trashed)
  $("tbody").on("click", "a.btn-danger", function(event) {
    event.preventDefault();
    if (window.confirm("是否删除该文章")) {
      $.ajax({
        url: "/change_status",
        type: "post",
        data: {
          id: $(".post_id").val()
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
