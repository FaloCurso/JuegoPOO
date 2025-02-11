//clases

class Game {
    constructor(){
        this.container = document.getElementById("game-container");
        this.personaje = null;
        this.monedas = [];
        this.puntuacion = 0;
        this.anchoContenedor = this.container.clientWidth;
        this.altoContenedor = this.container.clientHeight;
        this.crearEscenario();
        this.agregarEventos();
    }
    crearEscenario(){   
        this.personaje = new Personaje();
        this.container.appendChild(this.personaje.element)  // lo posicionamos dentro del contenedor
        for (let i = 0; i<5; i++){
            const moneda = new Moneda();
            this.monedas.push(moneda);
            this.container.appendChild(moneda.element); //incluir la moneda dentro del contenedor definido en la linea 5
        }
    }
    agregarEventos(){
        window.addEventListener("keydown", (e) => this.personaje.mover(e)); // cuando se pulse una tecla presionada llama al personaje
        this.chekColisiones();   // verificar si choca con una moneda
    }
    chekColisiones(){
        setInterval( ()=> {
            this.monedas.forEach((moneda,index)=>{
                if (this.personaje.colisionaCon(moneda)){ // si un personaje choca con una moneda que se quite del contenedor
                    this.container.removeChild(moneda.element);
                    this.monedas.splice(index, 1); // quita la moneda edl array que representa el for por index
                }
            })
        },
            100) // se revisa cada milisegundo
    }
}
class Personaje{
    constructor(){
        this.x = 50;
        this.y = 300;
        this.width = 50;
        this.height =50;
        this.velocidad = 10;
        this.saltando = false;
        this.element = document.createElement("div"); // crea el div
        this.element.classList.add("personaje");
        this.actualizarPosicion();
    }
    mover(evento){
        if (evento.key === "ArrowRight") { 
             this.x += this.velocidad;
         }else if(evento.key === "ArrowLeft" && this.x - this.velocidad >= 0){
            this.x -= this.velocidad;
         }else if( evento.key === "ArrowUp"){
            this.saltar();
         }
         this.actualizarPosicion();
    }
    saltar(){
        this.saltando = true;
        let alturaMaxima = this.y-100;
        const salto = setInterval (() => {
            if (this.y > alturaMaxima){
                this.y -= 100; // se desplaza arriba gravedad 9.8
            }else {
                clearInterval(salto);
                this.caer();
            }
            this.actualizarPosicion();
        },
            20)
    }
    caer(){
        const gravedad = setInterval(() => {
            if (this.y < 300 ){
                this.y += 10;
            }else {
                clearInterval(gravedad);
            }
            this.actualizarPosicion();
        },
            20)
    }
    actualizarPosicion(){
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
class Moneda{
    constructor(){
        this.x = Math.random()* 700 + 50;
        this.y = Math.random()* 250 + 50;
        this.width = 30;
        this.height = 30;
        this.element = document.createElement("div");
        this.element.classList.add("moneda");
        this.actualizarPosicion();
    }
    actualizarPosicion(){
        this.element.style.left = `${this.x}px`;
        this.element.style.top = `${this.y}px`;
    }
}
// instanciar
const juego = new Game()

