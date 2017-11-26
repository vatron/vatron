const Store = require('./store.js')

class Settings {
  constructor() {
    this.settings = new Store({
      configName: 'settings',
      defaults: {
        dataRefresh: 60000
      }
    })

    $('#settingsRefreshInterval').val(this.settings.get('dataRefresh')/1000)
    $('#settingsRefreshInterval').on('change paste keyup', () => {
      this.settings.set('dataRefresh', $('#settingsRefreshInterval').val()*1000)
      $('#saveStatus').html('Saved!')
    })
  }
}

module.exports = Settings
