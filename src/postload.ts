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

        const save = {
          slots: this.slots.map((slot) => slot.data),
          autoSlot: this.autoSlot != null ? this.autoSlot.data : null,
          globals,
          lastSlot: this.lastUsedSlot,
        };
        // TODO: Add the API URL after finishing it
        fetch('', {
          method: 'post',
          headers: {
            Accept: 'application/json, text/plain, */*',
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(save),
        });
        return this.parent();
      },
    });
  });
