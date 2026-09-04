$(function () {
  var $btn = $('<button id="dark-mode-toggle" aria-label="Toggle dark mode"><i class="fas fa-moon"></i></button>');
  $("body").append($btn);

  function syncIcon() {
    var dark = document.documentElement.classList.contains("dark");
    $btn.find("i").attr("class", dark ? "fas fa-sun" : "fas fa-moon");
  }

  syncIcon();

  $btn.on("click", function () {
    var el = document.documentElement;
    el.classList.toggle("dark");
    try {
      localStorage.setItem("dark-mode", el.classList.contains("dark") ? "1" : "0");
    } catch (e) {}
    syncIcon();
  });
});
