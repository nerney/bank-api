'use strict';
const express = require('express');
const parser = require('body-parser');
const app = express();
const port = process.env.PORT || 8080;
const router = express.Router();
var ACCOUNTS = []; // Account Database

// Setup app
app.use(function(req, res, next) {
      res.header("Access-Control-Allow-Origin", "*");
      res.header("Access-Control-Allow-Methods", "GET,HEAD,OPTIONS,POST,PUT");
      res.header("Access-Control-Allow-Headers", "Content-Type");
      if ( req.method == 'OPTIONS' ) {
        res.sendStatus(200);
      } else {
        next();
      }
    })
    .use(parser.json())
    .use(parser.urlencoded({ extended: true }))
    .use('/bank', router)
    .listen(port, () => {
        console.log('LIVE ON PORT ' + port);
    });

// See all accounts
router.get('/account', function (req, res) {
    res.send(ACCOUNTS);
    res.end();
});

// Create new account
router.post('/account', function (req, res) {
    let account = newAccount();
    ACCOUNTS.push(account);
    res.send(updateAccount(account, req.body));
    res.end();
});

// Deposit funds
router.post('/account/:id', function (req, res) {
    let account = findById(req.params.id);
    if (account !== {}) {
        let amount = parseFloat(req.body.amount);
        res.send(makeDeposit(account, amount));
    }
    res.end;
});

// See one account
router.get('/account/:id', function (req, res) {
    let account = findById(req.params.id);
    if (account !== {}) res.send(account);
    res.end();
});

// Update one account info
router.put('/account/:id', function (req, res) {
    let account = findById(req.params.id);
    if (account !== {}) {
        res.send(updateAccount(account, req.body));
    }
    res.end();
});

// Remove account
router.delete('/account/:id', function (req, res) {
    let account = findById(req.params.id);
    res.send(removeAccount(account, req.body));
    res.end();
});

// Creates a new account object
var NEW_ID = 1; // Ensures unique IDs
function newAccount() {
    return {
        'id': NEW_ID++,
        'firstName': '',
        'lastName': '',
        'address': '',
        'city': '',
        'state': '',
        'balance': 0
    };
}

// Helper functions
function findById(id) {
    return ACCOUNTS.find(account => account.id == id);
}
function removeAccount(account) {
    let index = ACCOUNTS.indexOf(account);
    if (index !== -1) {
        ACCOUNTS.splice(index, 1);
        return 'account removed'
    }
    return '';
}
function updateAccount(account, body) {
    let params = Object.keys(body);
    for (let index = 0; index < params.length; index++) {
        switch (params[index]) {
            case 'firstName':
                account.firstName = body.firstName;
                break;
            case 'lastName':
                account.lastName = body.lastName;
                break;
            case 'address':
                account.address = body.address;
                break;
            case 'city':
                account.city = body.city;
                break;
            case 'state':
                account.state = body.state;
                break;
        }
    }
    return account;
}
function makeDeposit(account, amt) {
    account.balance = parseFloat((account.balance + amt).toFixed(2));
    return account;
}

// For unit testing
app.addTestData = function (array) {
    ACCOUNTS = array;
    NEW_ID = array.length++;
}
module.exports = app;