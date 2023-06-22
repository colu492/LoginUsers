import fs from "fs";

class ProductManager {
  // Clase que gestiona la lectura y escritura de archivos

    constructor(path) {
        this.path = path; // Ruta del archivo a gestionar
    }

    read = () => {
        // Método para leer el contenido del archivo
        if (fs.existsSync(this.path)) {
        // Verifica si el archivo existe
        return fs.promises
            .readFile(this.path, "utf-8") // Lee el contenido del archivo
            .then((r) => JSON.parse(r)); // Convierte los datos del archivo en formato JSON y los retorna
        }
        return []; // Si el archivo no existe, retorna un arreglo vacío
    };

    write = (list) => {
        // Método para escribir en el archivo
        return fs.promises.writeFile(this.path, JSON.stringify(list)); // Escribe en el archivo los datos en formato JSON
    };

    getNextID = (list) => {
        // Método para obtener el siguiente ID disponible en la lista
        const count = list.length;
        return count > 0 ? list[count - 1].id + 1 : 1; // Si hay elementos en la lista, retorna el ID siguiente al último elemento; de lo contrario, retorna 1
    };

    getCode = (list) => {
        // Método para generar un nuevo código único
        let newCode = Math.floor(Math.random(1) * 10000); // Genera un número aleatorio entre 0 y 10000
        const verif = list.some((item) => item.code === newCode); // Verifica si el código generado ya existe en la lista
        return verif === true ? (newCode = "ERROR") : newCode; // Si el código generado ya existe, se establece "ERROR" como el nuevo código; de lo contrario, se utiliza el código generado
    };

    getById = async (id) => {
        // Método para obtener un elemento por su ID
        const data = await this.read(); // Lee los datos del archivo
        return data.find((p) => p.id == id); // Busca y retorna el elemento con el ID especificado en los datos
    };

    deleteById = async (id) => {
        // Método para eliminar un elemento por su ID
        const data = await this.read(); // Lee los datos del archivo
        const deleteObj = data.findIndex((o) => o.id == id); // Busca el índice del elemento a eliminar en la lista
        const deleted = data.splice(deleteObj, 1); // Elimina el elemento de la lista
        await this.write(data); // Escribe la lista actualizada en el archivo
        return deleted; // Retorna el elemento eliminado
    };

    get = async () => {
        // Método para obtener todos los elementos
        const data = await this.read(); // Lee los datos del archivo
        return data; // Retorna todos los elementos
    };

    add = async (obj) => {
        // Método para agregar un nuevo elemento
        const list = await this.read(); // Lee los datos del archivo
        const nextID = this.getNextID(list); // Obtiene el siguiente ID disponible
        const code = this.getCode(list); // Genera un nuevo código único
        obj.id = nextID; // Asigna el ID al objeto
        obj.code = code; // Asigna el código al objeto
        list.push(obj); // Agrega el objeto a la lista
        await this.write(list); // Escribe la lista actualizada en el archivo
        return obj; // Retorna el nuevo elemento creado
    };

    update = async (id, obj) => {
        // Método para actualizar un elemento por su ID
        obj.id = id; // Asigna el ID al objeto que se va a actualizar
        const list = await this.read(); // Lee los datos del archivo
        for (let i = 0; i < list.length; i++) {
        // Recorre la lista de elementos
        if (list[i].id == id) {
            // Busca el elemento con el ID especificado
            list[i] = obj; // Actualiza el elemento con el nuevo objeto
            await this.write(list); // Escribe la lista actualizada en el archivo
            break; // Finaliza el bucle
        }
        }
    };

    updateIdx = async (id, obj) => {
        // Método para actualizar un elemento por su ID utilizando el índice
        obj.id = id; // Asigna el ID al objeto que se va a actualizar
        const list = await this.read(); // Lee los datos del archivo
        const idx = list.findIndex((e) => e.id == id); // Busca el índice del elemento a actualizar en la lista
        if (idx < 0) return; // Si el índice no se encontró, finaliza el método
        list[idx] = obj; // Actualiza el elemento con el nuevo objeto
        await this.write(list); // Escribe la lista actualizada en el archivo
    }
}

export default ProductManager;
