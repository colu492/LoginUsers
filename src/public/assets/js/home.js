const addForm = document.getElementById("addForm");

// Se agrega un evento de escucha para el evento "submit" del formulario
addForm.addEventListener("submit", async (e) => {
  e.preventDefault(); // Se evita el comportamiento predeterminado del formulario

  // Se obtienen los valores de los campos del formulario
    const title = document.getElementById("title").value;
    const description = document.getElementById("description").value;
    const price = document.getElementById("price").value;
    const thumbnail = document.getElementById("thumbnail").value;
    const stock = document.getElementById("stock").value;
    const category = document.getElementById("category").value;

    // Se envía una solicitud POST al servidor utilizando la URL
    const response = await fetch("http://127.0.0.1:8080/api/products", {
        method: "POST",
        headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
        },
        body: JSON.stringify({
        title,
        description,
        price: +price,
        thumbnail,
        stock: +stock,
        category
        })
    });

    // Se espera la respuesta del servidor en formato JSON
    const data = await response.json();

    // Se verifica el estado de la respuesta
    if (response.status == 200) {
        alert("Se agregó correctamente el producto");
    } else {
        alert("Error: No se pudo agregar el producto");
    }
});
