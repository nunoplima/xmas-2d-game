class Level3 extends Level {
  constructor() {
    super("Level3")
    this.heights = [8, null, 4, null, null, 10, 10, 10, 10, 10, 8, 7, 7, 8, 10, 10, 10, 10, 10, 10];
    this.boxesCoord = [
      [440, 660],
      [640, 680],
      [840, 660],
      [1240, 558],
      [1750, 580],
      [2000, 580],
      [3500, 558],
      [3800, 458],
      [4000, 358],
    ]
    this.bgs = ["bg1", "bg5", "bg6"];
    this.weather = "morning";
  }
}