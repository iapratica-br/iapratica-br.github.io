(() => {
  const endpoint = 'https://ijzcyhvhiupoykvshrev.supabase.co/rest/v1/page_events';
  const key = window.IAP_CONFIG?.supabaseAnonKey;
  if (!key || navigator.doNotTrack === '1') return;
  const params = new URLSearchParams(location.search);
  const campaign = JSON.parse(sessionStorage.getItem('iap_campaign') || '{}');
  ['utm_source','utm_medium','utm_campaign','utm_content','utm_term'].forEach(name => {
    if (params.get(name)) campaign[name] = params.get(name).slice(0,120);
  });
  sessionStorage.setItem('iap_campaign', JSON.stringify(campaign));
  let sessionId = localStorage.getItem('iap_metrics_session');
  if (!sessionId) {
    sessionId = crypto.randomUUID ? crypto.randomUUID() : `${Date.now()}-${Math.random().toString(16).slice(2)}`;
    localStorage.setItem('iap_metrics_session', sessionId);
  }
  const send = event_name => fetch(endpoint, {
    method: 'POST', keepalive: true,
    headers: {'Content-Type':'application/json', apikey:key, Authorization:`Bearer ${key}`},
    body: JSON.stringify({event_name, page_path:location.pathname, session_id:sessionId, metadata:{...campaign,title:document.title}})
  }).catch(() => {});
  send('page_view');
  document.addEventListener('click', event => {
    const link = event.target.closest('a[href*="pay.kiwify.com.br"]');
    if (link) send('checkout_click');
  });
})();
