const express = require('express');
const path = require('path');

const clientPath = path.join(__dirname, '../client');
const staticPath = path.join(clientPath, '/static');

const app = express();

app.use(express.static(staticPath));

app.listen(1000);