class SceneUI extends Phaser.Scene {

    //barra de vida
    setupInterfaz() {
        const { width, height } = this.sys.game.config; 
        //estados
        if (this.registry.get('botonBailarActivado') === undefined) {
        this.registry.set('botonBailarActivado', false);
        }
        
        if (this.registry.get('salud') === undefined) {
            this.registry.set('salud', 100);
        }
        //barra de vida
        this.add.rectangle(20, 20, 205, 25, 0x000000).setOrigin(0);
        this.barraRoja = this.add.rectangle(22, 22, 200, 21, 0xff0000).setOrigin(0);
        this.actualizarBarra();

        //boton atras
        
        this.botonAtras = this.add.container(120, height - 70);
        let fondoAtras = this.add.rectangle(0, 0, 150, 50, 0x333333).setOrigin(0.5);
        let textoAtras = this.add.text(0, 0, 'ATRAS', { fontSize: '20px', fill: '#fff' }).setOrigin(0.5);
        this.botonAtras.add([fondoAtras, textoAtras]);

        fondoAtras.setInteractive({ useHandCursor: true });
        fondoAtras.on('pointerdown', () => {
            const destino = this.registry.get('escenaPrevia') || 'sceneA';
            this.scene.start(destino);
        });


        this.setupBotonBailar();
        this.setupNotificaciones();
        
        this.videoPerry = this.add.video(width / 2, height / 2, 'videoPerry');
        this.videoPerry.setVisible(false);
        this.videoPerry.setDepth(2000);
    }


    setupNotificaciones() {
        const { width } = this.sys.game.config;

        this.cntNotificacion = this.add.container(width / 2, -200);
        this.cntNotificacion.setDepth(1000);

        // graphis es mas dinamico que usar rectangle
        this.fondoNotif = this.add.graphics();

        this.textoNotif = this.add.text(0, 0, '', {
            fontSize: '24px',
            fill: '#ffffff',
            align: 'center',
            wordWrap: { width: 800, useAdvancedWrap: true }//es mejor para las palabras largas
        }).setOrigin(0.5);

        this.cntNotificacion.add([this.fondoNotif, this.textoNotif]);
    }

    mostrarNotificacion(mensaje) {
        if (this.animandoNotif || !this.textoNotif) return;
        this.animandoNotif = true;

        // seteo el texto y fuerso que se actualize por que no lo hace automaticamente
        this.textoNotif.setText(mensaje);
        this.textoNotif.updateText();

        // Calculo dimensiones
        const paddingX = 40;
        const paddingY = 30;
        const ancho = this.textoNotif.width + paddingX;
        const alto = this.textoNotif.height + paddingY;

        this.fondoNotif.clear();
        
       //centrado
        this.fondoNotif.fillStyle(0x000000, 0.8);
        this.fondoNotif.fillRect(-ancho / 2, -alto / 2, ancho, alto);
        
        // Estilo del borde 
        this.fondoNotif.lineStyle(2, 0xffffff, 1);
        this.fondoNotif.strokeRect(-ancho / 2, -alto / 2, ancho, alto);

        // animacion
        this.tweens.add({
            targets: this.cntNotificacion,
            y: 100, 
            duration: 500,
            ease: 'Back.easeOut',
            onComplete: () => {
                let tiempoLectura = Math.max(2500, mensaje.length * 50);//para calcular el tiempo dependiendo del largo del mensaje
                
                this.time.delayedCall(tiempoLectura, () => {
                    this.tweens.add({
                        targets: this.cntNotificacion,
                        y: -300, 
                        duration: 500,
                        ease: 'Back.easeIn',
                        onComplete: () => { 
                            this.animandoNotif = false; 
                        }
                    });
                });
            }
        });
    }


    //Resto y Actualizo al mismo tiempo
    recibirDanio(cantidad) {
        let salud = this.registry.get('salud') - cantidad;
        this.registry.set('salud', salud);
        this.actualizarBarra();
    }

    actualizarBarra() {
        if (this.barraRoja) {
            let salud = this.registry.get('salud');
            this.barraRoja.width = Phaser.Math.Clamp(salud * 2, 0, 200);
        }
    }

    volverAtras(escena) {
        if (escena) {
            this.scene.start(escena);
        }else{
            this.scene.start('sceneA');
        }
    
    }




