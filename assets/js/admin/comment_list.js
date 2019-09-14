(function() {
  // 前端渲染评论列表
  let currentPage = 1;
  let pageSize = 3;
  // 向前端请求数据函数
  function render() {
    $.ajax({
      url: "/get_comments",
      type: "post",
      data: {
        id: $("#user_id").val(),
        currentPage: currentPage,
        pageSize: pageSize
      },
      dataType: "json",
      success: data => {
        if (data.code == 0) {
          var html = template("commentList", data);
          $("tbody").html(html);
          $("td").css({
            "background-color": "transparent"
          });
          var pageSum = Math.ceil(data.total / pageSize);
          if (pageSum == 0) {
            pageSum = 1;
          }
          setPage(currentPage, pageSum, render);
          // 页面每次刷新全选框取消勾选
          $("thead input").prop({
            checked: false
          });
        }
      }
    });
  }
  // 页面刚开始跳转的时候展示第一页评论
  render();
  // bootstrap-paginator函数
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
  // 评论项批准
  $("tbody").on("click", "a.btn-info", function(event) {
    event.preventDefault();
    var arr = [];
    arr.push(Number($(this).data("id")));
    $.ajax({
      url: "/comment_approve",
      type: "post",
      data: {
        arr: JSON.stringify(arr)
      },
      dataType: "json",
      success: data => {
        if (data.code == 0) {
          currentPage = Number($("ul.pagination li.active").text());
          render();
        }
      }
    });
  });
  // 评论项删除
  $("tbody").on("click", "a.btn-danger", function(event) {
    event.preventDefault();
    if (window.confirm("是否删除该条评论")) {
      var arr = [];
      arr.push(Number($(this).data("id")));
      $.ajax({
        url: "/comment_delete",
        type: "post",
        data: {
          arr: JSON.stringify(arr)
        },
        dataType: "json",
        success: data => {
          if (data.code == 0) {
            currentPage = Number($("ul.pagination li.active").text());
            render();
          }
        }
      });
    }
  });
  // 评论项拒绝
  $("tbody").on("click", "a.btn-reject", function(event) {
    event.preventDefault();
    var arr = [];
    arr.push(Number($(this).data("id")));
    $.ajax({
      url: "/comment_reject",
      type: "post",
      data: {
        arr: JSON.stringify(arr)
      },
      dataType: "json",
      success: data => {
        if (data.code == 0) {
          currentPage = Number($("ul.pagination li.active").text());
          render();
        }
      }
    });
  });
  // 设置全选按钮
  $("thead input").on("click", function(event) {
    $("tbody tr input").prop({
      checked: $(this).prop("checked")
    });
  });
  // 评论批量批准
  $("div.btn-batch .btn-info").on("click", function(event) {
    var arr = [];
    var $checkbox = $("tr.danger input:checked");
    $checkbox.each(function(index, item) {
      arr.push(Number(item.getAttribute("data-id")));
    });
    $.ajax({
      url: "/comment_approve",
      type: "post",
      beforeSend: () => {
        if (arr.length == 0) return false;
      },
      data: {
        arr: JSON.stringify(arr)
      },
      dataType: "json",
      success: data => {
        if (data.code == 0) {
          currentPage = Number($("ul.pagination li.active").text());
          render();
        }
      }
    });
  });
  // 评论批量删除
  $("div.btn-batch .btn-danger").on("click", function(event) {
    if (window.confirm("是否删除选择的评论项")) {
      var arr = [];
      var $checkbox = $("tr.danger input:checked");
      $checkbox.each(function(index, item) {
        arr.push(Number(item.getAttribute("data-id")));
      });
      $.ajax({
        url: "/comment_delete",
        type: "post",
        beforeSend: () => {
          if (arr.length == 0) return false;
        },
        data: {
          arr: JSON.stringify(arr)
        },
        dataType: "json",
        success: data => {
          if (data.code == 0) {
            currentPage = Number($("ul.pagination li.active").text());
            render();
          }
        }
      });
    }
  });
  // 评论批量拒绝
  $("div.btn-batch .btn-warning").on("click", function(event) {
    var arr = [];
    var $checkbox = $("tr.danger input:checked");
    $checkbox.each(function(index, item) {
      arr.push(Number(item.getAttribute("data-id")));
    });
    $.ajax({
      url: "/comment_reject",
      type: "post",
      beforeSend: () => {
        if (arr.length == 0) return false;
      },
      data: {
        arr: JSON.stringify(arr)
      },
      dataType: "json",
      success: data => {
        if (data.code == 0) {
          currentPage = Number($("ul.pagination li.active").text());
          render();
        }
      }
    });
  });
})();
