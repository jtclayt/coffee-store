/**
 *
 */

'use strict';
const express = require('express');
const app = express();
const multer = require('multer');
const DEFAULT_PORT = 8000;

// for application/x-www-form-urlencoded
app.use(express.urlencoded({extended: true}));

// for application/json
app.use(express.json());

// for multipart/form-data (required with FormData)
app.use(multer().none());

app.use('/css', express.static(`${__dirname}/node_modules/bootstrap/dist/css`));
app.use(express.static('public'));
const PORT = process.env.PORT || DEFAULT_PORT;
app.listen(PORT);