/* FOODiing — shared behaviour: mobile menu + category filter */
/* In-page notification (used by the demo flow) */
window.foodiingToast = function (message, title) {
  var box = document.getElementById('toast-box');
  if (!box) { box = document.createElement('div'); box.id = 'toast-box'; box.setAttribute('aria-live', 'polite'); document.body.appendChild(box); }
  var t = document.createElement('div');
  t.className = 'toast';
  var h = document.createElement('b'); h.textContent = title || 'FOODiing 알림';
  var p = document.createElement('span'); p.textContent = message;
  t.append(h, p); box.appendChild(t);
  setTimeout(function () { t.classList.add('out'); setTimeout(function () { t.remove(); }, 400); }, 5000);
};

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

  /* ---------- Signed-in account in the shared header ---------- */
  if (header) {
    var currentUser = null;
    try {
      currentUser = JSON.parse(localStorage.getItem('foodiing-current-user') || 'null');
    } catch (error) {
      localStorage.removeItem('foodiing-current-user');
    }

    if (currentUser && currentUser.name) {
      header.querySelectorAll('a[href="login.html"]').forEach(function (link) {
        link.textContent = currentUser.name + '님';
        link.href = '#';
        link.setAttribute('aria-label', currentUser.name + '님 로그인됨');
        link.addEventListener('click', function (event) { event.preventDefault(); });
      });
      header.querySelectorAll('a[href="signup.html"]').forEach(function (link) {
        link.textContent = '로그아웃';
        link.href = '#';
        link.addEventListener('click', function (event) {
          event.preventDefault();
          localStorage.removeItem('foodiing-current-user');
          window.location.reload();
        });
      });
    }
  }

  /* ---------- Category filter (home + funding list) ---------- */
  var buttons = document.querySelectorAll('.cat[data-filter]');
  var cards = document.querySelectorAll('#cards .card');
  var empty = document.getElementById('empty');

  /* ---------- Funding card → project detail ---------- */
  cards.forEach(function (card) {
    var title = card.querySelector('h3');
    if (!title) return;
    card.setAttribute('role', 'link');
    card.setAttribute('tabindex', '0');
    card.setAttribute('aria-label', title.textContent.trim() + ' 상세 보기');
    card.classList.add('card-clickable');

    var openDetail = function () {
      var image = card.querySelector('.card-img img');
      var badge = card.querySelector('.badge');
      var desc = card.querySelector('.desc');
      var type = card.querySelector('.project-type');
      var progress = card.querySelector('.progress i');
      var status = card.querySelector('.fundrow strong');
      var days = card.querySelector('.fundrow span');
      var project = {
        title: title.textContent.trim(),
        image: image ? image.src : '',
        imageAlt: image ? image.alt : '',
        category: card.dataset.category || '푸드',
        badge: badge ? badge.textContent.trim() : '',
        description: desc ? desc.textContent.trim() : '',
        maker: type ? type.textContent.trim() : 'FOODiing 메이커',
        progress: progress ? progress.style.width : '68%',
        fundingText: status ? status.textContent.trim() : '680% 달성',
        remaining: days ? days.textContent.trim() : '12일 남음'
      };
      sessionStorage.setItem('foodiing-selected-project', JSON.stringify(project));
      window.location.href = 'funding-detail.html';
    };

    card.addEventListener('click', openDetail);
    card.addEventListener('keydown', function (event) {
      if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
        openDetail();
      }
    });
  });

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
