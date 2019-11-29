class Level extends Phaser.Scene {
  constructor(key) {
    super({ key });
    this.levelKey = key
    this.nextLevel = {
      "Level1": "Level2",
      "Level2": "Level3",
      "Level3": "Credits",
    }
  }

  preload() {
    this.load.bitmapFont("myfont", "assets/font/font.png", "assets/font/font.fnt");
    this.load.image("arrow", "assets/arrow.png");
    this.load.image("box", "assets/square.png")
    this.load.image("box1", "assets/square1.png")
    this.load.image("gifts", "assets/gifts.png")
    this.load.spritesheet("exit", "https://s3.amazonaws.com/codecademy-content/courses/learn-phaser/Cave+Crisis/cave_exit.png", { frameWidth: 60, frameHeight: 70 });
    this.load.image("platform", "assets/platform.png");
    this.load.image("snowflake", "assets/snowflake.png");
    this.load.spritesheet("snowman", "assets/snowman.png", { frameWidth: 50, frameHeight: 70 });
    this.load.image("bullet", "https://s3.amazonaws.com/codecademy-content/courses/learn-phaser/Bug+Invaders/bugPellet.png");
    this.load.spritesheet("hero", "assets/santaspritesheet.png", { frameWidth: 80, frameHeight: 99 });
    this.load.spritesheet("boss", "assets/bossspritesheet1.png", { frameWidth: 75, frameHeight: 78 });
    this.load.image("bg1", "assets/mountain.png");
    this.load.image("bg2", "assets/trees.png");
    this.load.image("bg3", "assets/snow.png");
    this.load.image("bg4", "assets/castle.png");
    this.load.image("bg6", "assets/sanddunes.png");
  }

  create() {
    state.active = true

    this.anims.resumeAll();
    
    state.bgColor = this.add.rectangle(0, 0, config.width, config.height, 0x00AEE7).setOrigin(0, 0);

    this.createParallaxBackgrounds(this.bgs[0], this.bgs[1], this.bgs[2]);

    state.player = this.physics.add.sprite(125, 450, "hero").setScale(.7);
    // state.player = this.physics.add.sprite(4000, 100, "hero").setScale(.7);

    state.scoreText = this.add.text(10, 10, `Lifes: ${state.lifes}`, { fontFamily: "Tahoma", fontSize: 24, color: "#236300" })
    state.scoreText.setScrollFactor(0);
    state.score1Text = this.add.text(10, 30, `Level: ${this.levelKey.substring(this.levelKey.length - 1)}`, { fontFamily: "Tahoma", fontSize: 24, color: "#236300" })
    state.score1Text.setScrollFactor(0);

    // platforms
    state.platforms = this.physics.add.staticGroup();
    
    // start flag
    this.add.image(30, 515, "arrow").setScale(.4);

    // boxes  
    state.boxes = this.physics.add.staticGroup(); 
    
    // level end
    // next level
    if (this.levelKey !== "Level3") {
      state.exit = this.physics.add.sprite(4350, 220, "exit");
      
      this.anims.create({
        key: "glow",
        frames: this.anims.generateFrameNumbers("exit", { start: 0, end: 5 }),
        frameRate: 4,
        repeat: -1
      });
      
      this.physics.add.collider(state.exit, state.platforms);
      
      state.exit.anims.play("glow", true);

      this.physics.add.overlap(state.player, state.exit, () => {
        this.cameras.main.fade(400, 0, 0, 0, false, function(camera, progress) {
          if (progress > .9) {
            this.anims.pauseAll();
            this.physics.pause();
            state.enemies = [];
            this.scene.start(this.nextLevel[this.levelKey])
          }
        })
      })
    } else {
      // spawn boss
      state.boss = this.physics.add.sprite(3800, 500, "boss").setScale(1.5);
      this.physics.add.collider(state.platforms, state.boss);
      // add movement
      state.boss.body.bounce.setTo(1, 1)
      this.tweens.add({
        targets: state.boss,
        x: (Math.floor(Math.random() * 100)) % 2 === 0 ? state.boss.x + 300 : state.boss.x - 600,
        ease: "Cubic",
        duration: 2500,
        repeat: -1,
        yoyo: true,
        flipX: true,
      })
      // animate & collider
      this.anims.create({
        key: "bossRun",
        frames: this.anims.generateFrameNumbers("boss", { start: 0, end: 4 }),
        frameRate: 10,
        repeat: -1,
        yoyo: true,
        flipX: false,
      });
      state.boss.anims.play("bossRun", true);
      this.physics.add.collider(state.player, state.boss, (player) => this.heroGotHit());
      // winner
      state.gifts = this.physics.add.sprite(4270, 600, "gifts").setScale(.3);
      this.physics.add.collider(state.platforms, state.gifts);
      this.physics.add.overlap(state.player, state.gifts, () => {
        this.cameras.main.fade(400, 0, 0, 0, false, function(camera, progress) {
          if (progress > .9) {
            this.physics.pause();
            this.anims.pauseAll();
            state.enemies = [];
            this.scene.start(this.nextLevel[this.levelKey]);
          }
        })
      });
    }

    this.physics.add.collider(state.enemies, state.boxes);
    this.physics.add.collider(state.player, state.boxes);
    this.physics.add.collider(state.platforms, state.boxes);

    this.createSnow();

    this.levelSetupAndPopulate();

    this.levelRenderBoxes();
    
    this.createAnimations();

    // bullets
    state.bullets = this.physics.add.group();

    // bullets - enemies collider
    this.physics.add.collider(state.enemies, state.bullets, (enemy, bullet) => {
      const deleteEnemy = () => {
        bullet.destroy();
        enemy.destroy();
      }
      enemy.setScale(enemy.scale - .2);
      // male enemy shrink a bit before destroying
      this.time.delayedCall(90, deleteEnemy); 
    })

    // santa - enemies collider
    this.physics.add.overlap(state.player, state.enemies, (player, enemy) => this.heroGotHit());

    this.createTweens();
    
    this.cameras.main.setBounds(0, 0, 4400, 700);
    this.physics.world.setBounds(0, 0, 4400, 700 + state.player.height);
    
    this.cameras.main.startFollow(state.player, true, 0.5, 0.5, -60)
    state.player.setCollideWorldBounds(true);

    this.physics.add.collider(state.player, state.platforms);
    this.physics.add.collider(state.bullets, state.platforms, (bullet) => bullet.destroy());
    this.physics.add.collider(state.bullets, state.boxes, (bullet) => bullet.destroy());

    state.cursors = this.input.keyboard.createCursorKeys();
  }

  createSnow() {
    state.particles = this.add.particles('snowflake');
    state.emitter = state.particles.createEmitter({
       x: {min: 0, max: config.width * 2 },
      y: -5,
      lifespan: 2000,
      speedX: { min:-5, max: -200 },
      speedY: { min: 200, max: 400 },
      scale: { start: 0.6, end: 0 },
      quantity: 10,
      blendMode: 'ADD'
    })
    state.emitter.setScrollFactor(0);
  }

  setWeather(weather) {
    const weathers = {
      "morning": {
        "snow":  1,
        "wind":  20,
      },

      "afternoon": {
        "snow":  1,
        "wind": 80,
      },

      "twilight": {
        "snow":  10,
        "wind": 200,
      },
    }
    let { color, bgColor, snow, wind } = weathers[weather];
    state.emitter.setQuantity(snow);
    state.emitter.setSpeedX(-wind);
    return
  }

  heroGotHit() {
    state.lifes -= 1;
    this.physics.pause();
    state.active = false;
    if (state.lifes) {
      state.enemies = [];
      this.cameras.main.shake(240, .01, false, function (camera, progress) {
        if (progress > .9) {
          this.scene.restart(this.levelKey);
        }
      });
    // if hero is dead
    } else {
      this.cameras.main.shake(240, .01, false)
      this.physics.pause();
      state.enemies.forEach(enemy => enemy.destroy());
      if (state.boss) state.boss.destroy();
      state.player.destroy()
      state.enemies = [];
      state.scoreText.setText(`Lifes: 0`)
      state.overText = this.add.bitmapText(game.config.width / 2 - 320, game.config.height / 2 - 100, "myfont", "GAME OVER!", 120); 
      state.insertText = this.add.bitmapText(game.config.width / 2 - 220, game.config.height / 2 + 50, "myfont", "Please, insert coin...", 44); 
      state.insertText.on("pointerup", () => this.scene.start("Level1"));
      state.overText.setScrollFactor(0);
      state.insertText.setScrollFactor(0);
      state.lifes = 3;
      state.insertText.setInteractive({ cursor: "pointer" });
    }
  }

  createParallaxBackgrounds(bg1, bg2, bg3) {
    state.bg1 = this.add.image(0, 30, bg1);
    state.bg2 = this.add.image(0, 130, bg2);
    state.bg3 = this.add.image(0, 130, bg3);

    state.bg1.setOrigin(0, 0);
    state.bg2.setOrigin(0, 0);
    state.bg3.setOrigin(0, 0);

    const game_width = parseFloat(state.bg3.getBounds().width)
    state.width = game_width;
    const window_width = config.width

    const bg1_width = state.bg1.getBounds().width
    const bg2_width = state.bg2.getBounds().width
    const bg3_width = state.bg3.getBounds().width

    state.bgColor.setScrollFactor(0);
    state.bg1.setScrollFactor((bg1_width - window_width) / (game_width - window_width));
    state.bg2.setScrollFactor((bg2_width - window_width) / (game_width - window_width));
  }

  levelRenderBoxes() {
    for (const [xCoord, yCoord] of this.boxesCoord) {
      state.boxes.create(xCoord, yCoord, this.levelKey !== "Level2" ? "box" : "box1").setScale(.2).refreshBody();
    }
  }

  createPlatform(xIndex, yIndex) {
    // Creates a platform evenly spaced along the two indices.
    // If either is not a number it won"t make a platform
    if (typeof yIndex === "number" && typeof xIndex === "number") {
      const platform = state.platforms.create((220 * xIndex), yIndex * 70, "platform").setOrigin(0, 0.5).refreshBody();
    }
  }

  createEnemies(xIndex, yIndex) {
    state[`enemy${xIndex}`] = this.physics.add.sprite(220 * xIndex, yIndex * 70 - 80, "snowman").setScale(.8);
    // some enemies will be jumping arround
    // Math.floor(xIndex) % 2 === 0 ? state[`enemy${xIndex}`].body.bounce.setTo(1, 1) : null;
    state.enemies.push(state[`enemy${xIndex}`]);
    this.physics.add.collider(state[`enemy${xIndex}`], state.platforms);
  }

  levelSetupAndPopulate() {
     // starting message
     if (this.levelKey === "Level1" && state.lifes === 3) {
      state.startText = this.add.bitmapText(game.config.width / 2 - 380, game.config.height / 2 - 50, "myfont", "Evil Snowman stole all the presents", 40); 
      state.belowText = this.add.bitmapText(game.config.width / 2 - 230, game.config.height / 2, "myfont", "Help Santa get them back!", 38); 
      this.time.delayedCall(6000, () => {
        state.startText.destroy();
        state.belowText.destroy();
      }); 
    }

    for (const [xIndex, yIndex] of this.heights.entries()) { 
      this.createPlatform(xIndex, yIndex);
      const randomOdd = Math.random() * 100 > 30;
      if (xIndex !== 0 && this.heights[xIndex] && randomOdd) {
        this.createEnemies(xIndex, yIndex);
      }
    }
    this.setWeather(this.weather);
  }

  createTweens = () => {
    // const sceneHeights = game.scene.scenes[0].heights;
    // const currentPos = Math.floor(enemy.x / 200);
    // const futurePosLeft = Math.floor((enemy.x - 10) / 200);
    // const futurePosRight = Math.floor((enemy.x - 10) / 200);
    state.enemies.forEach((enemy, i) => {
      this.tweens.add({
        targets: enemy,
        x: i % 2 === 0 ? enemy.x + 200 : enemy.x - 200,
        ease: "Linear",
        duration: 2000,
        repeat: -1,
        yoyo: true,
        flipX: true,
        onUpdate(tween) {
          // remove the one that fall
          if (enemy.y > 710) {
            tween.remove();
            enemy.destroy();
            state.enemies.splice((state.enemies.indexOf(enemy)), 1);
          }
        } 
      })
    })
  }

  createAnimations() {
    this.anims.create({
      key: "snowmanAlert",
      frames: this.anims.generateFrameNumbers("snowman", { start: 0, end: 3 }),
      frameRate: 4,
      repeat: -1
    });

    if (state.enemies.length > 0) state.enemies.forEach(enemy => enemy.anims.play("snowmanAlert", true));

    this.anims.create({
      key: "run",
      frames: this.anims.generateFrameNumbers("hero", { start: 2, end: 5 }),
      frameRate: 10,
      repeat: -1
    });

    this.anims.create({
      key: "idle",
      frames: this.anims.generateFrameNumbers("hero", { start: 0, end: 0 }),
      frameRate: 10,
      repeat: -1
    });

    this.anims.create({
      key: "jump",
      frames: this.anims.generateFrameNumbers("hero", { start: 1, end: 1 }),
      frameRate: 10,
      repeat: 3
    })
  }
  
  update() {
    if (state.active) {
      if (state.player.y > 720) return this.heroGotHit();
      if (state.cursors.right.isDown) {
        state.player.flipX = false;
        state.player.setVelocityX(state.speed);
        state.player.anims.play("run", true);
      } else if (state.cursors.left.isDown) {
        state.player.flipX = true;
        state.player.setVelocityX(-state.speed);
        state.player.anims.play("run", true);
      } else {
        state.player.setVelocityX(0);
        state.player.anims.play("idle", true);
      }

      if (Phaser.Input.Keyboard.JustDown(state.cursors.space) && state.player.body.touching.down) {
        state.player.anims.play("jump", true);
        state.player.setVelocityY(-500);
      }

      if (state.cursors.down.isDown && state.player.flipX && state.cursors.down.getDuration() < 20) {
          state.bullets.create(state.player.x, state.player.y + 10, "bullet").setGravityY(-800).setVelocityX(-400);
      }

      if (state.cursors.down.isDown && !state.player.flipX && state.cursors.down.getDuration() < 20) {
        state.bullets.create(state.player.x, state.player.y + 10, "bullet").setGravityY(-800).setVelocityX(400);
      } 
    }
  }
}