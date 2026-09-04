$(function () {
  var $pubSection = $("#publications").parent();
  if (!$pubSection.length) return;

  var $h3s = $pubSection.find("h3");
  if (!$h3s.length) return;

  var firstYear = true;

  $h3s.each(function () {
    var $h3 = $(this);
    var yearText = $h3.text().trim();
    var $sibling = $h3.next();
    var entries = [];

    while ($sibling.length && !$sibling.is("h2, h3")) {
      entries.push($sibling[0]);
      $sibling = $sibling.next();
    }

    var collapsed = firstYear ? "" : "collapsed";
    var arrowDeg = firstYear ? "0" : "-90";

    $h3.replaceWith(
      '<div class="pub-year-group">' +
        '<div class="pub-year-header">' +
        "<span>" + yearText + "</span>" +
        '<i class="fas fa-chevron-down pub-year-arrow" style="transform: rotate(' + arrowDeg + 'deg);"></i>' +
        "</div>" +
        '<div class="pub-year-content ' + collapsed + '"></div>' +
        "</div>"
    );

    var $content = $pubSection.find(".pub-year-group .pub-year-content").last();
    $.each(entries, function (i, el) {
      $content.append(el);
    });

    firstYear = false;
  });

  $pubSection.on("click", ".pub-year-header", function () {
    var $group = $(this).parent();
    var $content = $group.find(".pub-year-content");
    var $arrow = $(this).find(".pub-year-arrow");
    $content.toggleClass("collapsed");
    if ($content.hasClass("collapsed")) {
      $arrow.css("transform", "rotate(-90deg)");
    } else {
      $arrow.css("transform", "rotate(0deg)");
    }
  });
});
