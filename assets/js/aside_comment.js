$.ajax({
  url: "/showComment",
  type: "get",
  dataType: "json",
  success: data => {
    if (data.code == 0) {
      console.log(data.result);
      data.result.forEach((item, index) => {
        item.createdTime = item.createdTime.slice(0, -3);
      });
      var html = template("comment", { result: data.result });
      $(".body.discuz").html(html);
    }
  }
});
