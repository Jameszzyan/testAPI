$.ajax({
  url: "/showNavigator",
  type: "get",
  dataType: "json",
  success: data => {
    if (data.code == 0) {
      var html = template("nav", data);
      $(".nav").html(html);
    }
  }
});
