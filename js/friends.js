const Store = require('./store.js')

class Friends {
  constructor() {
    let friendsListJSON = new Store({
      configName: 'friends-list',
      defaults: {
        friends: [
          999999 // unused VATSIM ID, just to populate the file with dummy data
        ]
      }
    })

    this.friendsList = friendsListJSON.get('friends')
  }

  get list() {
    return this.friendsList
  }

  set set(newList) {
    friendsListJSON.set('friends', newList)
  }

  set rebuild(newList) {
    this.friendsList = newList
  }

  // @return: boolean
  isFriend(id) {
    return friendsList.includes(parseInt(id)) // parseInt makes sure it's an int no matter if we got an int in the first place
  }
}

module.exports = Friends
