import chai from 'chai';
import chaiHttp from 'chai-http';
import app from '../app.js'; 

chai.use(chaiHttp);
const expect = chai.expect;

describe('Sessions API', () => {
    describe('GET /api/session/current', () => {
        it('should get current user information', (done) => {
            chai.request(app)
                .get('/api/session/current')
                .set('Authorization', '$2b$10$HECBcrKEFRzLBQRIKp76j.4efwsa5Asi1yEylrxK2AEUsqLofN6Qu')
                .end((err, res) => {
                    expect(res).to.have.status(200);
                    expect(res.body).to.be.an('object');
                    done();
                });
        });
    });

    describe('POST /api/session/chat', () => {
        it('should send a chat message (authenticated user)', (done) => {
            const message = 'Hello, this is a test message.';
            chai.request(app)
                .post('/api/session/chat')
                .set('Authorization', '$2b$10$HECBcrKEFRzLBQRIKp76j.4efwsa5Asi1yEylrxK2AEUsqLofN6Qu')
                .send({ message })
                .end((err, res) => {
                    expect(res).to.have.status(200);
                    done();
                });
        });
    });

    describe('POST /api/session/cart', () => {
        it('should add a product to cart (authenticated user)', (done) => {
            const productId = '649362daa4e80f116c659c8c';
            chai.request(app)
                .post('/api/session/cart')
                .set('Authorization', '$2b$10$HECBcrKEFRzLBQRIKp76j.4efwsa5Asi1yEylrxK2AEUsqLofN6Qu')
                .send({ productId })
                .end((err, res) => {
                    expect(res).to.have.status(200);
                    done();
                });
        });
    });

    describe('GET /api/session/logout', () => {
        it('should log out the user (authenticated user)', (done) => {
            chai.request(app)
                .get('/api/session/logout')
                .set('Authorization', '$2b$10$HECBcrKEFRzLBQRIKp76j.4efwsa5Asi1yEylrxK2AEUsqLofN6Qu')
                .end((err, res) => {
                    expect(res).to.have.status(200);
                    done();
                });
        });
    });

    describe('GET /api/session/register', () => {
        it('should render the registration form', (done) => {
            chai.request(app)
                .get('/api/session/register')
                .end((err, res) => {
                    expect(res).to.have.status(200);
                    done();
                });
        });
    });

    describe('POST /api/session/register', () => {
        it('should register a new user', (done) => {
            const newUser = {
                first_name: 'Juan',
                last_name: 'Flores',
                email: 'jccolucci.492@gmail.com',
                password: 'colu1234',
            };
            chai.request(app)
                .post('/api/session/register')
                .send(newUser)
                .end((err, res) => {
                    expect(res).to.have.status(200);
                    done();
                });
        });
    });

    describe('GET /api/session/login', () => {
        it('should render the login form', (done) => {
            chai.request(app)
                .get('/api/session/login')
                .end((err, res) => {
                    expect(res).to.have.status(200);
                    done();
                });
        });
    });

    describe('POST /api/session/login', () => {
        it('should log in a user', (done) => {
            const credentials = {
                email: 'jccolucci.492@gmail.com',
                password: 'colu1234',
            };
            chai.request(app)
                .post('/api/session/login')
                .send(credentials)
                .end((err, res) => {
                    expect(res).to.have.status(200);
                    done();
                });
        });
    });

    describe('GET /api/session/failregister', () => {
        it('should show a failed registration message', (done) => {
            chai.request(app)
                .get('/api/session/failregister')
                .end((err, res) => {
                    expect(res).to.have.status(200);
                    done();
                });
        });
    });

    describe('GET /api/session/faillogin', () => {
        it('should show a failed login message', (done) => {
            chai.request(app)
                .get('/api/session/faillogin')
                .end((err, res) => {
                    expect(res).to.have.status(200);
                    done();
                });
        });
    });

    describe('POST /api/session/reset-password', () => {
        it('should request password reset', (done) => {
            const email = 'jccolucci.492@gmail.com';
            chai.request(app)
                .post('/api/session/reset-password')
                .send({ email })
                .end((err, res) => {
                    expect(res).to.have.status(200);
                    done();
                });
        });
    });


});
