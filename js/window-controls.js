/*globals friends,friendsList,remote */
class WindowControls {
  constructor(jquery) {
    this.$ = jquery
  }

  start() {
    let $ = this.$

    $(document).on('click', '#quit', () => {
      friends.set(friendsList)
      remote.getCurrentWindow().close()
    })

    var maxed = false;
    $(document).on('click', '#maximize', () => {
      if(!maxed) {
        maxed = true
        remote.getCurrentWindow().maximize()
      } else {
        maxed = false
        remote.getCurrentWindow().unmaximize()
      }
    })

    $(document).on('click', '#minimize', () => {
      remote.getCurrentWindow().minimize()
    })

    if(process.platform != 'darwin') {
      $('#window-controls-darwin').remove()
      $('#controlsNav>ul').append(`
        <li class="nav-item ml-auto">
          <a class="nav-link window-control" href="#" id="minimize">&#9866;</a>
        </li>
        <li class="nav-item">
          <a class="nav-link window-control" href="#" id="maximize">&#9744;</a>
        </li>
        <li class="nav-item">
          <a class="nav-link window-control" href="#" id="quit">&#9587;</a>
        </li>
      `)
    }
  }
}

module.exports = WindowControls
