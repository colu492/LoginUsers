import chai from 'chai';
import chaiHttp from 'chai-http';
import app from '../app.js'; 

chai.use(chaiHttp);
const expect = chai.expect;

describe('Carts API', () => {
    let cartId;

    describe('POST /api/carts', () => {
        it('should create a new cart', (done) => {
            chai.request(app)
                .post('/api/carts')
                .end((err, res) => {
                    expect(res).to.have.status(200);
                    expect(res.body).to.be.an('object');
                    cartId = res.body._id; 
                    done();
                });
        });
    });

    describe('GET /api/carts', () => {
        it('should get all carts', (done) => {
            chai.request(app)
                .get('/api/carts')
                .end((err, res) => {
                    expect(res).to.have.status(200);
                    expect(res.body).to.be.an('array');
                    done();
                });
        });
    });

    describe('GET /api/carts/:id', () => {
        it('should get a single cart by ID', (done) => {
            chai.request(app)
                .get(`/api/carts/${cartId}`)
                .end((err, res) => {
                    expect(res).to.have.status(200);
                    expect(res.body).to.be.an('object');
                    done();
                });
        });
    });

    describe('DELETE /api/carts/:cid/product/:pid', () => {
        it('should delete a product from a cart', (done) => {
            const productId = '649362daa4e80f116c659c7f'; 
            chai.request(app)
                .delete(`/api/carts/${cartId}/product/${productId}`)
                .end((err, res) => {
                    expect(res).to.have.status(200);
                    done();
                });
        });
    });

    describe('POST /api/carts/:cid/product/:pid', () => {
        it('should add a product to a cart', (done) => {
            const productId = '649362daa4e80f116c659c83'; 
            chai.request(app)
                .post(`/api/carts/${cartId}/product/${productId}`)
                .send({ quantity: 2 }) 
                .end((err, res) => {
                    expect(res).to.have.status(200);
                    done();
                });
        });
    });

    describe('POST /api/carts/:cid/purchase', () => {
        it('should checkout a cart', (done) => {
            chai.request(app)
                .post(`/api/carts/${cartId}/purchase`)
                .end((err, res) => {
                    expect(res).to.have.status(200);
                    done();
                });
        });
    });
});
