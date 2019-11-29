class Credits extends Phaser.Scene {
  constructor() {
    super({
      key: "Credits"
    })
  }

  preload() {
    state.bgColor = this.add.rectangle(0, 0, config.width, config.height, 0x00AEE7).setOrigin(0, 0);
    this.load.image("tree", "assets/xmastree.png");
    this.createStars();
  }
  
  create() {
    this.add.image(config.width / 2, config.height / 2 + 150 , "tree").setScale(.35);
    state.overText = this.add.bitmapText(game.config.width / 2 - 400, game.config.height / 2 - 250, "myfont", "You saved Christmas, good job!", 50); 
    state.middleText = this.add.bitmapText(game.config.width / 2 - 390, game.config.height / 2 - 150, "myfont", "Santa recovered all the presents", 44); 
    state.insertText = this.add.bitmapText(game.config.width / 2 - 220, game.config.height / 2 + 50, "myfont", "Please, insert coin...", 44); 
    state.insertText.on("pointerup", () => this.scene.start("Level1"));
    state.overText.setScrollFactor(0);
    state.middleText.setScrollFactor(0);
    state.insertText.setScrollFactor(0);
    state.lifes = 3;
    state.insertText.setInteractive({ cursor: "pointer" });
  }

  createStars() {
    state.stars = [];
    function getStarPoints() {
      const color = 0xffffff;
      return {
        x: Math.floor(Math.random() * 900),
        y: Math.floor(Math.random() * config.height),
        radius: Math.floor(Math.random() * 3),
        color,
      }
    }
    for (let i = 0; i < 200; i++) {
      const { x, y, radius, color} = getStarPoints();
      const star = this.add.circle(x, y, radius, color)
      star.setScrollFactor(Math.random() * .1);
      state.stars.push(star);
    }
  }
  
  update() {
  }
}