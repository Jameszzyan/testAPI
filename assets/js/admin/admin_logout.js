(function() {
  $("a#logout").on("click", function(event) {
    $.ajax({
      url: "/clearSession",
      data: {
        id: $("#user_id").val()
      },
      type: "post",
      dataType: "json",
      success: data => {
        if (data.code == 0) {
          location.href = "/admin/login";
        }
      }
    });
  });
})();
