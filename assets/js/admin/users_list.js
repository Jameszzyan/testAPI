(function() {
  // 前端渲染评论列表
  let currentPage = 1;
  let pageSize = 5;
  // 向前端请求用户列表数据函数
  function render() {
    $.ajax({
      url: "/get_users_data",
      type: "post",
      data: {
        currentPage: currentPage,
        pageSize: pageSize
      },
      dataType: "json",
      success: data => {
        if (data.code == 0) {
          var html = template("users_list", data);
          $("tbody").html(html);
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
  // 页面刚开始跳转的时候展示第一页用户列表
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
  // 设置全选按钮
  $("thead input").on("click", function(event) {
    $("tbody tr input").prop({
      checked: $(this).prop("checked")
    });
  });
  // 判断别名是否已经被用过
  $("input#alias").on("blur", function(event) {
    if ($(this).val() != "") {
      $.ajax({
        url: "/user_alias_check",
        type: "post",
        data: {
          alias: $(this).val()
        },
        dataType: "json",
        success: data => {
          if (data.code == 0) {
            $("p.help-block").css({
              display: "block"
            });
            $("p.help-block strong")
              .text(data.msg)
              .css({
                color: "green"
              });
          }
          if (data.code == 1) {
            $("p.help-block").css({
              display: "block"
            });
            $("p.help-block strong")
              .text(data.msg)
              .css({
                color: "red"
              });
          }
        }
      });
    } else {
      $("p.help-block").css({
        display: "none"
      });
    }
  });
  // 设置添加用户事件
  $("form").on("submit", function(event) {
    event.preventDefault();
    $.ajax({
      url: "/add_user",
      type: "post",
      beforeSend: () => {
        // 判断所有输入框均不能为空
        var inputs = document.querySelectorAll("form input");
        var labels = document.querySelectorAll("form label");
        var fath = document.querySelector("div.alert-danger");
        for (var i = 0; i < inputs.length; i++) {
          if (inputs[i].value == "") {
            var str = `<strong>错误！</strong>${labels[i].innerText}不能为空`;
            fath.innerHTML = str;
            fath.style.display = "block";
            return false;
          }
        }
        /*  var email = $("#email").val();
        var emailFormat = /^\w+[@]\w+\.com$/g;
        if (!emailFormat.test(email)) {
          $(".alert span").html("<strong>错误！</strong>邮箱格式错误");
          $(".alert-danger").css({
            display: "block"
          });
          return false;
        } */
      },
      data: $("form").serialize(),
      dataType: "json",
      success: data => {
        if (data.code == 0) {
          location.reload();
        } else if (data.code == 1) {
          alert("该邮箱已被使用，请使用其他邮箱");
        }
      }
    });
  });
  // 设置文本框获得焦点后错误提示取消
  $("form input").on("focus", function(event) {
    $("div.alert-danger").css({
      display: "none"
    });
  });
})();
