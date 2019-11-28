// class Level3 extends Level {
//   constructor() {
//     super("Level3")
//     this.heights = [6, null, 6, 4, 6, 4, 5, null, 4];
//     this.weather = "night";
//   }
// }

// class Level4 extends Level {
//   constructor() {
//     super("Level4")
//     this.heights = [4, null, 3, 6, null, 6, null, 5, 4];
//     this.weather = "morning";
//   }
// }

const state = {
  speed: 240,
  ups: 380,
  enemies: [], 
  lifes: 3
};

console.log(window.innerWidth)
const config = {
  type: Phaser.AUTO,
  width: 450,
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
    width: 450,
    height: 700
  },
  scene: [Level1]
};

const game = new Phaser.Game(config);