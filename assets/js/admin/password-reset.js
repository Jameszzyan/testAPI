(function() {
  // 监听密码修改按钮事件
  $("form.form-horizontal").on("submit", function(event) {
    event.preventDefault();
    $(".btn-primary").attr({
      disabled: true
    });
    $.ajax({
      url: "/password_reset",
      type: "post",
      data: {
        oldPassword: $("#old").val(),
        newPassword: $("#password").val(),
        user_id: $("#user_id").val()
      },
      timeout: 3000,
      beforeSend: () => {
        if (
          $("#old").val() == "" ||
          $("#password").val() == "" ||
          $("#confirm").val() == ""
        ) {
          $(".alert-danger")
            .text("密码栏不能为空")
            .css({ display: "block" });
          return false;
        } else if ($("#password").val() != $("#confirm").val()) {
          $(".alert-danger")
            .text("请确认两次输入的新密码是一致的！")
            .css({ display: "block" });
          return false;
        }
      },
      dataType: "json",
      success: data => {
        if (data.code == 1 || data.code == 2 || data.code == 3) {
          $(".alert-danger")
            .text(data.msg)
            .css({ display: "block" });
        } else if (data.code == 4) {
          $(".alert-danger")
            .text(data.msg)
            .css({ display: "block" });
        } else if (data.code == 0) {
          alert(data.msg);
          location.href = "/admin/profile/" + $("#user_id").val();
        }
      },
      error: () => {
        $(".alert-danger")
          .text("服务器异常")
          .css({ display: "block" });
      },
      complete: () => {
        $(".btn-primary").attr({
          disabled: false
        });
      }
    });
  });

  // 设置输入框取得焦点以后就隐藏错误提示栏
  $("#old,#password,#confirm").on("focus", function(event) {
    $(".btn-primary").attr({
      disabled: false
    });
    $(".alert-danger").css({
      display: "none"
    });
  });
})();
