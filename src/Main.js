export default class Main extends Phaser.Scene {
    constructor() {
        super({key: 'Main'});
    }

    preload ()
    {
        // area
        this.load.image('bg', 'assets/playfield/bg.png');
        this.load.image('area', 'assets/playfield/area.png');

        // player
        this.load.spritesheet('player-idle', 'assets/player/player-idle.png', { frameWidth: 80, frameHeight: 80 });
        this.load.spritesheet('player-run', 'assets/player/player-run.png', { frameWidth: 80, frameHeight: 80 });
        this.load.spritesheet('player-jump', 'assets/player/player-jump.png', { frameWidth: 80, frameHeight: 80 });
        this.load.spritesheet('player-shoot', 'assets/player/player-run-shot.png', { frameWidth: 80, frameHeight: 80 });

        // monster crab
        this.load.spritesheet('monster-idle', 'assets/monster/crab-idle.png', { frameWidth: 48, frameHeight: 32 });
        this.load.spritesheet('monster-walk', 'assets/monster/crab-walk.png', { frameWidth: 48, frameHeight: 32 });

        // monster jumper
        this.load.spritesheet('jumper-idle', 'assets/monster/jumper-idle.png', { frameWidth: 47, frameHeight: 32 });
        this.load.image('jumper-jump', 'assets/monster/jumper-jump.png');

        // effects
        this.load.spritesheet('blow', 'assets/fx/enemy-death.png', { frameWidth: 67, frameHeight: 48 });
        this.load.spritesheet('shot', 'assets/fx/shot.png', { frameWidth: 6, frameHeight: 4 });

        // platforms
        this.load.image('platforms', 'assets/platform.png');

        // audio
        this.load.audio('laser', [
            'assets/audio/laser.ogg',
            'assets/audio/laser.mp3'
        ]);
        this.load.audio('jump', [
            'assets/audio/jump.ogg',
            'assets/audio/jump.wav'
        ]);
        this.load.audio('boom', [
            'assets/audio/boom.ogg',
            'assets/audio/boom.wav'
        ]);
        this.load.audio('bgm', [
            'assets/audio/bgm.ogg',
            'assets/audio/bgm.mp3'
        ]);
    }

    create ()
    {
        this.add.image(0, 0, 'bg').setOrigin(0, 0);

        // spawn area
        this.bg = this.add.image(0, 0, 'area').setOrigin(0, 0);

        // spawn player
        this.player = this.physics.add.sprite(320, 300, 'player-idle');
        this.player.setCollideWorldBounds(true);
        this.player.setGravityY(400);

        // spawn monster
        this.monster = this.physics.add.group();

        // check monster
        this.spawn = 0;

        // timer to spawn enemies
        this.timerToActive = 0;

        // spawn shot
        this.bullet = this.physics.add.group();

        // check shot
        this.shooting = false;

        // spawn platforms
        this.platforms = this.physics.add.sprite(320, 240, 'platforms');
        this.platforms.setScale(0.8);
        this.platforms.body.immovable = true;

        this.tweens.timeline({
          targets: this.platforms.body.velocity,
          loop: -1,
          tweens: [
            {x: 0, y: -10, duration: 1000, ease: 'Stepped'},
            {x: 0, y: 0, duration: 100, ease: 'Stepped'},
            {x: 0, y: 10, duration: 1000, ease: 'Stepped'},
            {x: 0, y: 0, duration: 100, ease: 'Stepped'}
          ]
        });

        // setup audio
        this.lasersound = this.sound.add('laser', { loop: false });
        this.jumpsound = this.sound.add('jump', { lopp: false });
        this.boomsound = this.sound.add('boom', { loop: false, volume: 3 });
        this.bgm = this.sound.add('bgm', { loop: true });
        this.bgm.play();

        // set score
        this.score = 0;
        this.scoreBoard = this.add.text(16, 16,'Score: 0', { fontSize: '20px', fill: '#fff' });

        // set wave
        this.wave = 1;
        this.waveBoard = this.add.text(540, 16,'Wave: 1', { fontSize: '20px', fill: '#fff' });

        // set health
        this.health = 3;
        this.healthPoint = this.add.text(280, 16, 'Health: 3', { fontSize: '20px', fill: '#fff', align: 'center' });

        // create floor
        this.floor = this.physics.add.sprite(0, 480).setOrigin(0, 0);
        this.floor.displayWidth = 640;
        this.floor.displayHeight = 60;
        this.floor.setCollideWorldBounds(true);
        this.floor.body.immovable = true;

        this.floor2 = this.physics.add.sprite(0, 480).setOrigin(0, 0);
        this.floor2.displayWidth = 100;
        this.floor2.displayHeight = 160;
        this.floor2.setCollideWorldBounds(true);
        this.floor2.body.immovable = true;

        this.floor3 = this.physics.add.sprite(640, 480).setOrigin(0, 0);
        this.floor3.displayWidth = 80;
        this.floor3.displayHeight = 160;
        this.floor3.setCollideWorldBounds(true);
        this.floor3.body.immovable = true;

        // add input keys
        this.cursors = this.input.keyboard.createCursorKeys();
        this.spaceKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
        this.Replay = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.R);

        // create animations player
        this.anims.create({
            key: 'p-idle',
            frames: this.anims.generateFrameNumbers('player-idle', { start: 0, end: 3 }),
            frameRate: 10,
            repeat: -1
        });

        this.anims.create({
            key: 'p-run',
            frames: this.anims.generateFrameNumbers('player-run', { start: 0, end: 9 }),
            framerate: 10,
            repeat: -1
        });

        this.anims.create({
            key: 'p-jump',
            frames: this.anims.generateFrameNumbers('player-jump', { start:0, end: 5 }),
            frameRate: 10,
            repeat: 0
        });

        this.anims.create({
            key: 'p-shoot',
            frames: this.anims.generateFrameNumbers('player-shoot', { start: 0, end: 9 }),
            frameRate: 10,
            repeat: -1
        });

        this.anims.create({
            key: 'p-shooti',
            frames: this.anims.generateFrameNumbers('player-shoot', { start: 1, end: 1 }),
            repeat: 0
        });

        this.anims.create({
            key: 'crab-idle',
            frames: this.anims.generateFrameNumbers('monster-idle', { start: 0, end: 3 }),
            frameRate: 10,
            repeat: -1
        });

        this.anims.create({
            key: 'boom',
            frames: this.anims.generateFrameNumbers('blow', { star: 0, end: 4 }),
            frameRate: 10,
            repeat: 0
        });

        this.anims.create({
            key: 'shooting',
            frames: this.anims.generateFrameNumbers('shot', { start: 0, end: 1 }),
            frameRate: 10,
            repeat: -1
        });

        this.anims.create({
            key: 'j-idle',
            frames: this.anims.generateFrameNumbers('jumper-idle', { start: 0, end: 3 }),
            frameRate: 8,
            repeat: -1
        });

        // add collider
        this.physics.add.collider(this.player, this.floor);
        this.physics.add.collider(this.player, this.floor2);
        this.physics.add.collider(this.player, this.floor3);
        this.physics.add.collider(this.player, this.platforms);

        this.physics.add.collider(this.monster, this.floor);
        this.physics.add.collider(this.monster, this.floor2);
        this.physics.add.collider(this.monster, this.floor3);
        this.physics.add.collider(this.monster, this.platforms);

        this.physics.add.overlap(this.bullet, this.monster, this.monded, null, this);
        this.physics.add.overlap(this.player, this.monster, this.playerhit, null, this);

        this.doJumperJump = 0;
    }

    playerhit(player, monster) {
        this.health -= 1;
        this.healthPoint.setText('Health: ' + this.health);
        if (this.health > 0) {
            if (player.flipX == false) {
                player.x -= 30;
                monster.x += 30;
            } else {
                player.x += 30;
                monster.x -= 30;
            }
        } else {
            player.disableBody(true, true);
            this.add.sprite(player.x, player.y).play('boom', true).on('animationcomplete', function() {
                this.destroy();
            });
            this.healthPoint.setText('You died \n press R to Replay');
        }
    }

    monded(bullet, monster) {
        bullet.destroy();
        monster.destroy();
        var animboom = this.add.sprite(monster.x, monster.y).play('boom', true);
        this.boomsound.play();
        animboom.on('animationcomplete', function() {
            this.destroy();
        });

        this.score += 10;
        this.scoreBoard.setText('Score: ' + this.score);
    }

    currentWave(wave) {
        switch (wave) {
            case 1:
                return 5;
            case 2:
                return 7;
            default:
                return 15;
        }
    }

    timeToSpawn(timer){
      this.timerToActive--;
      if (this.timerToActive < 0){
        this.doSpawnEnemies();
        this.timerToActive = timer;
      }
    }

    doSpawnEnemies() {
      if (this.spawn != this.currentWave(this.wave)) {
          var rand = Phaser.Math.Between(0,1);
          if (rand == 1) {
            if (this.wave != 2){
              var crab = this.monster.create(-10, 300, 'monster-idle');
              crab.anims.play('crab-idle');
            }
            else {
              var jumper = this.monster.create(-10, 300, 'jumper-idle');
              jumper.anims.play('j-idle');
            }
          } else {
            if (this.wave != 2){
              var crab = this.monster.create(650, 300, 'monster-idle');
              crab.anims.play('crab-idle');
            }
            else{
              var jumper = this.monster.create(650, 300, 'jumper-idle');
              jumper.anims.play('j-idle');
            }
          }
          this.spawn += 1;
      } else if (this.spawn == this.currentWave(this.wave) && this.monster.countActive(true) == 0) {
          this.wave += 1;
          this.waveBoard.setText('Wave: ' + this.wave);
          this.spawn = 0;
      }
    }

    doShoot(check) {
        if (this.shooting == false && this.health > 0) {
            if (check == true) {
                var bullet = this.bullet.create(this.player.x - 20, this.player.y + 15, 'shot');
                bullet.anims.play('shooting');
                bullet.body.setVelocityX(-450);
                this.lasersound.play();
            } else {
                var bullet = this.bullet.create(this.player.x + 20, this.player.y + 15, 'shot');
                bullet.anims.play('shooting');
                bullet.body.setVelocityX(450);
                this.lasersound.play();
            }

            this.shooting = true;
            this.time.addEvent({
                delay: 250,
                callback: () => {
                    this.shooting = false;
                }
            });
        }
    }

    update()
    {
        this.timeToSpawn(180);

        // moving input
        if (!this.player.body.touching.down) {
            if (this.cursors.left.isDown) {
                this.player.flipX = true;
                this.player.setVelocityX(-160);
            } else if (this.cursors.right.isDown) {
                this.player.flipX = false;
                this.player.setVelocityX(160);
            } else {
                this.player.setVelocityX(0);
            }
        } else if (this.spaceKey.isDown && this.player.body.touching.down) {
            if (this.cursors.left.isDown) {
                this.player.flipX = true;
                this.player.setVelocityX(-160);
                this.player.anims.play('p-shoot', true);
            } else if (this.cursors.right.isDown) {
                this.player.flipX = false;
                this.player.setVelocityX(160);
                this.player.anims.play('p-shoot', true);
            } else {
                this.player.setVelocityX(0);
                this.player.anims.play('p-shooti', true);
            }
            this.doShoot(this.player.flipX);
        } else {
            if (this.cursors.left.isDown) {
                this.player.flipX = true;
                this.player.setVelocityX(-160);
                this.player.anims.play('p-run', true);
            } else if (this.cursors.right.isDown) {
                this.player.flipX = false;
                this.player.setVelocityX(160);
                this.player.anims.play('p-run', true);
            } else {
                this.player.setVelocityX(0);
                this.player.anims.play('p-idle', true);
            }
        }

        // jump input
        if (this.cursors.up.isDown && this.player.body.touching.down && this.health > 0) {
            this.player.setVelocityY(-330);
            this.player.anims.play('p-jump', true);
            this.jumpsound.play();
        }

        // do replay
        if (this.Replay.isDown) {
            this.bgm.stop();
            this.scene.restart();
        }

        // enemy chase player
        this.monster.children.each(enemy => {
            if (this.player.x < enemy.x) {
                enemy.body.setGravityY(400);
                enemy.flipX = false;
            } else {
                enemy.body.setGravityY(400);
                enemy.flipX = true;
            }
            this.enemyBehavior(enemy);
        });
    }

    jumperAct(x, enemy){
      if (this.doJumperJump < 0){
        this.time.addEvent({
          delay: 3000,
          callback: () => {
            let yHigh = Phaser.Math.RND.between(240, 260);
            if ((enemy.body != null) && enemy.body.touching.down){
              enemy.setVelocity(x, -yHigh);
              console.log("do jump");
            }
          }
        });
        this.doJumperJump = 210;
      }
    }

    enemyBehavior(enemy){
      if (this.wave == 2){
        let xPos = Phaser.Math.RND.between(50, 70);
        if (enemy.flipX){
          // set move by gravity
          this.jumperAct(xPos, enemy);
          if (enemy.body.touching.down){
            enemy.setVelocityX(0);
          }
          this.doJumperJump--;
        }
        else {
          this.jumperAct(-xPos, enemy);
          if (enemy.body.touching.down){
            enemy.setVelocityX(0);
          }
          this.doJumperJump--;
        }
      }
      else{
        if (enemy.flipX){
          // set move by gravity
          enemy.setVelocityX(30);
        }
        else {
          // set move by gravity
          enemy.setVelocityX(-30);
        }
      }
    }
}
