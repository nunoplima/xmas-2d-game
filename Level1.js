class Level1 extends Level {
  constructor() {
    super("Level1")
    this.heights = [8, 10, 10, null, 10, 8, null, null, 10, 10, 8, 7, 7, 8, 10, 10, 10, 10, 10, 4];
    this.boxesCoord = [
      [540, 558],
      [1040, 658],
      [1440, 558],
      [1540, 458],
      [1640, 358],
      [3600, 558],
      [3800, 458],
      [4000, 358],
    ]
    this.bgs = ["bg1", "bg2", "bg3"];
    this.weather = "twilight";
  }
}
