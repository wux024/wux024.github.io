/* site.js - vanilla JS replacement for jQuery + plugins */
(function () {
  "use strict";

  /* ===== Greedy navigation (priority plus pattern) ===== */
  function initGreedyNav() {
    var nav = document.getElementById("site-nav");
    if (!nav) return;
    var btn = nav.querySelector("button");
    var vlinks = nav.querySelector(".visible-links");
    var hlinks = nav.querySelector(".hidden-links");
    if (!btn || !vlinks || !hlinks) return;

    var breaks = [];

    function updateNav() {
      var available = btn.classList.contains("hidden")
        ? nav.offsetWidth
        : nav.offsetWidth - btn.offsetWidth - 30;

      if (vlinks.offsetWidth > available) {
        breaks.push(vlinks.offsetWidth);
        var last = vlinks.lastElementChild;
        if (last) hlinks.insertBefore(last, hlinks.firstChild);
        if (btn.classList.contains("hidden")) btn.classList.remove("hidden");
      } else if (breaks.length > 0 && available > breaks[breaks.length - 1]) {
        var first = hlinks.firstElementChild;
        if (first) vlinks.appendChild(first);
        breaks.pop();
      }

      if (breaks.length < 1) {
        btn.classList.add("hidden");
        hlinks.classList.add("hidden");
      }

      btn.setAttribute("count", breaks.length);
      if (vlinks.offsetWidth > available) updateNav();
    }

    btn.addEventListener("click", function () {
      hlinks.classList.toggle("hidden");
    });

    var resizePending = false;
    window.addEventListener("resize", function () {
      if (resizePending) return;
      resizePending = true;
      window.requestAnimationFrame(function () {
        resizePending = false;
        updateNav();
      });
    });
    updateNav();
  }

  /* ===== Back to top ===== */
  function initBackToTop() {
    var btn = document.getElementById("back-to-top");
    if (!btn) return;
    window.addEventListener("scroll", function () {
      btn.classList.toggle("visible", window.scrollY > 300);
    }, { passive: true });
    btn.addEventListener("click", function () {
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  }

  /* ===== Publications collapse ===== */
  function initPubCollapse() {
    var heading = document.querySelector("h1#publications");
    if (!heading) return;
    var section = heading.parentElement;
    var h3s = section.querySelectorAll("h3");
    if (!h3s.length) return;

    var firstYear = true;

    Array.prototype.forEach.call(h3s, function (h3) {
      var yearText = h3.textContent.trim();
      var sibling = h3.nextElementSibling;
      var entries = [];

      while (sibling && sibling.tagName !== "H2" && sibling.tagName !== "H3") {
        entries.push(sibling);
        sibling = sibling.nextElementSibling;
      }

      var collapsed = firstYear ? "" : "collapsed";
      var arrowDeg = firstYear ? "0" : "-90";

      var group = document.createElement("div");
      group.className = "pub-year-group";
      var collapsed = firstYear ? "" : "collapsed";

      group.innerHTML =
        '<div class="pub-year-header" role="button" tabindex="0" aria-expanded="' + (firstYear ? "true" : "false") + '">' +
        "<span>" + yearText + ' <span class="pub-year-count">\u00b7 ' + entries.length + "</span></span>" +
        '<i class="fas fa-chevron-down pub-year-arrow" style="transform: rotate(' + arrowDeg + 'deg);"></i>' +
        "</div>" +
        '<div class="pub-year-content ' + collapsed + '"></div>';

      h3.parentNode.replaceChild(group, h3);

      var content = group.querySelector(".pub-year-content");
      entries.forEach(function (el) {
        content.appendChild(el);
      });

      firstYear = false;
    });

    function toggleGroup(header) {
      var group = header.parentElement;
      var content = group.querySelector(".pub-year-content");
      var arrow = header.querySelector(".pub-year-arrow");
      content.classList.toggle("collapsed");
      var collapsed = content.classList.contains("collapsed");
      header.setAttribute("aria-expanded", collapsed ? "false" : "true");
      arrow.style.transform = collapsed ? "rotate(-90deg)" : "rotate(0deg)";
    }

    section.addEventListener("click", function (e) {
      var header = e.target.closest(".pub-year-header");
      if (!header) return;
      toggleGroup(header);
    });

    section.addEventListener("keydown", function (e) {
      if (e.key !== "Enter" && e.key !== " ") return;
      var header = e.target.closest(".pub-year-header");
      if (!header) return;
      e.preventDefault();
      toggleGroup(header);
    });
  }

  /* ===== Dark mode toggle ===== */
  function initDarkMode() {
    var btn = document.createElement("button");
    btn.id = "dark-mode-toggle";
    btn.setAttribute("aria-label", "Toggle dark mode");
    btn.innerHTML = '<i class="fas fa-moon"></i>';
    document.body.appendChild(btn);

    function syncIcon() {
      var dark = document.documentElement.classList.contains("dark");
      btn.querySelector("i").className = dark ? "fas fa-sun" : "fas fa-moon";
    }

    syncIcon();

    btn.addEventListener("click", function () {
      document.documentElement.classList.toggle("dark");
      try {
        var h = new Date().getHours();
        var period = h < 7 || h >= 18 ? "night" : "day";
        localStorage.setItem(
          "dark-mode",
          period + ":" + (document.documentElement.classList.contains("dark") ? "1" : "0")
        );
      } catch (e) {}
      syncIcon();
    });
  }

  /* ===== External links open in new tab ===== */
  function initExternalLinks() {
    Array.prototype.forEach.call(document.querySelectorAll("a[href]"), function (a) {
      var href = a.getAttribute("href");
      if (!href || href.charAt(0) === "#" || href.indexOf("mailto:") === 0) return;
      var url;
      try {
        url = new URL(a.href, window.location.href);
      } catch (e) {
        return;
      }
      if (url.host !== window.location.host) {
        a.setAttribute("target", "_blank");
        a.setAttribute("rel", "noopener noreferrer");
      }
    });
  }

  /* ===== Hero avatar click ripple + bounce effect ===== */
  function initHeroAvatar() {
    var avatar = document.getElementById("heroAvatar");
    if (!avatar) return;
    var wrapper = avatar.parentElement;

    avatar.addEventListener("click", function () {
      avatar.classList.remove("clicked");
      /* Force reflow to restart animation */
      void avatar.offsetWidth;
      avatar.classList.add("clicked");

      var ripple = document.createElement("span");
      ripple.className = "hero-banner__avatar-ripple";
      wrapper.appendChild(ripple);

      setTimeout(function () {
        ripple.remove();
      }, 700);
    });

    avatar.addEventListener("animationend", function () {
      avatar.classList.remove("clicked");
    });
  }

  /* ===== Init ===== */
  function ready(fn) {
    if (document.readyState !== "loading") {
      fn();
    } else {
      document.addEventListener("DOMContentLoaded", fn);
    }
  }

  ready(function () {
    initGreedyNav();
    initBackToTop();
    initPubCollapse();
    initDarkMode();
    initExternalLinks();
    initHeroAvatar();
  });
})();
