
const listadoBulls = "paginas/nombreToros.json";

//DOM
const contenedorToros=document.getElementById("contenedorToros")

fetch (listadoBulls)
    .then(respuesta => respuesta.json())
    .then((datos) => {
    mostrarToros(datos) 
})

//Creo un array carrito
let carrito = []

recoverFromLocalStorage()



//Función para mostrar productos
function mostrarToros(datos){
    datos.forEach((producto)=>{
        const card =document.createElement("div")
        card.classList.add("col-xl-3","col-md-6","col-xs-12")
        card.innerHTML=`
            <div class="card espacioTop">
                <img src= "${producto.img}" class="card-img-top imgProductos" alt="${producto.nombre}">
                <div class="card-body">
                <h5 class="card-title centrar"> ${producto.nombre} </h5>
                <p class="card-text centrar">$ ${producto.precio} </p>
                <button class="btn colorBoton" id="boton${producto.id}">Comprar</button>
                </div>
            </div>
        `
        contenedorToros.appendChild(card)

        //Agregar productos al carrito
        const boton = document.getElementById(`boton${producto.id}`)
        boton.addEventListener("click",()=> {
            agregarAlCarrito(producto.id)

            Toastify({
                text:"Producto seleccionado",
                duration:5000,
                gravity:"bottom",
                position:"left",
                style:
                {
                    background:"#7fff00",
                }

            }).showToast()

        })
    })
}

const agregarAlCarrito= (id)=> {
    fetch (listadoBulls)
    .then(respuesta => respuesta.json())
    .then((datos) => {  

    const producto = datos.find((producto)=>producto.id === id)
    const productoEnCarrito = carrito.find((producto)=>producto.id === id)
    if(productoEnCarrito){
        productoEnCarrito.cantidad++
    }
    else{
        carrito.push(producto)
        saveToLocalStorage()
        
    }
    calcularTotal ()
    mostrarProductos()
})    
}

const contenedorCarrito=document.getElementById("contenedorCarrito")
const verCarrito=document.getElementById("verCarrito")
verCarrito.addEventListener("click", ()=> {
    mostrarCarrito()
})

const mostrarCarrito=()=>{
    contenedorCarrito.innerHTML=""
    carrito.forEach((producto)=>{
        const card =document.createElement("div")
        card.classList.add("row")
        card.innerHTML = `
        <div class="col-3  d-flex align-item-center p-2">
        <img src="${producto.img}" width="60" alt="${producto.nombre}">  </div>
        <div class="col-3 d-flex align-item-center ">${producto.nombre}</div>
        <div class="col-2 d-flex align-item-center justify-content-center ">${producto.precio}</div>
        <div class="col-1 d-flex align-item-center justify-content-center "> ${producto.cantidad}</div>
          <div class="col-2">
        <button class="btn colorBoton" id="eliminar${producto.id}">Eliminar</button></div>
        `
        contenedorCarrito.appendChild(card)

        //Eliminar productos del carrito

        const boton=document.getElementById(`eliminar${producto.id}`)
        boton.addEventListener("click", ()=> {
            producto.cantidad=1
            eliminarDelCarrito (producto.id)
            saveToLocalStorage ()
            Toastify({
                text:"Producto eliminado",
                duration:3000,
                gravity:"top",
                position:"right",
                style:
                {
                    background:"#ffd700",
                }

            }).showToast()
        })
    })
    calcularTotal ()
}       


const eliminarDelCarrito = (id) => {
    const producto = carrito.find((producto) => producto.id === id)
    const indice = carrito.indexOf(producto)
    carrito.splice(indice,1)
    mostrarCarrito()

    saveToLocalStorage()
    
}

//Vacias carrito de compras

const vaciarCarrito = document.getElementById("vaciarCarrito")
vaciarCarrito.addEventListener("click", ()=> {
    eliminarTodoElCarrito()

    localStorage.clear()

    Toastify({
        text:"Se ha vaciado el carrito",
        duration:3000,
        gravity:"top",
        position:"center",
        style:
        {
            background:"red",
        }

    }).showToast()
})

const eliminarTodoElCarrito=()=>{
    carrito.forEach((producto) =>{
        producto.cantidad=1
        carrito=[]
    mostrarCarrito()
    localStorage.clear()
    })   
}

//Total de la compra
const total=document.getElementById("total")
const calcularTotal = () => {
    fetch(listadoBulls)
        .then(respuesta => respuesta.json())
        .then(() => {
            let totalCompra = 0
            carrito.forEach((producto)=>{
            totalCompra += producto.precio * producto.cantidad
            })
            
        total.innerHTML = `$${totalCompra}`

        const finalizarCompra = document.getElementById("finalizarCompra");

        finalizarCompra.addEventListener("click",() => {
        Swal.fire({
                   title:`Compra finalizada`,
                   text:`Gracias por utilizar nuestros servicios`,
                   backdrop: `rgb(85,107,47)`,
                   background: `#eaf7a6`,
                   icon: `success`,
                   confirmButtonText:`Aceptar`,
                   
            
                })
            })
        
        })
}



// Recuperar del localStorage
function recoverFromLocalStorage(){
    if (localStorage.getItem("carrito")){
        carrito=JSON.parse(localStorage.getItem("carrito"))
    }
}



// Guardar del localStorage
function saveToLocalStorage(){
    localStorage.setItem("carrito",JSON.stringify(carrito))
}



