export default class Main extends Phaser.Scene {
    constructor() {
        super({key: 'Main'});
    }

    preload ()
    {
        // area
        this.load.image('area', 'assets/playfield/area.png');

        // player
        this.load.spritesheet('player-idle', 'assets/player/player-idle.png', { frameWidth: 80, frameHeight: 80 });
        this.load.spritesheet('player-run', 'assets/player/player-run.png', { frameWidth: 80, frameHeight: 80 });
        this.load.spritesheet('player-jump', 'assets/player/player-jump.png', { frameWidth: 80, frameHeight: 80 });
        this.load.spritesheet('player-shoot', 'assets/player/player-run-shot.png', { frameWidth: 80, frameHeight: 80 });

        // monster crab
        this.load.spritesheet('monster-idle', 'assets/monster/crab-idle.png', { frameWidth: 48, frameHeight: 32 });
        this.load.spritesheet('monster-walk', 'assets/monster/crab-walk.png', { frameWidth: 48, frameHeight: 32 });

        // effects
        this.load.spritesheet('blow', 'assets/fx/enemy-death.png', { frameWidth: 67, frameHeight: 48 });
        this.load.spritesheet('shot', 'assets/fx/shot.png', { frameWidth: 6, frameHeight: 4 });

        // platforms
        this.load.image('platforms', 'assets/platform.png');
    }

    create ()
    {
        // spawn area
        this.bg = this.add.image(0, 0, 'area').setOrigin(0, 0);

        // spawn player
        this.player = this.physics.add.sprite(320, 300, 'player-idle');
        this.player.setCollideWorldBounds(true);

        // spawn monster
        this.monster = this.physics.add.group();

        // spawn platforms
        this.platforms = this.physics.add.sprite(320, 240, 'platforms');
        this.platforms.setScale(0.8);
        this.platforms.body.immovable = true;
        this.platforms.body.moves = false;

        // set score
        this.score = 0;
        this.scoreBoard = this.add.text(16,16,'score: 0', { fontSize: '32px', fill: '#fff' });

        // set wave
        this.wave = 0;
        this.waveBoard = this.add.text(500-16, 16,'Wave: 1', { fontSize: '32px', fill: '#fff' });

        // create floor
        this.floor = this.physics.add.sprite(0, 480).setOrigin(0, 0);
        this.floor.displayWidth = 640;
        this.floor.displayHeight = 60;
        this.floor.setCollideWorldBounds(true);
        this.floor.body.immovable = true;

        this.floor2 = this.physics.add.sprite(0, 480).setOrigin(0, 0);
        this.floor2.displayWidth = 100;
        this.floor2.displayHeight = 145;
        this.floor2.setCollideWorldBounds(true);
        this.floor2.body.immovable = true;

        this.floor3 = this.physics.add.sprite(640, 480).setOrigin(0, 0);
        this.floor3.displayWidth = 80;
        this.floor3.displayHeight = 145;
        this.floor3.setCollideWorldBounds(true);
        this.floor3.body.immovable = true;

        // add input keys
        this.cursors = this.input.keyboard.createCursorKeys();
        this.spaceKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);

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
            key: 'enemy-death',
            frames: this.anims.generateFrameNumbers('blow', { star: 0, end: 4 }),
            frameRate: 10,
            repeat: 0
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

        this.physics.add.overlap(this.player, this.monster, this.monded, null, this);
    }

    monded(player, monster) {
        monster.body.stop();
        monster.anims.play('enemy-death', true);
        monster.on('animationcomplete', function() {
            monster.destroy();
        });
    }
    
    spawnEnemies() {
        if (this.monster.countActive(true) == 0) {
            this.wave += 1;
            this.waveBoard.setText('Wave: ' + this.wave);

            for (var x = 0; x < 10; x++) {
                var monster = this.monster.create(640, 300, 'monster-idle');
                monster.flipX = false;
                monster.anims.play('crab-idle');
                // this.physics.moveToObject(monster, this.player, 30);
            }
        }
    }

    update()
    {
        this.spawnEnemies();

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
        if (this.cursors.up.isDown && this.player.body.touching.down) {
            this.player.setVelocityY(-330);
            this.player.anims.play('p-jump', true);
        }
        
        this.monster.children.each(function(enemy) {
            this.physics.moveToObject(enemy, this.player, 30);
        }, this);
    }
}