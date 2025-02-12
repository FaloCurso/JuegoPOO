// Clases
class Game {
    constructor() {
        this.container = document.getElementById("game-container");
        this.puntosElement = document.getElementById("puntos");
        this.personaje = null;
        this.monedas = [];
        this.puntuacion = 0;
        this.anchoContenedor = this.container.clientWidth;
        this.altoContenedor = this.container.clientHeight;
        this.sonidoMoneda = new Audio('img/sonido.mp3');
        this.crearEscenario();
        this.agregarEventos();
    }
    
    crearEscenario() {   
        this.personaje = new Personaje(this.container); // Pasar el contenedor
        this.container.appendChild(this.personaje.element);
        
        for (let i = 0; i < 10; i++) {
            const moneda = new Moneda(this.container); 
            this.monedas.push(moneda);
            this.container.appendChild(moneda.element);
        }
    }
    
    agregarEventos() {
        window.addEventListener("keydown", (e) => this.personaje.mover(e));
        this.chekColisiones();
    }
    
    chekColisiones() {
        setInterval(() => {
            this.monedas.forEach((moneda, index) => {
                if (this.personaje.colisionaCon(moneda)) {
                    this.container.removeChild(moneda.element);
                    this.monedas.splice(index, 1);
                    this.actualizarPuntuacion(10);
                    this.sonidoMoneda.play(); 
                }
            });
        }, 100);
    }
    actualizarPuntuacion(puntos) {
        this.puntuacion += puntos;
        this.puntosElement.textContent = `Puntos: ${this.puntuacion}`;
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
        this.ultimaDireccion = 1; // 1: derecha, -1: izquierda 0 caer
        this.anchoContenedor = this.container.clientWidth; // Obtener el ancho real del contenedor
        this.element = document.createElement("div");
        this.element.classList.add("personaje");
        this.imagen = document.createElement("img");
        this.imagen.src = "img/comecocod.png"; // Agregamos la imagen
        this.element.appendChild(this.imagen);
        this.actualizarPosicion();
    }
    
    mover(evento) {
        if (evento.key === "ArrowRight") { 
            if (this.x + this.width + this.velocidad <= this.anchoContenedor) {
                this.x += this.velocidad;
               if ( this.ultimaDireccion === -1){
                   this.ultimaDireccion = 1;
                   this.imagen.src = "img/comecocod.png"; 
                   this.element.appendChild(this.imagen);
               }
                
            }
        } else if (evento.key === "ArrowLeft" && this.x - this.velocidad >= 0) {
            this.x -= this.velocidad;
            if ( this.ultimaDireccion === 1){
                this.ultimaDireccion = -1;
                this.imagen.src = "img/comecocoi.png"; 
                this.element.appendChild(this.imagen);
            }
        } else if (evento.key === "ArrowUp" && !this.saltando) {
            this.imagen.src = "img/comecocoa.png"; 
            this.element.appendChild(this.imagen);
            // this.ultimaDireccion = 0;
            this.saltar();
        }
        this.actualizarPosicion();
    }
    
    saltar() {
        this.saltando = true;
        let alturaMaxima = this.y - 320;
        const salto = setInterval(() => {
            if (this.y > alturaMaxima) {
                this.y -= 10;
            } else {
                clearInterval(salto);
                this.caer();
            }
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

// Instanciar el juego
const juego = new Game();
