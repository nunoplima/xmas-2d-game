class Level2 extends Level {
  constructor() {
    super("Level2")
    this.heights = [8, null, null, null, null, null, 10, 10, 10, 10, 8, 7, 7, 8, 10, 10, 10, 10, 10, 4];
    this.boxesCoord = [
      [440, 458],
      [640, 358],
      [840, 458],
      [1240, 558],
      [1750, 580],
      [2000, 580],
      [3500, 558],
      [3800, 458],
      [4000, 358],
    ]
    this.bgs = ["bg4", "bg2", "bg3"];
    this.weather = "afternoon";
  }
}