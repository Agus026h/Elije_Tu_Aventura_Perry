class SceneUI extends Phaser.Scene {

    //barra de vida
    setupInterfaz() {
        this.add.rectangle(20, 20, 205, 25, 0x000000).setOrigin(0);
        this.barraRoja = this.add.rectangle(22, 22, 200, 21, 0xff0000).setOrigin(0);
        
        // Usamos una variable de la escena para la salud
        if (this.registry.get('salud') === undefined) {
            this.registry.set('salud', 100);
        }
        this.actualizarBarra();

        const { width, height } = this.sys.game.config;
        this.botonAtras = this.add.container(width - 120, height - 70);

        // El cuadrado 
        let fondoBoton = this.add.rectangle(0, 0, 150, 50, 0x333333).setOrigin(0.5);
        // El texto
        let textoBoton = this.add.text(0, 0, 'ATRÁS', { fontSize: '20px', fill: '#fff' }).setOrigin(0.5);

        this.botonAtras.add([fondoBoton, textoBoton]);

        // Hacerlo interactivo
        fondoBoton.setInteractive({ useHandCursor: true });
        fondoBoton.on('pointerdown', () => this.volverAtras());

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
            console.log("Navegando hacia:", escena);
            this.scene.start(escena);
        }
    
    }

    setBotonAtrasVisible(estado) {
        if (this.botonAtras) {
            this.botonAtras.setVisible(estado);
            
            this.botonAtras.iterate(child => {
                if (child.input) child.input.enabled = estado;
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
    }

    create() {
        const { width, height } = this.sys.game.config; // Diseño esponsive

        this.add.sprite(width / 2, height / 2, 'puerta');
        this.setupInterfaz();
        this.recibirDanio(10);
        this.setupNotificaciones();
        this.mostrarNotificacion("asdaksdjkasj dkajsdkajskdjak sdjkasjdkajsdka jskdjaksdj kasjdkajsdkajskd");

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
    }

    create() {
        const { width, height } = this.sys.game.config; // Diseño esponsive

        this.add.sprite(width / 2, height / 2, 'pasillo');
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
            this.scene.start('Scene');
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

    }
    create(){
        const { width, height } = this.sys.game.config; // Diseño esponsive

        this.add.sprite(width / 2, height / 2, 'runas');
        this.setupInterfaz();
        this.recibirDanio(10);

        
    }

}
class EscenaHome extends SceneUI{
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
    
    scene: [Escena, EscenaPuerta, EscenaHome, EscenaMonstruo, EscenaRunas, EscenaPasillo,SceneUI],
};

new Phaser.Game(config);