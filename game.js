const state = {
  speed: 240,
  ups: 380,
  enemies: [], 
  lifes: 3
};

const config = {
  type: Phaser.AUTO,
  width: 1000,
  height: 700,
  fps: {
    target: 60
  },
  backgroundColor: "b9eaff",
  physics: {
    default: "arcade",
    arcade: {
      gravity: {
        y: 800
      },
      enableBody: true,
    }
  },
  scale: {
    mode: Phaser.Scale.FIT,
    parent: "phaser-example",
    autoCenter: Phaser.Scale.CENTER_BOTH,
    width: 1000,
    height: 700
  },
  scene: [Level1, Level2, Level3, Credits],
};

const game = new Phaser.Game(config);