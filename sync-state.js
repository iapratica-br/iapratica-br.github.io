(function () {
  const TASKS_KEY = 'iap_tasks';
  const LEADS_KEY = 'iap_leads';
  const READY_KEY = 'iap_remote_state_loaded';

  const readJson = (key, fallback) => {
    try { return JSON.parse(localStorage.getItem(key) || JSON.stringify(fallback)); }
    catch (_) { return fallback; }
  };

  async function waitForAccount() {
    for (let i = 0; i < 40; i += 1) {
      if (window.IAP_CLIENT && window.IAP_USER_ID) {
        return { client: window.IAP_CLIENT, userId: window.IAP_USER_ID };
      }
      await new Promise(resolve => setTimeout(resolve, 250));
    }
    return null;
  }

  async function start() {
    const account = await waitForAccount();
    if (!account) return;
    const { client, userId } = account;
    const localState = {
      tasks: readJson(TASKS_KEY, [false, false, false, false]),
      leads: readJson(LEADS_KEY, [])
    };

    const { data, error } = await client
      .from('user_state')
      .select('tasks,leads')
      .eq('user_id', userId)
      .maybeSingle();

    if (error) return;

    if (!data) {
      await client.from('user_state').upsert({
        user_id: userId,
        tasks: localState.tasks,
        leads: localState.leads,
        updated_at: new Date().toISOString()
      });
    } else if (!sessionStorage.getItem(READY_KEY)) {
      localStorage.setItem(TASKS_KEY, JSON.stringify(data.tasks || localState.tasks));
      localStorage.setItem(LEADS_KEY, JSON.stringify(data.leads || localState.leads));
      sessionStorage.setItem(READY_KEY, '1');
      location.reload();
      return;
    }

    let lastSaved = '';
    async function sync() {
      const state = {
        tasks: readJson(TASKS_KEY, [false, false, false, false]),
        leads: readJson(LEADS_KEY, [])
      };
      const signature = JSON.stringify(state);
      if (signature === lastSaved) return;
      const { error: saveError } = await client.from('user_state').upsert({
        user_id: userId,
        tasks: state.tasks,
        leads: state.leads,
        updated_at: new Date().toISOString()
      });
      if (!saveError) lastSaved = signature;
    }

    await sync();
    setInterval(sync, 2000);
    document.addEventListener('visibilitychange', () => {
      if (document.visibilityState === 'hidden') sync();
    });
  }

  start();
})();
