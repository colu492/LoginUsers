import fs from "fs";

class CartManager {
  // Clase que gestiona los carritos

    constructor(path) {
        this.path = path; // Ruta del archivo donde se almacenará la información del carrito
    }

    read = () => {
        // Método para leer el contenido del archivo de carrito
        if (fs.existsSync(this.path)) {
        // Verifica si el archivo existe
        return fs.promises
            .readFile(this.path, "utf-8") // Lee el contenido del archivo
            .then((r) => JSON.parse(r)); // Convierte los datos del archivo en formato JSON y los retorna
        }
        return []; // Si el archivo no existe, retorna un arreglo vacío
    };

    write = (list) => {
        // Método para escribir en el archivo de carrito
        return fs.promises.writeFile(this.path, JSON.stringify(list)); // Escribe en el archivo los datos en formato JSON
    };

    getNextID = (list) => {
        // Método para obtener el siguiente ID disponible en la lista de carritos
        const count = list.length;
        return count > 0 ? list[count - 1].id + 1 : 1; // Si hay carritos en la lista, retorna el ID siguiente al último carrito; de lo contrario, retorna 1
    };

    getById = async (id) => {
        // Método para obtener un carrito por su ID
        const data = await this.read(); // Lee los datos del archivo
        return data.find((p) => p.id == id); // Busca y retorna el carrito con el ID especificado en los datos
    };

    get = async () => {
        // Método para obtener todos los carritos
        const data = await this.read(); // Lee los datos del archivo
        return data; // Retorna todos los carritos
    };

    create = async () => {
        // Método para crear un nuevo carrito
        const carts = await this.read(); // Lee los datos del archivo
        const nextID = this.getNextID(carts); // Obtiene el siguiente ID disponible
        const newCart = {
        id: nextID,
        products: [],
        }; // Crea un nuevo carrito con el ID generado y una lista vacía de productos
        carts.push(newCart); // Agrega el nuevo carrito a la lista
        await this.write(carts); // Escribe la lista actualizada en el archivo
        return newCart; // Retorna el nuevo carrito creado
    };

    update = async (id, obj) => {
        // Método para actualizar un carrito por su ID
        obj.id = id; // Asigna el ID al objeto que se va a actualizar
        const list = await this.read(); // Lee los datos del archivo
        for (let i = 0; i < list.length; i++) {
        // Recorre la lista de carritos
        if (list[i].id == id) {
            // Busca el carrito con el ID especificado
            list[i] = obj; // Actualiza el carrito con el nuevo objeto
            await this.write(list); // Escribe la lista actualizada en el archivo
            break; // Finaliza el bucle
        }
        }
    };

    addProduct = async (cartID, productID) => {
        // Método para agregar un producto a un carrito
        const cart = await this.getById(cartID); // Obtiene el carrito por su ID
        let found = false; // Variable para indicar si se encontró el producto en el carrito
        for (let i = 0; i < cart.products.length; i++) {
        // Recorre la lista de productos en el carrito
        if (cart.products[i].id == productID) {
            // Si encuentra el producto en el carrito
            cart.products[i].quantity++; // Incrementa la cantidad del producto
            found = true; // Establece found como true para indicar que se encontró el producto
            break; // Finaliza el bucle
        }
        }
        if (found == false) {
        // Si no se encontró el producto en el carrito
        cart.products.push({ id: productID, quantity: 1 }); // Agrega el nuevo producto al carrito con una cantidad de 1
        }
        await this.update(cartID, cart); // Actualiza el carrito en el archivo
        return cart; // Retorna el carrito actualizado
    }
}

export default CartManager;
