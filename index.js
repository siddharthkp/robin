GLOBAL.config = require('./config.json');
var express = require('express');

GLOBAL.app = express();
var bodyParser = require('body-parser');
app.use(bodyParser.json());
var cors = require('cors');
app.use(cors());

GLOBAL.helpers = require('require-all')(__dirname + '/helpers/');
require('require-all')(__dirname + '/src/');

GLOBAL.request = require('request');

app.listen(config.port);
console.log('Blimey!');