    setupBotonBailar() {
        const { width, height } = this.sys.game.config;
        
        this.cntBailar = this.add.container(width - 100, height - 100);
        
        // circulo
        this.fondoBailar = this.add.graphics();
        this.dibujarBotonBailar(this.registry.get('botonBailarActivado'));

        let textoBailar = this.add.text(0, 0, 'BAILAR', { 
            fontSize: '20px', 
            fill: '#fff',
            fontWeight: 'bold' 
        }).setOrigin(0.5);

        this.cntBailar.add([this.fondoBailar, textoBailar]);

        const hitArea = new Phaser.Geom.Circle(0, 0, 50);
        this.cntBailar.setInteractive(hitArea, Phaser.Geom.Circle.Contains);
        
        this.cntBailar.on('pointerdown', () => {
            if (this.registry.get('botonBailarActivado')) {
                this.ejecutarBaile();
            } else {
                this.mostrarNotificacion("Aun no desbloqueas esta habilidad");
            }
        });

        // Actualizar visualmente si cambia el registro
        this.registry.events.on('changedata-botonBailarActivado', (parent, value) => {
            this.dibujarBotonBailar(value);
        });
    }

    
    dibujarBotonBailar(activado) {
        this.fondoBailar.clear();
        const color = activado ? 0x9b59b6 : 0x444444; // Morado si activado, gris si no
        
        this.fondoBailar.fillStyle(color, 1);
        this.fondoBailar.fillCircle(0, 0, 50);
        this.fondoBailar.lineStyle(3, 0xffffff);
        this.fondoBailar.strokeCircle(0, 0, 50);
    }


    ejecutarBaile() {
        
        this.mostrarNotificacion("A bailar! +50 de vida");
        let salud = Math.min(100, this.registry.get('salud') + 50);
        this.registry.set('salud', salud);
        this.actualizarBarra();

        // video
        if (this.videoPerry) {
            
            this.videoPerry.setVisible(true);
            this.videoPerry.once('play', () => {
                // creo un evento para cambiar el tama;o por que phaser lo redimenciona al darle play
                this.videoPerry.setDisplaySize(400, 700); 
                
                console.log("Video iniciado y redimensionado");
            });

            this.videoPerry.play();
            
            
            this.cntBailar.disableInteractive(); //bloqueo de boton

            // 
            this.videoPerry.once('complete', () => {
                this.videoPerry.setVisible(false);
                this.videoPerry.stop();
                this.cntBailar.setInteractive(); //desbloqueo de
            });
        }
    }
}




class Escena extends SceneUI {
    constructor() {
        super({key: 'sceneA'});
    }

    preload() {
        resize();
        window.addEventListener('resize', resize);
        this.load.image('fondo', '../img/Escena1.png');
        
        this.load.video('videoPerry', '../img/Baile.mp4');
        
        
        
    }

    create() {
        
        const { width, height } = this.sys.game.config; // Diseño esponsive

        this.add.sprite(width / 2, height / 2, 'fondo');
        this.setupInterfaz();
        
        
        //this.recibirDanio(10);


        const opcionPuerta = this.add.zone(1400, 10, 440, 400);
        opcionPuerta.setOrigin(0);
        opcionPuerta.setName('puerta');
        opcionPuerta.setInteractive({useHandCursor: true});
        opcionPuerta.once('pointerdown', () => this.opcionPulsada(opcionPuerta));
        this.add.graphics().lineStyle(2, 0xff0000).strokeRectShape(opcionPuerta);

        
    }

    opcionPulsada(opcion) {
        console.log("Opción:" + opcion.name)
        if (opcion.name === 'puerta') {
            this.scene.start('puertaScene');
        } else {
            this.scene.start('sceneA');
        }
    }
}

class EscenaPuerta extends SceneUI {

    constructor() {
        super({key: 'puertaScene'});
    }

    preload() {
        this.load.image('puerta', '../img/Escena2.jpg');
        this.load.video('videoPerry', '../img/Baile.mp4');
    }

    create() {
        const { width, height } = this.sys.game.config; // Diseño esponsive

        this.add.sprite(width / 2, height / 2, 'puerta');
        //para el boton atras
        this.registry.set('escenaPrevia', 'sceneA');
        this.setupInterfaz();
        this.recibirDanio(10);
        
       

        const contornoPuerta = new Phaser.Geom.Polygon([945,823,974,489,1136,349,1303,427,1320,834]);
        const opcionPasar = this.add.zone(0,0,960,640)
        .setOrigin(0)
        .setName('pasillo')
        .setInteractive(contornoPuerta, Phaser.Geom.Polygon.Contains);
        opcionPasar.input.cursor = 'pointer';// al ser poligono le cambio el pointer asi
        opcionPasar.once('pointerdown', () => this.opcionPulsada(opcionPasar));
      
        this.add.graphics().lineStyle(2, 0xffff00).strokePoints(contornoPuerta.points, true);
    }

    opcionPulsada(opcion) {
        if (opcion.name === 'pasillo') {
            this.scene.start('pasilloScene');
        } else {
            this.scene.start('sceneA');
        }
    }
}

class EscenaPasillo extends SceneUI {

    constructor() {
        super({key: 'pasilloScene'});
    }

    preload() {
        this.load.image('pasillo', '../img/Escena3.jpg');
        this.load.video('videoPerry', '../img/Baile.mp4');
    }

