class Escena extends Phaser.Scene {
    constructor() {
        super({key: 'sceneA'});
    }

    preload() {
        resize();
        window.addEventListener('resize', resize);
        this.load.image('fondo', '../img/espacio.jpg');
    }

    create() {
        this.add.sprite(480, 320, 'fondo');
        // Coordenadas para la esquina superior izquierda
            const cornerX = 20;
            const cornerY = 20;

            
           
            this.add.rectangle(cornerX, cornerY, 205, 25, 0x000000).setOrigin(0);
            
           
            this.barraRoja = this.add.rectangle(cornerX + 2, cornerY + 2, 200, 21, 0xff0000).setOrigin(0);

            // Variables de estado
            this.saludMaxima = 100;
            this.saludActual = 100;

        const opcionNave = this.add.zone(140, 10, 440, 400);
        opcionNave.setOrigin(0);
        opcionNave.setName('nave');
        opcionNave.setInteractive();
        opcionNave.once('pointerdown', () => this.opcionPulsada(opcionNave));
        //this.add.graphics().lineStyle(2, 0xff0000).strokeRectShape(opcionNave);

        const opcionMundo = this.add.zone(590, 240, 370, 410);
        opcionMundo.setOrigin(0);
        opcionMundo.setName('tierra');
        opcionMundo.setInteractive();
        opcionMundo.once('pointerdown', () => this.opcionPulsada(opcionMundo));

        //this.add.graphics().lineStyle(2, 0x00ff00).strokeRectShape(opcionMundo);
    }

    opcionPulsada(opcion) {
        console.log("Opción:" + opcion.name)
        if (opcion.name === 'nave') {
            this.scene.start('naveScene');
        } else {
            this.scene.start('continenteScene');
        }
    }
}

class EscenaNave extends Phaser.Scene {

    constructor() {
        super({key: 'naveScene'});
    }

    preload() {
        this.load.image('nave', '../img/nave.jpg');
    }

    create() {
        this.add.sprite(480, 320, 'nave');

        const opcionNave = this.add.zone(150, 170, 250, 370);
        opcionNave.setOrigin(0);
        opcionNave.setName('boss');
        opcionNave.setInteractive();
        opcionNave.once('pointerdown', () => this.opcionPulsada(opcionNave));
        //


        const opcionMundo = this.add.zone(530, 170, 250, 370);
        opcionMundo.setOrigin(0);
        opcionMundo.setName('home');
        opcionMundo.setInteractive();
        opcionMundo.once('pointerdown', () => this.opcionPulsada(opcionMundo));
        //  this.add.graphics().lineStyle(2, 0x00ff00).strokeRectShape(opcionMundo);
    }

    opcionPulsada(opcion) {
        if (opcion.name === 'boss') {
            this.scene.start('monstruoScene');
        } else {
            this.scene.start('homeScene');
        }
    }
}

class EscenaContinente extends Phaser.Scene {

    constructor() {
        super({key: 'continenteScene'});
    }

    preload() {
        this.load.image('continente', '../img/heroeContinente.jpg');
    }

    create() {
        this.add.sprite(480, 320, 'continente');
        //argentina
        const contornoArgentina = new Phaser.Geom.Polygon([585,488,555,471,548,474,539,469,534,479,526,485,527,498,
            520,508,520,519,520,531,514,545,514,556,513,568,516,580,512,
            590,508,598,514,605,519,610,527,612,536,616,542,616,534,598,
            541,592,534,583,544,580,550,572,555,568,546,563,562,561,566,
            554,575,551,586,552,592,541,584,532,584,519,589,510,595,504,609,494,604,490,594,500,582,498]);
        const opcionArgentina = this.add.zone(0,0,960,640)
        .setOrigin(0)
        .setName('argentina')
        .setInteractive(contornoArgentina, Phaser.Geom.Polygon.Contains);
        opcionArgentina.once('pointerdown', () => this.opcionPulsada(opcionArgentina));
      
        this.add.graphics().lineStyle(2, 0xffff00).strokePoints(contornoArgentina.points, true);

        //Brasil
        const contornoBrasil = new Phaser.Geom.Polygon([710,386,707,371,695,371,682,362,657,360,639,352,625,338,617,324,610,333,600,336,575,340,570,327,551,330,538,342,530,336,520,341,521,353,517,370,502,374,496,385,499,396,507,400,523,408,534,398,542,400,541,412,552,417,564,420,569,423,571,435,582,438,586,444,584,454,584,466,595,469,599,479,605,479,606,488,608,496,599,502,592,509,598,514,605,515,610,523,628,506,637,481,671,469,684,442,693,414]);

        //Africa
        const contornoAfrica = new Phaser.Geom.Polygon([944,209,912,204,907,208,898,204,880,193,880,184,849,184,837,188,827,196,829,208,824,212,821,226,821,240,826,248,828,261,829,275,838,280,846,290,853,299,863,304,876,305,888,299,897,306,906,308,906,328,916,348,918,368,912,394,919,408,919,427,921,443,923,456,938,451,946,444,954,428,959,417,959,214]);
        //Europa
        const contornoEuropa = new Phaser.Geom.Polygon([958,191,934,192,914,188,896,183,887,182,866,180,841,179,822,179,812,159,826,153,815,139,808,129,793,123,788,101,814,91,822,70,836,63,859,65,876,67,893,74,907,75,916,65,938,65,958,65]);
    }

    opcionPulsada(opcion){
        switch (opcion.name){
            case 'argentina':
            this.scene.start('argentinaScene');
            break;
            default:
                break;
        }
    }

}
class EscenaArgentina extends Phaser.Scene{
    constructor(){
        super({key: 'argentinaScene'});
    }

    preload(){
        this.load.image('argentina', '../img/argentina.jpg');
    }
    create(){
        this.add.sprite(480, 320, 'argentina');
    }

}
class EscenaHome extends Phaser.Scene{
    constructor(){
        super({key: 'homeScene'});
    }

    preload(){
        this.load.image('home', '../img/home.jpg');
    }
    create(){
        this.add.sprite(480, 320, 'home');
    }

}

class EscenaMonstruo extends Phaser.Scene {

    constructor() {
        super({key: 'monstruoScene'});
    }

    preload() {
        this.load.image('monstruo', '../img/monstruo.jpg');
    }

    create() {
        this.add.sprite(480, 320, 'monstruo');
    }
}

function resize() {
    const canvas = document.querySelector("canvas");
    const windowWidth = window.innerWidth;
    const windowHeight = window.innerHeight;

    canvas.style.width = windowWidth + 'px';
    canvas.style.height = windowHeight + 'px';
}

const config = {
    type: Phaser.canvas,
    parent: 'phaser-example',
    width: 960,
    height: 640,
    scene: [Escena, EscenaNave, EscenaHome, EscenaMonstruo, EscenaArgentina, EscenaContinente],
};

new Phaser.Game(config);