const table = document.getElementById('productsTable');
const socket = io();

// Evento para recibir los productos actualizados desde el servidor
socket.on('updatedProducts', data => {
  // Se limpia el contenido actual de la tabla
    table.innerHTML = `
        <tr>
        <td><strong>Producto</strong></td>
        <td><strong>Descripción</strong></td>
        <td><strong>Precio</strong></td>
        <td><strong>Código</strong></td>
        <td><strong>Stock</strong></td>
        <td><strong>Categoría</strong></td>
        </tr>`;

    // Se recorren los productos recibidos y se crea una nueva fila <tr> para cada producto
    for (const product of data) {
        let tr = document.createElement('tr');
        tr.innerHTML = `
        <td>${product.title}</td>
        <td>${product.description}</td>
        <td>${product.price}</td>
        <td>${product.code}</td>
        <td>${product.stock}</td>
        <td>${product.category}</td>
        `;
        table.getElementsByTagName('tbody')[0].appendChild(tr);
    }
});
