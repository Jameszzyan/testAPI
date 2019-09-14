(function() {
  $(".btn.btn-primary.btn-block").on("click", function(event) {
    //   禁用登录按钮，防止用户多次点击
    $(this).attr({
      disabled: true
    });
    $.ajax({
      url: "/userCheck",
      type: "post",
      data: $("form").serialize(),
      timeout: 3000,
      beforeSend: () => {
        // 发送数据之前先进行验证，包括邮箱是否为空，邮箱格式是否正确
        var email = $("#email").val();
        var emailFormat = /^\w+[@]\w+\.com$/g;
        if (email == "") {
          $(".alert span").html("邮箱不能为空");
          $(".alert-danger").css({
            display: "block"
          });
          return false;
        } else if (!emailFormat.test(email)) {
          $(".alert span").html("邮箱格式有误");
          $(".alert-danger").css({
            display: "block"
          });
          return false;
        }
        if ($("#password").val() == "") {
          $(".alert span").html("密码不能为空");
          $(".alert-danger").css({
            display: "block"
          });
          return false;
        }
      },
      dataType: "json",
      success: data => {
        if (data.code == 1) {
          $(".alert span").html("服务器异常，请重试");
          $(".alert-danger").css({
            display: "block"
          });
        } else if (data.code == 2) {
          $(".alert span").html("密码错误");
          $(".alert-danger").css({
            display: "block"
          });
        } else if (data.code == 3) {
          $(".alert span").html("不存在该用户，请注册！");
          $(".alert-danger").css({
            display: "block"
          });
        } else if (data.code == 0) {
          // 存在该用户跳转admin页面
          location.href = "/admin" + "/" + data.id;
        }
      },
      error: () => {
        $(".alert span").html("服务器异常，请重试");
        $(".alert-danger").css({
          display: "block"
        });
      },
      complete: () => {
        // 设置登录按钮可点击
        $(this).attr({
          disabled: false
        });
      }
    });
  });
  $("#email,#password").on("focus", function(event) {
    // 设置登录按钮可点击
    $(".btn").attr({
      disabled: false
    });
    $(".alert-danger").css({
      display: "none"
    });
  });
})();
