import 'phaser';
import Main from './Main';

var config = {
    type: Phaser.AUTO,
    width: 640,
    height: 480,
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 400},
            debug: false
        }
    },
    scene: [Main]
};

var game = new Phaser.Game(config);