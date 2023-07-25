const errorDictionary = {
    1001: 'Producto no encontrado',
    1002: 'Producto sin stock suficiente',
    1003: 'Producto ya agregado al carrito',
};

export function customizeError(errorCode) {
    const errorMessage = errorDictionary[errorCode] || 'Error desconocido';
    return { error: errorMessage };
}