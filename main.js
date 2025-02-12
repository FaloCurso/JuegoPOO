// Clases
class Game {
    constructor() {
        this.container = document.getElementById("game-container");
        this.puntosElement = document.getElementById("puntos");
        this.fantasmasGrid = document.getElementById("ListaFantasmas");
        this.reiniciarBtn = document.getElementById("reiniciar-btn");
        this.comecoco = null;
        this.fantasmas = [];
        this.puntuacion = 0;
        this.anchoContenedor = this.container.clientWidth;
        this.altoContenedorGame = this.container.clientHeight;
        this.sonidofantasma = new Audio('img/sonido.mp3');
        this.sonidoFantasmaVerde = new Audio('img/sonidoterminar.mp3');
        this.fantasmaVerde = null;
        this.crearEscenario();
        this.agregarEventos();
    }
    
    crearEscenario() {   
        this.comecoco = new Comecoco(this.container); // Pasar el contenedor
        this.container.appendChild(this.comecoco.element);
        
        for (let i = 0; i < 7; i++) {
            const fantasma = new Fantasma(this.container); 
            this.fantasmas.push(fantasma);
            this.container.appendChild(fantasma.element);
        }
        this.fantasmaVerde = new FantasmaEspecial(this.container);
        this.container.appendChild(this.fantasmaVerde.element);

    }
    
    agregarEventos() {
        window.addEventListener("keydown", (e) => this.comecoco.mover(e));
        this.chekColisiones();
        this.reiniciarBtn.addEventListener("click", () => this.reiniciarJuego());
        document.getElementById("rightarrow").addEventListener("click", () => this.comecoco.mover({ key: "ArrowRight" }));
        document.getElementById("leftarrow").addEventListener("click", () => this.comecoco.mover({ key: "ArrowLeft" }));
        document.getElementById("uparrow").addEventListener("click", () => this.comecoco.mover({ key: "ArrowUp" }));
        document.getElementById("downarrow").addEventListener("click", () => this.comecoco.mover({ key: "ArrowDown" }));

        
        
    }
    
    chekColisiones() {
        setInterval(() => {
            this.fantasmas.forEach((fantasma, index) => {
                if (this.comecoco.colisionaCon(fantasma)) {
                    this.container.removeChild(fantasma.element);
                    this.fantasmas.splice(index, 1);
                    this.actualizarPuntuacion(100);
                    this.sonidofantasma.play(); 
                    this.actualizarMatrizfantasmas();
 
                }
                if (this.comecoco.colisionaCon(this.fantasmaVerde)) {
                    this.container.removeChild(this.fantasmaVerde.element);
                    this.fantasmas.splice(index, 1);
                    this.actualizarPuntuacion(500);
                    // this.sonidoFantasmaVerde.play(); 
                    // preparar el final
                    
                }
            });
            

        }, 100);
    }
    actualizarPuntuacion(puntos) {
        this.puntuacion += puntos;
        this.puntosElement.textContent = `Puntos: ${this.puntuacion}`;
    }
    actualizarMatrizfantasmas() {
        const fantasmaVisual = document.createElement("div");
        fantasmaVisual.classList.add("fantasmaCazado");
        this.fantasmasGrid.appendChild(fantasmaVisual);
    }
    reiniciarJuego() {
        this.container.innerHTML = "";
        this.fantasmasGrid.innerHTML = "";
        this.puntuacion = 0;
        this.puntosElement.textContent = "Puntos: 0";
        this.fantasmas = [];

        this.crearEscenario();
    }
    
}

class Comecoco {
    constructor(container) {
        this.container = container; // Guardar referencia al contenedor
        this.x = 50;
        this.y = this.container.clientHeight - 60; // Ajustar para que no salga del contenedor
        this.width = 50;
        this.height = 50;
        this.velocidad = 10;
        this.saltando = false;
        this.ultimaDireccion = 1; // 1: derecha, -1: izquierda 0: subir y 2: bajar
        this.anchoContenedor = this.container.clientWidth; 
        this.altoContenedor = this.container.clientHeight; 
        this.element = document.createElement("div");
        this.element.classList.add("comecoco");
        this.imagen = document.createElement("img");
        this.imagen.src = "img/comecocod.png";
        this.element.appendChild(this.imagen);
        this.actualizarPosicion();
    }
    
    mover(evento) {
        if (evento.key === "ArrowRight" && this.x + this.width + this.velocidad <= this.anchoContenedor) { 
               this.x += this.velocidad;
               if ( this.ultimaDireccion != 1){
                   this.ultimaDireccion = 1;
                   this.imagen.src = "img/comecocod.png"; 
                   this.element.appendChild(this.imagen);
               }
            
        } else if (evento.key === "ArrowLeft" && this.x - this.velocidad >= 0) {
            this.x -= this.velocidad;
            if ( this.ultimaDireccion != -1){
                this.ultimaDireccion = -1;
                this.imagen.src = "img/comecocoi.png"; 
                this.element.appendChild(this.imagen);
            }
        } else if (evento.key === "ArrowUp" && this.y - this.velocidad >= 0 ) {
            this.y -= this.velocidad;
            if ( this.ultimaDireccion != 2){
                this.ultimaDireccion = 2;
                this.imagen.src = "img/comecocoa.png"; 
                this.element.appendChild(this.imagen);
            }
                 
          //bajar  
        } else if( evento.key === "ArrowDown" && this.y + this.height + this.velocidad <= this.altoContenedor ){
            this.y += this.velocidad;
            if ( this.ultimaDireccion != 0){
                this.ultimaDireccion = 0;
                this.imagen.src = "img/comecocobajo.png"; 
                this.element.appendChild(this.imagen);
            }
        }
        this.actualizarPosicion();
    }
    
    actualizarPosicion() {
        this.element.style.left = `${this.x}px`;
        this.element.style.top = `${this.y}px`;
    }
    
    colisionaCon(objeto) { 
        return (
            this.x < objeto.x + objeto.width &&
            this.x + this.width > objeto.x &&
            this.y < objeto.y + objeto.height &&
            this.y + this.height > objeto.y
        );
    }
}

class Fantasma {
    constructor(container) {
        this.container = container; // Guardar referencia al contenedor
        this.x = Math.random() * (this.container.clientWidth - 40); 
        this.y = Math.random() * (this.container.clientHeight - 40);
        this.width = 30;
        this.height = 30;
        this.element = document.createElement("div");
        this.element.classList.add("fantasma");
        this.actualizarPosicion();
        
        console.log("fantasma creado en:", this.x, this.y);
    }
    
    actualizarPosicion() {
        this.element.style.left = `${this.x}px`;
        this.element.style.top = `${this.y}px`;
    }
}
class FantasmaEspecial {
    constructor(container) {
        this.container = container;
        this.width = 40;
        this.height = 40;
        this.x = Math.random() * (this.container.clientWidth - this.width);
        this.y = Math.random() * (this.container.clientHeight - this.height);
        
        this.element = document.createElement("div");
        this.element.classList.add("fantasmaVerde");
        this.element.style.backgroundImage = "url('img/fantasma2.png')";
        this.element.style.width = `${this.width}px`;
        this.element.style.height = `${this.height}px`;
        this.actualizarPosicion();

        setInterval(() => this.reubicar(), 2000);
    }

    actualizarPosicion() {
        this.element.style.left = `${this.x}px`;
        this.element.style.top = `${this.y}px`;
    }

    reubicar() {
        this.x = Math.random() * (this.container.clientWidth - this.width);
        this.y = Math.random() * (this.container.clientHeight - this.height);
        this.actualizarPosicion();
    }
}
// Instanciar el juego
const juego = new Game();
