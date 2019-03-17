import 'phaser';
import Main from './Main';

var config = {
    type: Phaser.AUTO,
    width: 640,
    height: 480,
    physics: {
        default: 'arcade',
        arcade: {
          debug: true
        }
    },
    scene: [Main]
};

var game = new Phaser.Game(config);