    create() {
        const { width, height } = this.sys.game.config; // Diseño esponsive

        this.add.sprite(width / 2, height / 2, 'pasillo');
        this.registry.set('escenaPrevia', 'puertaScene');
        this.setupInterfaz();
        this.recibirDanio(10);
        

        const contornoPrincipal = new Phaser.Geom.Polygon([410,524,412,224,461,162,529,146,590,165,626,228,629,241,631,518]);
        const contornoSecundario = new Phaser.Geom.Polygon([858,188,865,565,1771,560,1762,194,1530,145,1084,155]);
        const opcionPrincipal = this.add.zone(0,0,960,640)
        .setOrigin(0)
        .setName('principal')
        .setInteractive(contornoPrincipal, Phaser.Geom.Polygon.Contains);
        opcionPrincipal.input.cursor = 'pointer';
        opcionPrincipal.once('pointerdown', () => this.opcionPulsada(opcionPrincipal));
        this.add.graphics().lineStyle(2, 0xffff00).strokePoints(contornoPrincipal.points, true);



        const opcionSecundaria = this.add.zone(0,0, 960,640)
        .setOrigin(0)
        .setName('secundaria')
        .setInteractive(contornoSecundario, Phaser.Geom.Polygon.Contains);
        opcionSecundaria.input.cursor = 'pointer';
        opcionSecundaria.once('pointerdown', ()=> this.opcionPulsada(opcionSecundaria));
        this.add.graphics().lineStyle(2, 0xffff00).strokePoints(contornoSecundario.points, true);

        
        
    }

    opcionPulsada(opcion){
        switch (opcion.name){
            case 'principal':
            this.scene.start('ojoScene');
            break;

            case 'secundaria':
            this.scene.start('runasScene');
            break;
        }
    }

}
class EscenaRunas extends SceneUI{
    constructor(){
        super({key: 'runasScene'});
    }

    preload(){
        this.load.image('runas', '../img/Escena4.jpg');
        this.load.video('videoPerry', '../img/Baile.mp4');
    }
    create(){
        const { width, height } = this.sys.game.config; // Diseño esponsive

        this.add.sprite(width / 2, height / 2, 'runas');
        this.registry.set('escenaPrevia', 'pasilloScene');

        this.setupInterfaz();
        this.recibirDanio(10);
        this.mostrarNotificacion("Unas runas magicas desbloquean la habilidad de curarte 50 de vida al bailar");
        this.registry.set('botonBailarActivado', true);

        
    }

}
class EscenaOjo extends SceneUI{
    constructor(){
        super({key: 'ojoScene'});
    }

    preload(){
        this.load.image('ojo', '../img/escena5.jpg');
    }
    create(){
        const { width, height } = this.sys.game.config; // Diseño responsive

        this.add.sprite(width / 2, height / 2, 'ojo');
        this.registry.set('escenaPrevia', 'pasilloScene');

        this.setupInterfaz();
        this.recibirDanio(10);

        
        
        

        //puerta central
        const contornoOjo = new Phaser.Geom.Polygon([651,1068,750,470,843,344,957,293,1062,344,1158,449,1250,1073]);
        const opcionOjo = this.add.zone(0,0,960,640)
        .setOrigin(0)
        .setName('ojo')
        .setInteractive(contornoOjo, Phaser.Geom.Polygon.Contains);
        opcionOjo.input.cursor = 'pointer';
        opcionOjo.once('pointerdown', () => this.opcionPulsada(opcionOjo));
        this.add.graphics().lineStyle(2, 0xffff00).strokePoints(contornoOjo.points, true);


        //puerta R
        const contornoR = new Phaser.Geom.Polygon([1798,1054,1555,406,1560,120,1754,77,1918,200,1918,1071]);
        const opcionR = this.add.zone(0,0, 960,640)
        .setOrigin(0)
        .setName('secundaria')
        .setInteractive(contornoR, Phaser.Geom.Polygon.Contains);
        opcionR.input.cursor = 'pointer';
        opcionR.once('pointerdown', ()=> this.opcionPulsada(opcionR));
        this.add.graphics().lineStyle(2, 0xffff00).strokePoints(contornoR.points, true);

        //puerta N
        const contornoN = new Phaser.Geom.Polygon([114,1068,353,333,349,110,132,86,0,196,0,1070]);
        const opcionN = this.add.zone(0,0, 960,640)
        .setOrigin(0)
        .setName('secundaria')
        .setInteractive(contornoN, Phaser.Geom.Polygon.Contains);
        opcionN.input.cursor = 'pointer';
        opcionN.once('pointerdown', ()=> this.opcionPulsada(opcionN));
        this.add.graphics().lineStyle(2, 0xffff00).strokePoints(contornoN.points, true);

    }

}

class EscenaMonstruo extends SceneUI {

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
    type: Phaser.AUTO,
    parent: 'phaser-example',
    width: 1920,
    height: 1080,
    
    scene: [Escena, EscenaPuerta, EscenaOjo, EscenaMonstruo, EscenaRunas, EscenaPasillo,SceneUI],
};

new Phaser.Game(config);