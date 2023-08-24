import swaggerJSDoc from 'swagger-jsdoc';

const options = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'Documentación de API',
            description: 'awesome documentation for my coder class',
            version: '1.0.0',
        },
    },
    apis: ['./src/routes/products.router.js', './src/routes/carts.router.js'], 
};

const swaggerSpec = swaggerJSDoc(options);

export default swaggerSpec;
