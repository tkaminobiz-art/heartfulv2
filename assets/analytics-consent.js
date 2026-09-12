(function () {
  'use strict';

  var measurementId = 'G-XVH8BK5BDM';
  var consentKey = 'heartful.analytics.v1';
  var disableKey = 'ga-disable-' + measurementId;
  var cookiePrefix = 'hfga';
  var configured = false;
  var pageViewSent = false;
  var choice = null;
  var panel;
  var settings;
  var status;
  var notice;
  var accept;
  var decline;
  var close;

  // This flag belongs only to GA4. Do not alter the existing GT/AW or global consent.
  if (window.heartfulAnalyticsConsentLoaded) return;
  window.heartfulAnalyticsConsentLoaded = true;
  window[disableKey] = true;

  // GA may buffer a hit before ga-disable is set. Check this destination again
  // at the browser transport boundary so withdrawal also stops buffered hits.
  // Every other destination (including existing Ads) is passed through unchanged.
  function blockedGARequest(value) {
    if (!window[disableKey]) return false;
    try {
      var url = new URL(typeof value === 'string' || value instanceof URL ? value : value.url, location.href);
      return url.searchParams.get('tid') === measurementId;
    } catch (_) { return false; }
  }
  if (navigator.sendBeacon) {
    var sendBeacon = navigator.sendBeacon;
    navigator.sendBeacon = function (url, data) {
      return blockedGARequest(url) ? true : sendBeacon.call(this, url, data);
    };
  }
  if (window.fetch) {
    var fetch = window.fetch;
    window.fetch = function (input, init) {
      return blockedGARequest(input) ? Promise.resolve(new Response(null, { status: 204 })) : fetch.call(this, input, init);
    };
  }
  var xhrUrls = new WeakMap();
  var xhrOpen = XMLHttpRequest.prototype.open;
  var xhrSend = XMLHttpRequest.prototype.send;
  XMLHttpRequest.prototype.open = function (method, url) {
    xhrUrls.set(this, url);
    return xhrOpen.apply(this, arguments);
  };
  XMLHttpRequest.prototype.send = function () {
    if (blockedGARequest(xhrUrls.get(this))) { this.abort(); return; }
    return xhrSend.apply(this, arguments);
  };
  var imageSrc = Object.getOwnPropertyDescriptor(HTMLImageElement.prototype, 'src');
  if (imageSrc && imageSrc.configurable && imageSrc.set) {
    Object.defineProperty(HTMLImageElement.prototype, 'src', {
      configurable: imageSrc.configurable,
      enumerable: imageSrc.enumerable,
      get: imageSrc.get,
      set: function (url) { if (!blockedGARequest(url)) imageSrc.set.call(this, url); }
    });
  }

  function readChoice() {
    try {
      var value = window.localStorage.getItem(consentKey);
      return value === 'granted' || value === 'denied' ? value : null;
    } catch (_) { return null; }
  }

  function clearAnalyticsCookies() {
    document.cookie.split(';').forEach(function (cookie) {
      var name = cookie.split('=')[0].trim();
      if (name.indexOf(cookiePrefix + '_') !== 0) return;
      ['', location.hostname, '.' + location.hostname, '.heartfulclean.jp'].forEach(function (domain) {
        document.cookie = name + '=; Max-Age=0; Path=/; SameSite=Lax; Secure' +
          (domain ? '; Domain=' + domain : '');
      });
    });
  }

  function stopAnalytics() {
    window[disableKey] = true;
    clearAnalyticsCookies();
  }

  function startAnalytics() {
    if (choice !== 'granted' || location.origin !== 'https://www.heartfulclean.jp' ||
        !['/', '/index.html', '/oosaka/', '/oosaka/index.html'].includes(location.pathname) ||
        typeof window.gtag !== 'function') return;

    window[disableKey] = false;
    if (!configured) {
      configured = true;
      window.gtag('config', measurementId, {
        send_page_view: false,
        groups: 'heartful_analytics',
        allow_google_signals: false,
        allow_ad_personalization_signals: false,
        cookie_prefix: cookiePrefix,
        cookie_domain: 'www.heartfulclean.jp',
        cookie_path: '/',
        cookie_flags: 'SameSite=Lax;Secure',
        page_location: location.origin + location.pathname,
        page_referrer: '',
        page_title: document.title,
        ignore_referrer: true,
        campaign_id: '',
        campaign_source: '',
        campaign_medium: '',
        campaign_name: '',
        campaign_term: '',
        campaign_content: '',
        linker: { accept_incoming: false }
      });
    }
    if (!pageViewSent) {
      pageViewSent = true;
      window.gtag('event', 'page_view', {
        send_to: measurementId,
        page_location: location.origin + location.pathname,
        page_referrer: '',
        page_title: document.title
      });
    }
  }

  function render() {
    status.textContent = choice === 'granted' ? '現在、計測に同意しています。' :
      choice === 'denied' ? '現在、計測に同意していません。' : '同意するまで、この計測は始まりません。';
    accept.hidden = choice === 'granted';
    decline.textContent = choice === 'granted' ? '同意を取り消す' : '同意しない';
  }

  function showPanel(focus) {
    render();
    panel.hidden = false;
    settings.setAttribute('aria-expanded', 'true');
    if (focus) (choice === 'granted' ? decline : accept).focus();
  }

  function hidePanel() {
    panel.hidden = true;
    settings.setAttribute('aria-expanded', 'false');
    settings.focus({ preventScroll: true });
  }

  function choose(value) {
    choice = value;
    if (value !== 'granted') stopAnalytics();
    var saved = true;
    try { window.localStorage.setItem(consentKey, value); } catch (_) {
      saved = false;
      // A quota error must not leave a previous grant in storage after withdrawal.
      try { window.localStorage.removeItem(consentKey); } catch (_) { /* Storage unavailable. */ }
    }
    if (value === 'granted') startAnalytics();
    render();
    notice.textContent = saved ? '' : '設定を保存できませんでした。次のページで、もう一度確認します。';
    if (saved) hidePanel();
  }

  choice = readChoice();
  if (choice !== 'granted') clearAnalyticsCookies();

  // Revocation propagates between tabs without changing any Ads state.
  window.addEventListener('storage', function (event) {
    if (event.key !== consentKey && event.key !== null) return;
    choice = readChoice();
    if (choice !== 'granted') stopAnalytics();
    if (panel) render();
  });
  window.addEventListener('pageshow', function () {
    choice = readChoice();
    if (choice !== 'granted') stopAnalytics();
    if (panel) render();
  });

  document.addEventListener('DOMContentLoaded', function () {
    settings = document.createElement('button');
    settings.type = 'button';
    settings.className = 'hf-analytics-settings';
    settings.textContent = '利用状況の計測設定';
    settings.setAttribute('aria-controls', 'hf-analytics-panel');
    settings.setAttribute('aria-expanded', 'false');

    panel = document.createElement('section');
    panel.id = 'hf-analytics-panel';
    panel.className = 'hf-analytics-panel';
    panel.hidden = true;
    panel.setAttribute('aria-labelledby', 'hf-analytics-title');
    panel.innerHTML = '<h2 id="hf-analytics-title">Google Analyticsの利用について</h2>' +
      '<p>サイトの改善のため、ページの閲覧状況を集計します。同意すると、Cookieを使用し、閲覧情報をGoogleに送信します。設定はいつでも変更できます。</p>' +
      '<p class="hf-analytics-scope">この設定は、Google Analyticsによる利用状況の計測に適用されます。選択した設定は、このブラウザーに保存します。</p>' +
      '<p><a href="https://policies.google.com/technologies/partner-sites" target="_blank" rel="noopener noreferrer">Googleによるデータの利用</a></p>' +
      '<p class="hf-analytics-status" role="status"></p>' +
      '<div class="hf-analytics-actions"><button type="button" data-choice="granted">同意する</button>' +
      '<button type="button" data-choice="denied">同意しない</button></div>' +
      '<p class="hf-analytics-notice" role="status"></p>' +
      '<button type="button" class="hf-analytics-close">閉じる</button>';
    document.body.append(settings, panel);
    status = panel.querySelector('.hf-analytics-status');
    notice = panel.querySelector('.hf-analytics-notice');
    accept = panel.querySelector('[data-choice="granted"]');
    decline = panel.querySelector('[data-choice="denied"]');
    close = panel.querySelector('.hf-analytics-close');
    accept.addEventListener('click', function () { choose('granted'); });
    decline.addEventListener('click', function () { choose('denied'); });
    close.addEventListener('click', hidePanel);
    settings.addEventListener('click', function () { panel.hidden ? showPanel(true) : hidePanel(); });
    panel.addEventListener('keydown', function (event) {
      if (event.key === 'Escape') { event.preventDefault(); hidePanel(); }
    });
    if (choice === null) showPanel(false);
    if (choice === 'granted') startAnalytics();
  });
})();
