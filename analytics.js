(function () {
  const endpoint = 'https://ijzcyhvhiupoykvshrev.supabase.co/rest/v1/page_events';
  const apiKey = 'sb_publishable_urSkCjL_gp2r4EZz9-_uFg_fogz5hWx';
  const sessionKey = 'iap_analytics_session';

  function sessionId() {
    let value = localStorage.getItem(sessionKey);
    if (!value) {
      value = (crypto.randomUUID ? crypto.randomUUID() : Date.now() + '-' + Math.random().toString(16).slice(2));
      localStorage.setItem(sessionKey, value);
    }
    return value;
  }

  function track(eventName, metadata) {
    const payload = {
      event_name: eventName,
      page_path: location.pathname,
      session_id: sessionId(),
      metadata: metadata || {}
    };
    fetch(endpoint, {
      method: 'POST',
      keepalive: true,
      headers: {
        apikey: apiKey,
        Authorization: 'Bearer ' + apiKey,
        'Content-Type': 'application/json',
        Prefer: 'return=minimal'
      },
      body: JSON.stringify(payload)
    }).catch(function () {});
  }

  track('page_view', { title: document.title });

  document.addEventListener('click', function (event) {
    const link = event.target.closest('a[href*="pay.kiwify.com.br"]');
    if (!link) return;
    const href = link.getAttribute('href') || '';
    track('checkout_click', {
      product: href.includes('L4ESQEf') ? 'ebook' : (href.includes('jnEqhsr') ? 'programa_completo' : 'outro'),
      label: (link.textContent || '').trim().slice(0, 120)
    });
  }, true);
})();
