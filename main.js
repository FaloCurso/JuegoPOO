// Clases
class Game {
    constructor() {
        this.container = document.getElementById("game-container");
        this.puntosElement = document.getElementById("puntos");
        this.monedasGrid = document.getElementById("ListaFantasmas");
        this.reiniciarBtn = document.getElementById("reiniciar-btn");
        this.personaje = null;
        this.monedas = [];
        this.puntuacion = 0;
        this.anchoContenedor = this.container.clientWidth;
        this.altoContenedor = this.container.clientHeight;
        this.sonidoMoneda = new Audio('img/sonido.mp3');
        this.sonidoFantasmaVerde = new Audio('img/sonidoterminar.mp3');
        this.fantasmaVerde = null;
        this.crearEscenario();
        this.agregarEventos();
    }
    
    crearEscenario() {   
        this.personaje = new Personaje(this.container); // Pasar el contenedor
        this.container.appendChild(this.personaje.element);
        
        for (let i = 0; i < 8; i++) {
            const moneda = new Moneda(this.container); 
            this.monedas.push(moneda);
            this.container.appendChild(moneda.element);
        }
        this.fantasmaVerde = new MonedaEspecial(this.container);
        this.container.appendChild(this.fantasmaVerde.element);

    }
    
    agregarEventos() {
        window.addEventListener("keydown", (e) => this.personaje.mover(e));
        this.chekColisiones();
        this.reiniciarBtn.addEventListener("click", () => this.reiniciarJuego());

    }
    
    chekColisiones() {
        setInterval(() => {
            this.monedas.forEach((moneda, index) => {
                if (this.personaje.colisionaCon(moneda)) {
                    this.container.removeChild(moneda.element);
                    this.monedas.splice(index, 1);
                    this.actualizarPuntuacion(100);
                    this.sonidoMoneda.play(); 
                    this.actualizarMatrizMonedas();
 
                }
                if (this.personaje.colisionaCon(this.fantasmaVerde)) {
                    this.container.removeChild(this.fantasmaVerde.element);
                    this.monedas.splice(index, 1);
                    this.actualizarPuntuacion(500);
                    this.sonidoFantasmaVerde.play(); 
                    // preparar el final
                    
                }
            });
            

        }, 100);
    }
    actualizarPuntuacion(puntos) {
        this.puntuacion += puntos;
        this.puntosElement.textContent = `Puntos: ${this.puntuacion}`;
    }
    actualizarMatrizMonedas() {
        const monedaVisual = document.createElement("div");
        monedaVisual.classList.add("fantasmaCazado");
        this.monedasGrid.appendChild(monedaVisual);
    }
    reiniciarJuego() {
        this.container.innerHTML = "";
        this.monedasGrid.innerHTML = "";
        this.puntuacion = 0;
        this.puntosElement.textContent = "Puntos: 0";
        this.monedas = [];

        this.crearEscenario();
    }
    
}

class Personaje {
    constructor(container) {
        this.container = container; // Guardar referencia al contenedor
        this.x = 50;
        this.y = this.container.clientHeight - 60; // Ajustar para que no salga del contenedor
        this.width = 50;
        this.height = 50;
        this.velocidad = 10;
        this.saltando = false;
        this.ultimaDireccion = 1; // 1: derecha, -1: izquierda 0 caer y 2 subir
        this.anchoContenedor = this.container.clientWidth; // Obtener el ancho real del contenedor
        this.element = document.createElement("div");
        this.element.classList.add("personaje");
        this.imagen = document.createElement("img");
        this.imagen.src = "img/comecocod.png";
        this.element.appendChild(this.imagen);
        this.actualizarPosicion();
    }
    
    mover(evento) {
        if (evento.key === "ArrowRight") { 
            if (this.x + this.width + this.velocidad <= this.anchoContenedor) {
                this.x += this.velocidad;
               if ( this.ultimaDireccion != 1){
                   this.ultimaDireccion = 1;
                   this.imagen.src = "img/comecocod.png"; 
                   this.element.appendChild(this.imagen);
               }
                
            }
        } else if (evento.key === "ArrowLeft" && this.x - this.velocidad >= 0) {
            this.x -= this.velocidad;
            if ( this.ultimaDireccion != -1){
                this.ultimaDireccion = -1;
                this.imagen.src = "img/comecocoi.png"; 
                this.element.appendChild(this.imagen);
            }
        } else if (evento.key === "ArrowUp" ) {
            this.y -= this.velocidad;
            if ( this.ultimaDireccion != 2){
                this.ultimaDireccion = 2;
                this.imagen.src = "img/comecocoa.png"; 
                this.element.appendChild(this.imagen);
            }
                 
            // this.saltar();
        } else if( evento.key === "ArrowDown"){
            this.y += this.velocidad;
            if ( this.ultimaDireccion != 0){
                this.ultimaDireccion = 0;
                this.imagen.src = "img/comecocoabajo.png"; 
                this.element.appendChild(this.imagen);
            }
        }
        this.actualizarPosicion();
    }
    
    saltar() {
        // this.saltando = true;
        let alturaMaxima = this.y - 100;
        this.ultimaDireccion = 0;

        const salto = setInterval(() => {
            if (this.y > alturaMaxima) {
                this.y -= 10;
            } /*else {
                clearInterval(salto);
                this.caer(); 
            }*/
            this.actualizarPosicion();
        }, 20);
        
    }
    
    caer() {
        const gravedad = setInterval(() => {
            if (this.y < this.container.clientHeight - 60) { 
                this.y += 10;
            } else {
                clearInterval(gravedad);
                this.saltando=false;
            }
            this.actualizarPosicion();
        }, 20);
        if ( this.ultimaDireccion === -1){
            this.imagen.src = "img/comecocoi.png"; 
            this.element.appendChild(this.imagen);
        }else  {
            this.imagen.src = "img/comecocod.png"; 
            this.element.appendChild(this.imagen);
        }
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

class Moneda {
    constructor(container) {
        this.container = container; // Guardar referencia al contenedor
        this.x = Math.random() * (this.container.clientWidth - 40); 
        this.y = Math.random() * (this.container.clientHeight - 40);
        this.width = 30;
        this.height = 30;
        this.element = document.createElement("div");
        this.element.classList.add("moneda");
        this.actualizarPosicion();
        
        console.log("Moneda creada en:", this.x, this.y);
    }
    
    actualizarPosicion() {
        this.element.style.left = `${this.x}px`;
        this.element.style.top = `${this.y}px`;
    }
}
class MonedaEspecial {
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

        setInterval(() => this.reubicar(), 4000);
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
