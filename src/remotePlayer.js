export default class RemotePlayer extends Phaser.GameObjects.Sprite {
  
  constructor(config) {
    super(config.scene, config.x, config.y, "doux");
    this.dato = config.data;
    config.scene.add.existing(this);
    this.characterScale = 5
    this.meatScale = 4
    this.bombScale = 4
    this.getBounds()
    this.setScale(this.characterScale)
    this.setSize(13, 17, 0, 0)
    //this.socket = io.connect(window.gameRoomUrl);
    //window.gameRoomSocket.on("connect", (socket) => {
      console.log("Remote Player ( "+ this.dato.nickname +") SocketIO connected");
      window.gameRoomSocket.on("remote player moved", e => {
        let myRemotePlayer = e
        if (this.dato.nickname === myRemotePlayer.nickname){ //TODO: we use the name for now
            this.x = myRemotePlayer.x
            this.y = myRemotePlayer.y
        }
      });
    //})  
  }
  
  preUpdate () {
    this.update(); // Comment this and update will stop working
  }
  update(){
    this.anims.play('run', true)
  }
}
