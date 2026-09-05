---
permalink: /
title: ""
excerpt: ""
author_profile: true
redirect_from: 
  - /about/
  - /about.html
---

<div class="hero-banner hero-day" id="heroBanner">
  <div class="hero-banner__overlay"></div>
  <div class="hero-banner__content">
    <h1 class="hero-banner__title">Xin Wu (吴鑫)</h1>
    <p class="hero-banner__subtitle">
      <a href="https://oceaninfo.jmu.edu.cn/" style="color: #fff; text-decoration: none; border-bottom: 1px solid rgba(255,255,255,0.4);">School of Ocean Information Engineering</a>
    </p>
    <p class="hero-banner__affiliation">
      <i class="fas fa-university" aria-hidden="true"></i>
      <a href="https://www.jmu.edu.cn/" style="color: #fff; text-decoration: none;">Jimei University</a> · Xiamen, China
    </p>
  </div>
</div>

<script>
(function() {
  var hour = new Date().getHours();
  var hero = document.getElementById('heroBanner');
  if (!hero) return;
  // 6:00 - 17:00 白天用湖景图; 17:00 - 次日6:00 黄昏/夜晚用晚霞图
  if (hour >= 6 && hour < 17) {
    hero.classList.add('hero-day');
    hero.classList.remove('hero-sunset');
  } else {
    hero.classList.add('hero-sunset');
    hero.classList.remove('hero-day');
  }
})();
</script>

<span class='anchor' id='about-me'></span>
{% include_relative includes/intro.md %}

{% include_relative includes/research.md %}

{% include_relative includes/others.md %}

{% include_relative includes/pub.md %}
