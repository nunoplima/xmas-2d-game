class Credits extends Phaser.Scene {
  constructor() {
    super({
      key: "Credits"
    })
  }

  preload() {
    this.load.spritesheet("santa_sled", "https://s3.amazonaws.com/codecademy-content/courses/learn-phaser/Codey+Tundra/santa_sled.png", {
      frameWidth: 81,
      frameHeight: 90
    });
  }

  create() {
    state.player = this.add.sprite(config.width / 2, config.height / 2, "santa_sled");
    state.gameover = this.add.text(200, 200, "Nice one!").setColor("black");
    state.gameover.setInteractive({
      cursor: "pointer"
    });
    state.gameover.on("pointerup", () => {
      console.log("here");
      this.scene.start("Level1");
    })

    this.anims.create({
      key: "sled",
      frames: this.anims.generateFrameNumbers("santa_sled"),
      frameRate: 10,
      repeat: -1
    })

    state.player.angle = 20;
  }

  update() {
    state.player.anims.play("sled", true);
  }
}