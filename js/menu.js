const {remote} = require('electron')
const {app, Menu} = remote

const template = [
  {
    label: 'Edit',
    submenu: [
      {role: 'undo'},
      {role: 'redo'},
      {type: 'separator'},
      {role: 'cut'},
      {role: 'copy'},
      {role: 'paste'},
      {role: 'pasteandmatchstyle'},
      {role: 'delete'},
      {role: 'selectall'}
    ]
  },
  {
    label: 'View',
    submenu: [
      {
        label: 'Reload Data',
        accelerator: 'CmdOrCtrl+R',
        click () {
          /*jshint -W117*/
          updateMap()
          /*jshint +W117*/
        }
      },
      {
        role: 'reload',
        label: 'Soft Restart',
        accelerator: 'Shift+CmdOrCtrl+R'
      },
      {role: 'toggledevtools'},
      {type: 'separator'},
      {role: 'resetzoom'},
      {role: 'zoomin'},
      {role: 'zoomout'},
      {type: 'separator'},
      {role: 'togglefullscreen'}
    ]
  },
  {
    role: 'window',
    submenu: [
      {role: 'minimize'},
      {role: 'close'}
    ]
  },
  {
    role: 'help',
    submenu: [
      {
        label: 'Vatron Website',
        click () { require('electron').shell.openExternal('https://andrewward2001.com/vatron/') }
      },
      {
        label: 'Vatron Repository',
        click () { require('electron').shell.openExternal('https://github.com/andrewward2001/vatron') }
      },
      {
        label: 'File a Bug Report',
        click () { require('electron').shell.openExternal('https://github.com/andrewward2001/vatron/issues') }
      }
    ]
  }
]

if (process.platform === 'darwin') {
  template.unshift({
    label: app.getName(),
    submenu: [
      {
        click () { $('#about').modal('show') },
        label: 'About Vatron'
      },
      {type: 'separator'},
      {
        label: 'Preferences...',
        click () { $('#settings').modal('show') },
        accelerator: 'CmdOrCtrl+,'
      },
      {type: 'separator'},
      {role: 'services', submenu: []},
      {type: 'separator'},
      {role: 'hide'},
      {role: 'hideothers'},
      {role: 'unhide'},
      {type: 'separator'},
      {role: 'quit'}
    ]
  })

  // Edit menu
  template[1].submenu.push(
    {type: 'separator'},
    {
      label: 'Speech',
      submenu: [
        {role: 'startspeaking'},
        {role: 'stopspeaking'}
      ]
    }
  )

  // Window menu
  template[3].submenu = [
    {role: 'close'},
    {role: 'minimize'},
    {role: 'zoom'},
    {type: 'separator'},
    {role: 'front'}
  ]

  const menu = Menu.buildFromTemplate(template)
  Menu.setApplicationMenu(menu)
}
