/* FOODiing — shared behaviour: mobile menu + category filter */
(function () {
  'use strict';

  /* ---------- Mobile menu ---------- */
  var header = document.getElementById('site-header');
  var toggle = header && header.querySelector('.menu-toggle');

  if (header && toggle) {
    var setOpen = function (open) {
      header.classList.toggle('is-open', open);
      toggle.setAttribute('aria-expanded', String(open));
      toggle.setAttribute('aria-label', open ? '메뉴 닫기' : '메뉴 열기');
    };

    toggle.addEventListener('click', function () {
      setOpen(!header.classList.contains('is-open'));
    });

    // close after choosing a link, on Esc, or when resizing up to desktop
    header.querySelectorAll('.nav a').forEach(function (a) {
      a.addEventListener('click', function () { setOpen(false); });
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') setOpen(false);
    });
    window.matchMedia('(min-width: 901px)').addEventListener('change', function (e) {
      if (e.matches) setOpen(false);
    });
  }

  /* ---------- Category filter (home + funding list) ---------- */
  var buttons = document.querySelectorAll('.cat[data-filter]');
  var cards = document.querySelectorAll('#cards .card');
  var empty = document.getElementById('empty');

  buttons.forEach(function (btn) {
    btn.addEventListener('click', function () {
      var value = btn.dataset.filter;
      var shown = 0;

      buttons.forEach(function (b) {
        var on = b === btn;
        b.classList.toggle('active', on);
        b.setAttribute('aria-pressed', String(on));
      });

      cards.forEach(function (card) {
        var match = value === 'all' || card.dataset.category === value;
        card.hidden = !match;
        if (match) shown++;
      });

      if (empty) empty.hidden = shown !== 0;
    });
  });
})();
