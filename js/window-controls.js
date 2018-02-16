/*globals friends,friendsList,remote */
class WindowControls {
  constructor(jquery) {
    this.$ = jquery
    if(process.platform != 'darwin') {
      $('#window-controls-darwin').remove()
      $('#controlsNav>ul').append(`
        <li class="nav-item ml-auto">
          <a class="nav-link window-control" href="#" id="minimize"><svg><use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="./icons/windows.svg#minimize-window"></use></svg></a>
        </li>
        <li class="nav-item">
          <a class="nav-link window-control" href="#" id="maximize"><svg><use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="./icons/windows.svg#maximize-window"></use></svg></a>
        </li>
        <li class="nav-item">
          <a class="nav-link window-control" href="#" id="quit"><svg><use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="./icons/windows.svg#close-window"></use></svg></a>
        </li>
      `)
    }
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

    remote.getCurrentWindow().on('maximize', () => {
      if(process.platform != 'darwin') {
        $('#maximize').html(`<svg><use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="./icons/windows.svg#restore-window"></use></svg>`)
      }
    })

    remote.getCurrentWindow().on('unmaximize', () => {
      if(process.platform != 'darwin') {
        $('#maximize').html(`<svg><use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="./icons/windows.svg#maximize-window"></use></svg>`)
      }
    })
  }
}

module.exports = WindowControls
