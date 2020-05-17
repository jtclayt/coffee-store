/**
 *
 */

'use strict';
const express = require('express');
const app = express();
const multer = require('multer');
const fs = require('fs').promises;
const DEFAULT_PORT = 8000;
const JSON_STORE_FILE = './shop-items.json';

// for application/x-www-form-urlencoded
app.use(express.urlencoded({extended: true}));

// for application/json
app.use(express.json());

// for multipart/form-data (required with FormData)
app.use(multer().none());

/**
 * GET endpoint.
 */
app.use('/store', async (req, res) => {
  let data = await fs.readFile(JSON_STORE_FILE, 'utf8');
  data = JSON.parse(data);
  res.type('json').send(data);
});

app.use('/assets', express.static(`${__dirname}/public/assets`));
app.use('/jquery', express.static(`${__dirname}/node_modules/jquery/dist`));
app.use('/bootstrap', express.static(`${__dirname}/node_modules/bootstrap/dist`));
app.use(express.static('public'));
const PORT = process.env.PORT || DEFAULT_PORT;
app.listen(PORT);