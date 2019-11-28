class Level extends Phaser.Scene {
  constructor(key) {
    super({ key });
    this.levelKey = key
    // this.nextLevel = {
    //   "Level1": "Level2",
    //   "Level2": "Level3",
    //   "Level3": "Level4",
    //   "Level4": "Credits",
    // }
  }

  preload() {
    this.load.image("platform", "https://s3.amazonaws.com/codecademy-content/courses/learn-phaser/Codey+Tundra/platform.png");
    this.load.image("snowflake", "https://s3.amazonaws.com/codecademy-content/courses/learn-phaser/Codey+Tundra/snowflake.png");
    this.load.spritesheet("campfire", "https://s3.amazonaws.com/codecademy-content/courses/learn-phaser/Codey+Tundra/campfire.png", {
      frameWidth: 32,
      frameHeight: 32
    });
    this.load.spritesheet('snowman', 'https://s3.amazonaws.com/codecademy-content/courses/learn-phaser/Cave+Crisis/snowman.png', { frameWidth: 50, frameHeight: 70 });
    // this.load.spritesheet('codey', 'https://s3.amazonaws.com/codecademy-content/courses/learn-phaser/Codey+Tundra/codey.png', { frameWidth: 72, frameHeight: 90});
    this.load.image('enemy', 'https://s3.amazonaws.com/codecademy-content/courses/learn-phaser/Codey+Tundra/codey.png');
    this.load.image("santa", "santa.png");
    this.load.image("bullet", 'https://s3.amazonaws.com/codecademy-content/courses/learn-phaser/Bug+Invaders/bugPellet.png');

    this.load.image("bg1", "https://s3.amazonaws.com/codecademy-content/courses/learn-phaser/Codey+Tundra/mountain.png");
    this.load.image("bg2", "https://s3.amazonaws.com/codecademy-content/courses/learn-phaser/Codey+Tundra/trees.png");
    this.load.image("bg3", "https://s3.amazonaws.com/codecademy-content/courses/learn-phaser/Codey+Tundra/snowdunes.png");
  }

  create() {
    state.active = true

    state.bgColor = this.add.rectangle(0, 0, config.width, config.height, 0x00ffbb).setOrigin(0, 0);

    state.player = this.physics.add.sprite(125, 100, "santa").setScale(.15);
    
    state.scoreText = this.add.text(10, 10, `Lifes: ${state.lifes}`, { fontFamily: "Tahoma", fontSize: 20, color: "#999966" })
    
    state.platforms = this.physics.add.staticGroup();
    
    this.levelSetupAndPopulate();
    
      
    // bullets
    state.bullets = this.physics.add.group();

    // bullets - enemies collider
    this.physics.add.collider(state.enemies, state.bullets, (enemy, bullet) => {
      bullet.destroy();
      enemy.destroy();
      // state.scoreText.setText(`Bugs Left: ${numOfTotalEnemies()}`);
    })

    // santa - enemies collider
    this.physics.add.collider(state.player, state.enemies, (player, enemy) => {
      this.physics.pause();
      this.cameras.main.shake(240, .01, false, function (camera, progress) {
        if (progress > .9) {
          state.enemies = [];
          this.scene.restart(this.levelKey);
        }
      });
      state.lifes -= 1;
    })

    this.createAnimations();
    
    //this.createSnow();

    this.createTweens();
    
    
    this.cameras.main.setBounds(0, 0, 4400, 700);
    this.physics.world.setBounds(0, 0, 4400, 700 + state.player.height);

    this.cameras.main.startFollow(state.player, true, 0.5, 0.5, -60)
    state.player.setCollideWorldBounds(true);

    this.physics.add.collider(state.player, state.platforms);

    state.cursors = this.input.keyboard.createCursorKeys();

  }

  createPlatform(xIndex, yIndex) {
    // Creates a platform evenly spaced along the two indices.
    // If either is not a number it won"t make a platform
    if (typeof yIndex === "number" && typeof xIndex === "number") {
      const platform = state.platforms.create((220 * xIndex), yIndex * 70, "platform").setOrigin(0, 0.5).refreshBody();
    }
  }

  createEnemies(xIndex, yIndex) {
    state[`enemy${xIndex}`] = this.physics.add.sprite(220 * xIndex, yIndex * 70 - 80, "snowman");
    console.log(state.enemies)
    state.enemies.push(state[`enemy${xIndex}`]);
    this.physics.add.collider(state[`enemy${xIndex}`], state.platforms);
  }

  levelSetupAndPopulate() {
    for (const [xIndex, yIndex] of this.heights.entries()) {
      console.log(xIndex)
      this.createPlatform(xIndex, yIndex);
      const randomOdd = Math.random() * 100 > 40;
      if (xIndex !== 0 && randomOdd) {
        this.createEnemies(xIndex, yIndex);
      }
    }
  }

  createTweens() {
    state.enemies.forEach((enemy, i) => {
      this.tweens.add({
        targets: enemy,
        x: i % 2 === 0 ? enemy.x + 250 : enemy.x - 250,
        ease: 'Linear',
        duration: 1800,
        repeat: -1,
        yoyo: true,
      })  
    })
  }

  createAnimations() {
    this.anims.create({
      key: 'snowmanAlert',
      frames: this.anims.generateFrameNumbers('snowman', { start: 0, end: 3 }),
      frameRate: 4,
      repeat: -1
    });

    state.enemies.forEach(enemy => enemy.anims.play('snowmanAlert', true));
  }
    
  update() {
    if (state.active) {
      if (state.cursors.right.isDown) {
        state.player.flipX = false;
        state.player.setVelocityX(state.speed);
        // state.player.anims.play("run", true);
      } else if (state.cursors.left.isDown) {
        state.player.flipX = true;
        state.player.setVelocityX(-state.speed);
        // state.player.anims.play("run", true);
      } else {
        state.player.setVelocityX(0);
        // state.player.anims.play("idle", true);
      }

      if (Phaser.Input.Keyboard.JustDown(state.cursors.space) && state.player.body.touching.down) {
        // state.player.anims.play("jump", true);
        state.player.setVelocityY(-500);
      }

      if (state.cursors.down.isDown && state.player.flipX && state.cursors.down.getDuration() < 20) {
          state.bullets.create(state.player.x, state.player.y, "bullet").setGravityY(-800).setVelocityX(-400);
      }

      if (state.cursors.down.isDown && !state.player.flipX && state.cursors.down.getDuration() < 20) {
        state.bullets.create(state.player.x, state.player.y, "bullet").setGravityY(-800).setVelocityX(400);
      } 

      if (!state.player.body.touching.down) {
        // state.player.anims.play("jump", true);
      }
      // !!!!!!!!!!!!!!!!! review !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
      if (state.player.y > window.innerHeight) {
        this.physics.pause();
        state.enemies = [];
        this.cameras.main.shake(240, .01, false, function (camera, progress) {
          if (progress > .9) {
            this.scene.restart(this.levelKey);
          }
        });
        state.lifes -= 1;
      }
    }
  }
}