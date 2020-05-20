/**
 *
 */

'use strict';
const express = require('express');
const app = express();
const multer = require('multer');
const fs = require('fs').promises;
const DEFAULT_PORT = 8000;
const JSON_STORE_FILE = './store-items.json';
const JSON_ORDER_FILE = './orders.json';
const CREATED = 201;
const BAD_REQUEST = 400;
const SERVER_ERROR = 500;
let orders = loadOrders();

app.use(express.urlencoded({extended: true}));
app.use(express.json());
app.use(multer().none());

/**
 * Gets the available store items in the store-items.json file.
 * Response type: json
 * Sends a 500 error if something goes wrong in file-processing.
 * Sends a success message otherwise.
 */
app.get('/store', async (req, res) => {
  try {
    let data = await fs.readFile(JSON_STORE_FILE, 'utf8');
    data = JSON.parse(data);
    res.type('json').send(data);
  } catch (err) {
    res.type('text').status(SERVER_ERROR)
      .send('Server error please try again later.');
  }
});

/**
 * Adds a new order to the current orders object and saves the data.
 * This is obviously not a very secure solution but is for demonstration
 * purposes only.
 * Required POST parameters: user, name, address, card-number, exp-month
 * exp-year, cvc.
 * Response type: text/plain
 * Sends 400 if the cvc is invalid (ie 000).
 * Sends 201 created message after order is created.
 */
app.post('/order', (req, res) => {
  let {user, name, address, cvc, total} = req.body;
  let cardNumber = req.body['card-number'];
  let expDate = `${req.body['exp-month']}-${req.body['exp-year']}`;
  if (user && name && address && cardNumber && cvc !== '000' && total) {
    let orderDate = new Date();
    let newOrder = {
      name: name,
      date: orderDate,
      total: total,
      address: address,
      cardNumber: cardNumber,
      expDate: expDate,
      cvc: cvc
    };
    if (orders[user]) {
      orders[user].push(newOrder);
    } else {
      orders[user] = [newOrder];
    }
    saveOrders();
    res.type('text').status(CREATED)
      .send('Order submitted. Thank you for ordering.');
  } else {
    res.type('text').status(BAD_REQUEST)
      .send('Order not complete. Missing required information.');
  }
});

// Helper functions
/** Load orders from json file when server starts */
async function loadOrders() {
  try {
    orders = await fs.readFile(JSON_ORDER_FILE, 'utf8');
    orders = JSON.parse(orders);
  } catch (err) {
    orders = {};
  }
}

/** Save the current orders to the orders.json file. */
function saveOrders() {
  fs.writeFile(JSON_ORDER_FILE, JSON.stringify(orders, undefined, 2));
}

// Define routes to folders used in index.html
app.use('/assets', express.static('public/assets'));
app.use('/bootstrap', express.static('node_modules/bootstrap/dist/css'));

app.use(express.static('public'));
const PORT = process.env.PORT || DEFAULT_PORT;
app.listen(PORT);