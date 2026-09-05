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
    <div class="hero-banner__avatar-wrapper">
      <img src="{{ site.author.avatar | relative_url }}" class="hero-banner__avatar" id="heroAvatar" alt="{{ site.author.name }}">
    </div>
    <h1 class="hero-banner__title">Xin Wu (吴鑫)</h1>
    <p class="hero-banner__subtitle">
      <a href="https://oceaninfo.jmu.edu.cn/" style="color: #fff; text-decoration: none; border-bottom: 1px solid rgba(255,255,255,0.4);">School of Ocean Information Engineering</a>
    </p>
    <p class="hero-banner__affiliation">
      <i class="fas fa-university" aria-hidden="true"></i>
      <a href="https://www.jmu.edu.cn/" style="color: #fff; text-decoration: none;">Jimei University</a> · Xiamen, China
    </p>
    <div class="hero-banner__links">
      {% if site.author.email %}<a href="mailto:{{ site.author.email }}" title="Email"><i class="fas fa-fw fa-envelope"></i></a>{% endif %}
      {% if site.author.googlescholar %}<a href="{{ site.author.googlescholar }}" title="Google Scholar"><i class="ai ai-fw ai-google-scholar"></i></a>{% endif %}
      {% if site.author.github %}<a href="https://github.com/{{ site.author.github }}" title="GitHub"><i class="fab fa-fw fa-github"></i></a>{% endif %}
      {% if site.author.orcid %}<a href="{{ site.author.orcid }}" title="ORCID"><i class="ai ai-fw ai-orcid"></i></a>{% endif %}
    </div>
  </div>
</div>

<script>
(function() {
  var hour = new Date().getHours();
  var hero = document.getElementById('heroBanner');
  if (!hero) return;
  if (hour >= 6 && hour < 17) {
    hero.classList.add('hero-day');
    hero.classList.remove('hero-sunset');
  } else {
    hero.classList.add('hero-sunset');
    hero.classList.remove('hero-day');
  }
})();

/* Avatar click ripple + bounce effect */
(function() {
  var avatar = document.getElementById('heroAvatar');
  if (!avatar) return;
  var wrapper = avatar.parentElement;

  avatar.addEventListener('click', function(e) {
    // Bounce animation
    avatar.classList.remove('clicked');
    // Force reflow to restart animation
    void avatar.offsetWidth;
    avatar.classList.add('clicked');

    // Ripple effect
    var ripple = document.createElement('span');
    ripple.className = 'hero-banner__avatar-ripple';
    wrapper.appendChild(ripple);

    setTimeout(function() {
      ripple.remove();
    }, 700);
  });

  // Remove bounce class after animation ends
  avatar.addEventListener('animationend', function() {
    avatar.classList.remove('clicked');
  });
})();
</script>

<span class='anchor' id='about-me'></span>
{% include_relative includes/intro.md %}

{% include_relative includes/research.md %}

{% include_relative includes/others.md %}

{% include_relative includes/pub.md %}
