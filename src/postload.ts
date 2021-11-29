function doAsk() {
  let email = prompt("What's your email? (cc-saves.alyxia.dev)");
  let password = prompt("What's your password? (cc-saves.alyxia.dev)");
  return {
    email: email,
    password: password,
  };
}

async function callLogin() {
  let data = doAsk();
  if (data.email == null || data.password == null) {
    data = doAsk();
  }
  return await (
    await fetch('https://cc-saves.alyxia.dev/api/login', {
      method: 'post',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    })
  ).json();
}

function setData(data: any) {
  localStorage.setItem('api_token', data.api_token);
}

async function saveToCloud(globals: ig.Storage.GlobalsData, storage: ig.Storage) {
  const user = await callLogin();
  setData(user.data);

  let api_token = localStorage.getItem('api_token');

  let save = {
    slots: storage.slots.map((slot) => slot.data),
    autoSlot: storage.autoSlot != null ? storage.autoSlot.data : null,
    globals,
    lastSlot: storage.lastUsedSlot,
  };
  await fetch('https://cc-saves.alyxia.dev/api/user', {
    method: 'post',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      savefile: save,
      api_token: api_token,
    }),
  });
}

ig.module('cloudsave')
  .requires('impact.feature.storage.storage')
  .defines(() => {
    ig.Storage.inject({
      _saveToStorage() {
        let globals = {} as ig.Storage.GlobalsData;
        for (let listener of this.listeners) {
          if (listener.onStorageGlobalSave != null) {
            listener.onStorageGlobalSave(globals);
          }
        }

        saveToCloud(globals, this);
        return this.parent();
      },
    });
  });
