(function() {
  // 注册上传文件事件
  $("input#avatar").on("change", function(event) {
    var formData = new FormData();
    var input = document.querySelector("input#avatar");
    console.log(input.files);
    formData.append("avatar", input.files[0]);
    $.ajax({
      url: "/avatarUpload",
      type: "post",
      data: formData,
      dataType: "json",
      processData: false,
      contentType: false,
      success: data => {
        if (data.code == 1) {
          $(".uploadTips").html(data.msg);
        } else if (data.code == 0) {
          $(".uploadTips").html(data.msg);
          $(".form-horizontal .form-image img").attr({
            src: data.avatar
          });
          $("#updatedAvatar").val(data.avatar);
        }
      }
    });
  });

  // 注册用户信息更改事件
  $(".form-horizontal").on("submit", function(event) {
    event.preventDefault();
    $.ajax({
      url: "/information_update",
      type: "post",
      data: $("form.form-horizontal").serialize(),
      dataType: "json",
      success: data => {
        if (data.code == 1) {
          alert(data.msg);
        } else if (data.code == 2) {
          alert(data.msg);
          var id = $("#user_id").val();
          location.href = "/admin" + "/" + id;
        } else if (data.code == 0) {
          alert(data.msg);
          var id = $("#user_id").val();
          location.href = "/admin" + "/" + id;
        }
      }
    });
  });
})();
