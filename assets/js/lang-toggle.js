/* lang-toggle.js - English/Chinese language switcher */
(function () {
  "use strict";

  function applyLang(lang) {
    var html = document.documentElement;
    html.classList.remove("lang-en", "lang-zh");
    html.classList.add(lang === "zh" ? "lang-zh" : "lang-en");
    html.setAttribute("lang", lang === "zh" ? "zh-CN" : "en");
    /* Let greedy navigation recalculate for the new label widths */
    window.dispatchEvent(new Event("resize"));
  }

  function ready(fn) {
    if (document.readyState !== "loading") {
      fn();
    } else {
      document.addEventListener("DOMContentLoaded", fn);
    }
  }

  ready(function () {
    var lang = "en";
    try {
      lang = localStorage.getItem("lang") || "en";
    } catch (e) {}
    applyLang(lang);

    var btn = document.getElementById("lang-toggle");
    if (!btn) return;
    btn.addEventListener("click", function () {
      var current = document.documentElement.classList.contains("lang-zh")
        ? "zh"
        : "en";
      var next = current === "zh" ? "en" : "zh";
      try {
        localStorage.setItem("lang", next);
      } catch (e) {}
      applyLang(next);
    });
  });
})();
