/* Mwalimu Family: client glue for forms, newsletter, assistant and offline notice.
   Set window.MF_API in index.html (e.g. "https://api.mwalimufamily.com" or "" for same origin
   when the worker is routed at /api/*). While MF_API is empty, everything falls back to WhatsApp,
   exactly as the original page did. */
(function () {
  'use strict';
  var API = (window.MF_API || '').replace(/\/$/, '');
  var WA = '254715363944';
  var hasApi = !!API;

  function el(tag, css, html) { var n = document.createElement(tag); if (css) n.style.cssText = css; if (html) n.innerHTML = html; return n; }

  var toastNode = null;
  function toast(html) {
    if (toastNode) toastNode.remove();
    toastNode = el('div',
      'position:fixed;left:50%;transform:translateX(-50%);bottom:calc(1rem + env(safe-area-inset-bottom,0px));z-index:500;' +
      'max-width:min(92vw,32rem);background:#1a3d1b;color:#fff;padding:.9rem 1.1rem;border-radius:12px;box-shadow:0 6px 24px rgba(0,0,0,.35);font-size:.95rem;line-height:1.5');
    toastNode.setAttribute('role', 'status');
    toastNode.innerHTML = html + ' <button type="button" aria-label="Dismiss" style="margin-left:.5rem;background:none;border:0;color:#fff;font-size:1.2rem;cursor:pointer">×</button>';
    toastNode.querySelector('button').onclick = function () { toastNode.remove(); toastNode = null; };
    toastNode.querySelectorAll('a').forEach(function (a) { a.style.color = '#f4a261'; a.style.textDecoration = 'underline'; });
    document.body.appendChild(toastNode);
  }

  function post(path, body) {
    return fetch(API + path, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body)
    }).then(function (r) {
      return r.json().catch(function () { return {}; }).then(function (j) {
        if (!r.ok || !j.ok) { var e = new Error('api'); e.status = r.status; throw e; }
        return j;
      });
    });
  }

  // Used by the five forms (job, advert, tutor request, tutor application, notice)
  window.MF = {
    submit: function (kind, title, ref, fields, waUrl) {
      if (!hasApi) { window.open(waUrl, '_blank'); return; }
      post('/api/submit', { type: kind, ref: ref, fields: fields, consent: true, website: '' })
        .catch(function (e) {
          var why = e.status === 429 ? 'Too many requests just now.' : 'We could not send your details.';
          toast(why + ' <a href="' + waUrl + '" target="_blank" rel="noopener">Send on WhatsApp instead</a> (reference ' + ref + ').');
        });
    }
  };

  // Assistant: the page already calls window.MF_AI_ENDPOINT when it is set
  if (hasApi) window.MF_AI_ENDPOINT = API + '/api/chat';

  // Newsletter
  var btn = document.getElementById('mfsb');
  if (btn) {
    var status = document.getElementById('mfss');
    var say = function (t, bad) { status.style.color = bad ? '#b3261e' : 'inherit'; status.innerHTML = t; };
    btn.addEventListener('click', function () {
      var name = (document.getElementById('nm').value || '').trim();
      var email = (document.getElementById('em').value || '').trim();
      var ok = document.getElementById('mfck').checked;
      var hp = document.getElementById('mfhp').value;
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email)) return say('Please enter a valid email address.', true);
      if (!ok) return say('Please tick the box to agree.', true);
      var wa = 'https://wa.me/' + WA + '?text=' + encodeURIComponent('Please add me to Mwalimu Family email updates. Email: ' + email);
      if (!hasApi) { window.open(wa, '_blank'); return say('Opening WhatsApp so you can confirm your sign-up.'); }
      btn.disabled = true; say('Subscribing…');
      post('/api/subscribe', { name: name, email: email, consent: true, website: hp })
        .then(function () { say('Thank you. You are on the list.'); document.getElementById('em').value = ''; })
        .catch(function () { say('We could not subscribe you just now. <a href="' + wa + '" target="_blank" rel="noopener" style="text-decoration:underline">Sign up on WhatsApp instead</a>.', true); })
        .then(function () { btn.disabled = false; });
    });
  }

  // Footer privacy link
  var bot = document.querySelector('footer .bot p');
  if (bot) { var a = el('a'); a.href = 'privacy.html'; a.textContent = 'Privacy'; bot.appendChild(document.createTextNode(' \u00a0 ')); bot.appendChild(a); }

  // Offline notice
  var offBar = null;
  function net() {
    if (!navigator.onLine && !offBar) {
      offBar = el('div', 'position:fixed;top:0;left:0;right:0;z-index:400;background:#f4a261;color:#1a1a1a;text-align:center;font-size:.9rem;padding:.35rem;padding-top:calc(.35rem + env(safe-area-inset-top,0px))',
        'You are offline. Showing saved content; forms and the assistant need data.');
      document.body.appendChild(offBar);
    } else if (navigator.onLine && offBar) { offBar.remove(); offBar = null; }
  }
  window.addEventListener('online', net); window.addEventListener('offline', net); net();
})();
