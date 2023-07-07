var express = require('express');
var router = express.Router();

const { renderDistanceCapacity } = require('./../controllers/determine.controller');

router.get('/', renderDistanceCapacity);

module.exports = router;