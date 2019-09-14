(function() {
  //获取所有分类进行前端渲染
  $.ajax({
    url: "/get_all_categories",
    type: "post",
    data: {
      currentPage: 1,
      pageSize: 100
    },
    dataType: "json",
    success: data => {
      if (data.code == 0) {
        var html = template("all_categories", data);
        $("#category").html(html);
      }
    }
  });

  // 根据href判断是编辑页面还是增加页面
  var href = location.href;
  if (href.indexOf("posts_id") != -1) {
    var arr = location.search.split("=");
    //   给编辑页面选项赋值
    $.ajax({
      url: "/get_data_by_id",
      type: "post",
      data: {
        id: arr[1]
      },
      dataType: "json",
      success: data => {
        console.log(data.result);
        if (data.code == 0) {
          $("#title").val(data.result.title);
          $("#content").val(data.result.content);
          $("#alias").val(data.result.alias);
          if (data.result.feature != null) {
            $("img.help-block")
              .css({
                display: "block"
              })
              .attr({
                src: data.result.feature
              });
            $("input.featureimg").val(data.result.feature);
          } else {
            $("img.help-block").css({
              display: "none"
            });
          }

          $("#category option").each(function(index, item) {
            if (item.classList.contains(data.result.cateName)) {
              item.setAttribute("selected", true);
            }
          });
          $("#created_time").val(data.result.created_time);
          $("#status option").each(function(index, item) {
            if (item.classList.contains(data.result.status)) {
              item.setAttribute("selected", true);
            }
          });
        }
      }
    });
  }
  // 使用富文本框ckeditor
  CKEDITOR.replace("content");

  // 上传用户选择特色图片
  $("input#feature").on("change", function(event) {
    var formData = new FormData();
    var input = document.querySelector("#feature");
    formData.append("feature", input.files[0]);
    console.log(formData.getAll("feature"));
    $.ajax({
      url: "/uploadFeature",
      type: "post",
      data: formData,
      dataType: "json",
      processData: false,
      contentType: false,
      success: data => {
        if (data.code == 0) {
          $("img.help-block")
            .css({
              display: "block"
            })
            .attr({
              src: data.feature
            });
          $("input.featureimg").val(data.feature);
        }
      }
    });
  });

  // 设置输入框取得焦点的时候取消错误提示
  $("form input").on("focus", function(event) {
    $("div.alert-danger").css({
      display: "none"
    });
  });

  // 根据href判断是修改还是增加文章
  $(".btn.btn-primary.btnOpt").on("click", function(event) {
    // 富文本编辑器ckeditor的内容更新
    CKEDITOR.instances.content.updateElement();
    if (href.indexOf("posts_id") == -1) {
      $.ajax({
        url: "/addEassy",
        type: "post",
        data: $("form.row").serialize(),
        dataType: "json",
        beforeSend: () => {
          // 判断所有输入框均不能为空
          if ($("#title").val() == "") {
            var str = `<strong>错误！</strong>标题不能为空`;
            $("div.alert-danger")
              .html(str)
              .css({
                display: "block"
              });
            return false;
          } else if (CKEDITOR.instances.content.getData() == "") {
            var str = `<strong>错误！</strong>内容不能为空`;
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
          } else if ($("#created_time").val() == "") {
            var str = `<strong>错误！</strong>发布时间不能为空`;
            $("div.alert-danger")
              .html(str)
              .css({
                display: "block"
              });
            return false;
          }
        },
        success: data => {
          if (data.code == 0) {
            location.href = "/admin/posts/" + $("#user_id").val();
          }
        }
      });
    } else {
      var arr1 = href.split("?");
      var arr2 = arr1[arr1.length - 1].split("=");
      var form = $("form.row").serialize() + "&" + arr2[0] + "=" + arr2[1];
      console.log(form);
      $.ajax({
        url: "/modifyEassy",
        type: "post",
        data: form,
        dataType: "json",
        success: data => {
          if (data.code == 0) {
            location.href = "/admin/posts/" + $("#user_id").val();
          }
        }
      });
    }
  });
})();
