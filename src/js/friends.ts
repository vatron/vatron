import Store from './store'

export default class Friends {
  private friendsListJSON: Store
  private friendsList: any

  constructor() {
    this.friendsListJSON = new Store({
      configName: 'friends-list',
      defaults: {
        friends: [
          999999 // unused VATSIM ID, just to populate the file with dummy data
        ]
      }
    })

    this.friendsList = this.friendsListJSON.get('friends')
  }

  public get() {
    return this.friendsList
  }

  public set(newList: object): void {
    this.friendsListJSON.set('friends', newList)
  }

  public rebuild(newList: object): void {
    this.friendsList = newList
  }

  isFriend(id: number): boolean {
    return this.friendsList.includes(id)
  }
}
