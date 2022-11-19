
const listadoBulls = "paginas/nombreToros.json";

//DOM
const contenedorToros=document.getElementById("contenedorToros")

fetch (listadoBulls)
    .then(respuesta => respuesta.json())
    .then((datos) => {
    mostrarToros(datos) 
    })

//creo array carrito
let carrito = []

recoverFromLocalStorage()



//funcion para mostrar productos
function mostrarToros(datos){
    datos.forEach((producto)=>{
        const card =document.createElement("div")
        card.classList.add("col-xl-3","col-md-6","col-xs-12")
        card.innerHTML=`
            <div class="card">
                <img src= "${producto.img}" class="card-img-top imgProductos" alt="${producto.nombre}">
                <div class="card-body">
                <h5 class="card-title"> ${producto.nombre} </h5>
                <p class="card-text">$ ${producto.precio} </p>
                <button class="btn colorBoton" id="boton${producto.id}">Agregar al Carrito</button>
                </div>
            </div>
        `
        contenedorToros.appendChild(card)

        //agregar productos al carrito
        const boton = document.getElementById(`boton${producto.id}`)
        boton.addEventListener("click",()=> {
            agregarAlCarrito(producto.id)

            Toastify({
                text:"Producto seleccionado",
                duration:5000,
                gravity:"bottom",
                position:"right",
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
        card.classList.add("col-xl-3","col-md-6","col-xs-12")
        card.innerHTML = `
            <div class="card">
                <img src= "${producto.img}" class="card-img-top imgProductos2" alt="${producto.nombre}">
                <div class="card-body">
                <h6 class="card-title"> ${producto.nombre} </h6>
                <p class="card-text"> ${producto.precio} </p>
                <p class="card-text"> ${producto.cantidad} </p>
                <button class="btn colorBoton" id="eliminar${producto.id}">Elimiar Producto</button>
                </div>
            </div>
        `
        contenedorCarrito.appendChild(card)

        //eliminar productos del carrito

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

//vacias carrito de compras

const vaciarCarrito = document.getElementById("vaciarCarrito")
vaciarCarrito.addEventListener("click", ()=> {
    eliminarTodoElCarrito()

    localStorage.clear()
})

const eliminarTodoElCarrito=()=>{
    carrito.forEach((producto) =>{
        producto.cantidad=1
        carrito=[]
    mostrarCarrito()
    localStorage.clear()
    })
    
}

//total de la compra
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
        
        })
}



// recuperar del localStorage
function recoverFromLocalStorage(){
    if (localStorage.getItem("carrito")){
        carrito=JSON.parse(localStorage.getItem("carrito"))
    }
}



// guardar del localStorage
function saveToLocalStorage(){
    localStorage.setItem("carrito",JSON.stringify(carrito))
}



