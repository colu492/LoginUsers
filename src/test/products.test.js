import chai from 'chai';
import chaiHttp from 'chai-http';
import app from '../app.js';

chai.use(chaiHttp);
const expect = chai.expect;

describe('Products Router Tests', () => {
    let testProductId = '';

    // Agregar un producto de prueba antes de los tests
    before(async () => {
        const productData = {
            name: 'Test Product',
            price: 10.99,
            stock: 100
        };

        const response = await chai.request(app)
            .post('/api/products')
            .send(productData);

        testProductId = response.body._id;
    });

    // Test para obtener todos los productos
    it('should get all products', async () => {
        const res = await chai.request(app).get('/api/products');
        expect(res).to.have.status(200);
        expect(res.body).to.be.an('array');
    });

    // Test para obtener un producto por su ID
    it('should get a product by ID', async () => {
        const res = await chai.request(app).get(`/api/products/${testProductId}`);
        expect(res).to.have.status(200);
        expect(res.body).to.be.an('object');
    });

    // Test para eliminar un producto por su ID (debe ser administrador)
    it('should delete a product by ID', async () => {
        const res = await chai.request(app)
            .delete(`/api/products/${testProductId}`)
            .set('Authorization', '$2b$10$HECBcrKEFRzLBQRIKp76j.4efwsa5Asi1yEylrxK2AEUsqLofN6Qu');
        expect(res).to.have.status(200);
        expect(res.body).to.have.property('message');
    });

    // Test para crear un nuevo producto (debe ser administrador)
    it('should create a new product', async () => {
        const productData = {
            name: 'New Test Product',
            price: 19.99,
            stock: 50
        };

        const res = await chai.request(app)
            .post('/api/products')
            .set('Authorization', '$2b$10$HECBcrKEFRzLBQRIKp76j.4efwsa5Asi1yEylrxK2AEUsqLofN6Qu') 
            .send(productData);

        expect(res).to.have.status(200);
        expect(res.body).to.be.an('object');
    });

    // Test para actualizar un producto por su ID (debe ser administrador)
    it('should update a product by ID', async () => {
        const updatedProductData = {
            name: 'Updated Test Product',
            price: 15.99,
            stock: 75
        };

        const res = await chai.request(app)
            .put(`/api/products/${testProductId}`)
            .set('Authorization', '$2b$10$HECBcrKEFRzLBQRIKp76j.4efwsa5Asi1yEylrxK2AEUsqLofN6Qu') 
            .send(updatedProductData);

        expect(res).to.have.status(200);
        expect(res.body).to.have.property('message');
    });

    // Eliminar el producto de prueba después de los tests
    after(async () => {
        await chai.request(app)
            .delete(`/api/products/${testProductId}`)
            .set('Authorization', '$2b$10$HECBcrKEFRzLBQRIKp76j.4efwsa5Asi1yEylrxK2AEUsqLofN6Qu'); 
    });
});
