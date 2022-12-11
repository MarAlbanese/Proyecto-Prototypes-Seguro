//Constructores
function Seguro (marca, year, tipo) {
    this.marca = marca;
    this.year = year;
    this.tipo = tipo;
}

//Realiza la cotizacion con los datos
Seguro.prototype.cotizarSeguro = function(){   //no puede haber arrow function si hay un elemento this dentro de ella
   
    /*
        1= Amricano 1.115
        2= Asiatico 1.05
        3= Europeo 1.35

    */

    let cantidad;
    const base = 2000;

    switch(this.marca){     //para swich siempre se usa el default
        case "1":
            cantidad = base * 1.15;
            break; //siempre despues de evaluar un codigo con switch va un brak
       
        case "2":
            cantidad = base * 1.05;
            break;
        case "3":
            cantidad = base * 1.35;
            break;
        default:
            break;
    }
    //Leer el año
    const diferencia = new Date().getFullYear() - this.year;

    //Cada año que la diferencia es mayor, el corto debe reducirse un 3%
    cantidad -=((diferencia * 3) * cantidad) / 100;
    
    /*
        Si el seguro basico se multiplica por un 30% mas
        Si el seguro es basico se multiplica por un 50% mas 
    */
    if(this.tipo==="basico"){
        cantidad *=1.30;
    }else{
        cantidad *=1.50;
    }
    return cantidad;
}    //Hasta aca el prototype que hara todos esos calculos y retornara una cantidad
     // NOTA: las funciones que retornan valores es porque se va a hacer algo mas

function UI () {}

// Llena las opciones de los años
UI.prototype.llenarOpciones = ()=> {     //esta funcion genera HTML y esta separa de la funcion Seguro 
    const max = new Date().getFullYear();
          min = max-23;
    const selectYear = document.querySelector("#year");

    for(let i= max; i>min; i--){
        let option = document.createElement("option");
        option.value = i;
        option.textContent = i;
        selectYear.appendChild (option);
    }
}

//Mostrar alertas en pantalla
UI.prototype.mostrarMensaje = (mensaje, tipo) =>{

    const div = document.createElement("div");

    if( tipo === "error") {
        div.classList.add("error");
    } else {
        div.classList.add("correcto");
    }

    div.classList.add("mensaje", "mt-10");
    div.textContent = mensaje;

    //Insertar en el HTML
    const formulario = document.querySelector("#cotizar-seguro");
    formulario.insertBefore(div, document.querySelector("#resultado")); //en insertbefore es el nuevo nodo (div) y luego el de referencia (#resultado)

    setTimeout(() => {
        div.remove();
    }, 3000);
}
UI.prototype.mostrarResultado = (total, seguro) => {

    const {marca, year, tipo } = seguro;
    
    let textoMarca;

    switch (marca) {
        case "1":
            textoMarca = "Americano";
            break;
        case "2":
            textoMarca = "Asiatico";
            break;
        case "3":
            textoMarca = "Europeo";
            break;
        default:
            break;
    }
    //crear el resultado
    const div = document.createElement("div");
    div.classList.add("mt-10");
    div.innerHTML = `
    <p class="header"> Tu Resumen</p>
    <p class="font-bold">Marca: <span class="font-normal"> ${textoMarca} </span></p>
    <p class="font-bold">Año: <span class="font-normal">  ${year} </span></p>
    <p class="font-bold">Tipo: <span class="font-normal capitalize"> ${tipo} </span></p>
    <p class="font-bold">Total: <span class="font-normal"> $ ${total} </span></p>
    `;

    const resultadoDiv= document.querySelector("#resultado");
   

    //Mostrar el spinner
    const spinner = document.querySelector("#cargando");
    spinner.style.display= 'block';

    setTimeout(() => {
        spinner.style.display="none"; //se borra el spinner
        resultadoDiv.appendChild(div); // Se muestra el resultado
    }, 3000);

}

//instanciar UI
const ui = new UI();

document.addEventListener("DOMContentLoaded", () => {
    ui.llenarOpciones();  //Llena el select con los años...
})

eventListeners();
function eventListeners(){
    const formulario = document.querySelector("#cotizar-seguro");   //no se recomiendo usar eventlisteners en prototyp
    formulario.addEventListener("submit", cotizarSeguro);
}

function cotizarSeguro(e) {
    e.preventDefault();
    // Leer la marca seleccionada 
    const marca = document.querySelector("#marca").value;
    
    // Leer el año seleccionado    
    const year = document.querySelector("#year").value;
    
    // Leer el tipo de cobertura
    const tipo = document.querySelector('input[name="tipo"]:checked').value; //esto sirve para seleccionar radio buttom
    
    if(marca=== '' || year ==='' || tipo === ''){
        ui.mostrarMensaje("todos los campos son obligatorios", "error");

        return;
    }

    ui.mostrarMensaje("cotizando...", "exito");

    //Ocultar mensaje de cotizaciones previas
    const resultados = document.querySelector(`#resultado div`);
    if(resultados !=null) {
        resultados.remove();
    }


    //Instanciar el seguro
    const seguro = new Seguro(marca, year, tipo);
    const total= seguro.cotizarSeguro();

    //Utilizar el Prototype que va a cotizar 
    ui.mostrarResultado(total, seguro);
    }