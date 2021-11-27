ig.module('cloudsave')
  .requires('impact.feature.storage.storage')
  .defines(() => {
    ig.Storage.inject({
      _saveToStorage() {
        console.log(ig.storage.slots[0].data);
        return this.parent();
      },
    });
  });
