const $ = jQuery = require('jquery')

class WindowControls {
  constructor(jquery) {
    this.$ = jquery
  }

  start() {
    let $ = this.$

    $("#quit").on('click', () => {
      friends.set(friendsList)
      remote.getCurrentWindow().close()
    })

    var maxed = false;
    $("#maximize").on('click', () => {
      if(!maxed) {
        maxed = true
        remote.getCurrentWindow().maximize()
      } else {
        maxed = false
        remote.getCurrentWindow().unmaximize()
      }
    })

    $("#minimize").on('click', () => {
      remote.getCurrentWindow().minimize()
    })

    if(process.platform == 'darwin') {
      $('#window-controls').remove()
    } else {
      $('#window-controls-darwin').remove()
    }
  }
}

module.exports = WindowControls
