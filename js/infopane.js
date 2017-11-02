class InfoPane {
  constructor(type) {
    this.type = type
  }

  build(c, addFriendStr) {
    if(this.type == "atc") {
      let name = c.name.split(' ')
      let splitAtis = c.atis.split('^�') // meant to be that weird question mark character
      let finalAtis = ""
      for(var i = 0; i < splitAtis.length; i++) {
        finalAtis += '<p class="atis">' + splitAtis[i] + '</p>'
      }

      return `
      <div class="col-6 col-md-4 col-xl-3 bg-dark" id="fltInfo">
        <a class="nav-link float-right white" href="#" id="closeFltInfo">&#9932;</a>
        <h4 class="mb-4 mt-1">ATC Info</h4>
        <div class="card mb-3 bg-dark">
          <div class="card-body">
            <h4 class="card-title">${c.callsign}</h4>
            <h6 class="card-subtitle mb-2 text-muted">${name[0]} ${name[1]} (${c.cid})</h6>
            <h5 class="card-text">${c.frequency}</h5>
          </div>
          <table class="table">
            <tbody>
              <tr>
                <td colspan="2">
                  <span class="text-muted">ATIS Message</span><br>
                  <span>${finalAtis}</span>
                </td>
              </tr>
              <tr>
                <td colspan="2">
                  <span class="text-muted">Time online</span><br>
                  <span>Online since ${c.timeLogon.substring(8, 10) + ':' + c.timeLogon.substring(10, 12)}</span>
                </td>
              </tr>
            </tbody>
          </table>
          <div class="card-body pt-0">
            <a href="https://stats.vatsim.net/search_id.php?id=${c.cid}" class="card-link">View Stats</a>
            ${addFriendStr}
          </div>
        </div>
      </div>
      `
    } else {
      var name = c.name.split(' ')

      return `
      <div class="col-6 col-md-4 col-xl-3 bg-dark" id="fltInfo">
        <a class="nav-link float-right white" href="#" id="closeFltInfo">&#9932;</a>
        <h4 class="mb-4 mt-1">Flight Info</h4>
        <div class="card mb-3 bg-dark">
          <div class="card-body">
            <h4 class="card-title">${c.callsign}</h4>
            <h6 class="card-subtitle mb-2 text-muted">${name[0]} ${name[1]} (${name[2]}, ${c.cid})</h6>
            <div class="card-text d-flex justify-content-spc"><h5>${c.depApt}</h5><h5>&rarr;</h5><h5>${c.arrApt}</h5></div>
          </div>
          <table class="table">
            <tbody>
              <tr>
                <td colspan="2">
                  <span class="text-muted">Aboard</span><br>
                  <span>${c.aircraft}</span>
                </td>
              </tr>
              <tr>
                <td>
                  <span class="text-muted">Altitude</span><br>
                  <span>${c.altitude}</span>
                </td>
                <td>
                  <span class="text-muted">Planned Altitude</span><br>
                  <span>${c.plnAltitude}</span>
                </td>
              </tr>
              <tr>
                <td>
                  <span class="text-muted">Ground Speed</span><br>
                  <span>${c.groundspeed}</span>
                </td>
                <td>
                  <span class="text-muted">Planned TAS</span><br>
                  <span>${c.tas}</span>
                </td>
              </tr>
              <tr>
                <td>
                  <span class="text-muted">Latitude</span><br>
                  <span>${c.lat}</span>
                </td>
                <td>
                  <span class="text-muted">Longitude</span><br>
                  <span>${c.lng}</span>
                </td>
              </tr>
              <tr>
                <td>
                  <span class="text-muted">Heading</span><br>
                  <span>${c.heading}</span>
                </td>
                <td>
                  <span class="text-muted">Squawk</span><br>
                  <span>${c.xpdr}</span>
                </td>
              </tr>
              <tr>
                <td colspan="2">
                  <span class="text-muted">Planned Route</span><br>
                  <span>${c.route}</span>
                </td>
              </tr>
            </tbody>
          </table>
          <div class="card-body pt-0">
            <a href="https://stats.vatsim.net/search_id.php?id=${c.cid}" class="card-link">View Stats</a>
            ${addFriendStr}
          </div>
        </div>
      </div>
      `
    }
  }
}

module.exports = InfoPane
