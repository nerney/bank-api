'use strict';
const chai = require('chai');
const chttp = require('chai-http');
const server = require('../server');
const should = chai.should();
chai.use(chttp);

describe('Accounts', function () {
    // Add test data
    beforeEach(function () {
        let array = [];
        let account = {
            'id': 1,
            'firstName': 'Bobby',
            'lastName': 'Digital',
            'address': '666 Main St.',
            'city': 'Pleasantville',
            'state': 'RI',
            'balance': 0
        };
        array.push(account);
        account = {
            'id': 2,
            'firstName': 'Donny',
            'lastName': 'Denamus',
            'address': '1100 Cooper Blvd.',
            'city': 'La Grange',
            'state': 'IN',
            'balance': 0
        }
        array.push(account);
        account = {
            'id': 3,
            'firstName': 'Timmy',
            'lastName': 'Teezy',
            'address': '45 Sycamore Rd.',
            'city': 'Murray',
            'state': 'KY',
            'balance': 0
        };
        array.push(account);
        server.addTestData(array);
    });

    // Test each endpoint
    it('should list ALL accounts on /bank/account GET', function (done) {
        chai.request(server)
            .get('/bank/account')
            .end(function (err, res) {
                res.should.be.json;
                let items = res.body;
                items.should.be.a('array');
                items.forEach(function (item) {
                    checkProps(item);
                });
            });
        done();
    });
    it('should ADD a new account on /bank/account POST', function (done) {
        chai.request(server)
            .post('/bank/account')
            .send({
                'firstName': 'Carol',
                'lastName': 'Cringus',
                'address': '123 Alphabet Ln',
                'city': 'Los Angeles',
                'state': 'CA'
            })
            .end(function (err, res) {
                res.should.be.json;
                checkProps(res.body);
            });
        done();
    });
    it('should list ONE account on /bank/account/:id GET', function (done) {
        chai.request(server)
            .get('/bank/account/2')
            .end(function (err, res) {
                res.should.be.json;
                checkProps(res.body);
            });
        done();
    });
    it('should deposit amount on /bank/account/:id POST', function (done) {
        chai.request(server)
            .post('/bank/account/2')
            .send({ 'amount': 27 })
            .end(function (err, res) {
                res.should.be.json;
                let item = res.body;
                checkProps(item);
                item.should.have.property('balance').eql(27);
            });
        done();
    });
    it('should UPDATE an account on /bank/account/:id PUT', function (done) {
        chai.request(server)
            .put('/bank/account/2')
            .end(function (err, res) {
                res.should.be.json;
                let item = res.body;
                checkProps(item);
                item.should.have.property('id').eql(2);
                item.should.have.property('lastName').eql('Cringus');
            });
        done();
    });
    it('should REMOVE an account on /bank/account/:id DELETE', function (done) {
        chai.request(server)
            .del('/bank/account/2')
            .end(function (err, res) {
                res.should.be.json;
                res.body.should.be.a('string').eql('account removed');
            });
        done();
    });
});

// Helper function to check properties of an account object
function checkProps(item) {
    item.should.be.a('object');
    item.should.have.property('id');
    item.should.have.property('firstName');
    item.should.have.property('lastName');
    item.should.have.property('address');
    item.should.have.property('city');
    item.should.have.property('state');
    item.should.have.property('balance');
};