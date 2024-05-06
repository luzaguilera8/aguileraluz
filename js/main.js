let productos = [];
let carrito = JSON.parse(localStorage.getItem("carrito")) || [];
let historialCompras = JSON.parse(localStorage.getItem("historialCompras")) || [];

async function obtenerProductos() {
    try {
        const response = await fetch('data/productos.json');
        if (!response.ok) {
            throw new Error('Error al obtener los datos de los productos');
        }
        const data = await response.json();
        productos = data.productos;
        renderizarProductos();
    } catch (error) {
        console.error(error);
        Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'Ocurrió un error al obtener los datos de los productos. Por favor, inténtalo de nuevo más tarde.'
        });
    }
}

obtenerProductos();

function agregarAlCarrito(index) {
    const productoSeleccionado = productos[index];
    carrito.push({...productoSeleccionado, cantidad: 1});
    localStorage.setItem("carrito", JSON.stringify(carrito));
    document.getElementById("carrito-total").textContent = `Total: $${calcularTotalCarrito()}`;
}

function renderizarProductos() {
    const productosContainer = document.getElementById("productos");
    productos.forEach((producto, index) => {
        const productoDiv = document.createElement("div");
        productoDiv.classList.add("producto");
        productoDiv.innerHTML = `
            <img src="${producto.img}" alt="${producto.titulo}">
            <h3>${producto.titulo}</h3>
            <p>${producto.descripcion}</p>
            <p>Precio: $${producto.precio}</p>
            <button onclick="agregarAlCarrito(${index})">Agregar al carrito</button>
        `;
        productosContainer.appendChild(productoDiv);
    });
}

function comprarProductos() {
    if (carrito.length === 0) {
        Swal.fire({
            icon: 'warning',
            title: '¡Carrito vacío!',
            text: 'El carrito está vacío. Agrega productos antes de comprar.'
        });
        return;
    }

    const fechaCompra = new Date().toLocaleString();
    historialCompras.push({ fecha: fechaCompra, productos: [...carrito], total: calcularTotalCarrito() });
    localStorage.setItem("historialCompras", JSON.stringify(historialCompras));

    vaciarCarrito();

    Swal.fire({
        icon: 'success',
        title: '¡Compra exitosa!',
        text: 'Gracias por tu compra.',
        showConfirmButton: false,
        timer: 2000
    });
}

function vaciarCarrito() {
    carrito = [];
    localStorage.removeItem("carrito");
    document.getElementById("carrito-total").textContent = 'Total: $0';
}

function mostrarHistorialCompras() {
    const historialComprasContainer = document.getElementById("historial-compras");
    historialComprasContainer.innerHTML = ""; // Limpiar el contenedor antes de mostrar el historial

    historialCompras.forEach((compra, index) => {
        const compraDiv = document.createElement("div");
        compraDiv.classList.add("compra");
        compraDiv.innerHTML = `
            <h3>Compra ${index + 1}</h3>
            <p>Fecha: ${compra.fecha}</p>
            <p>Total: $${compra.total}</p>
            <ul>
                ${compra.productos.map(producto => `<li>${producto.titulo} - $${producto.precio}</li>`).join("")}
            </ul>
        `;
        historialComprasContainer.appendChild(compraDiv);
    });
}

function borrarHistorialCompras() {
    historialCompras = [];
    localStorage.removeItem("historialCompras");
    mostrarHistorialCompras();
}

function calcularTotalCarrito() {
    let total = 0;
    carrito.forEach(item => {
        total += item.precio * item.cantidad;
    });
    return total;
}
