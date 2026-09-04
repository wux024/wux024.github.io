$(function () {
  var $btn = $("#back-to-top");
  $(window).on("scroll", function () {
    if ($(window).scrollTop() > 300) {
      $btn.addClass("visible");
    } else {
      $btn.removeClass("visible");
    }
  });
  $btn.on("click", function () {
    $("html, body").animate({ scrollTop: 0 }, 400);
  });
});
