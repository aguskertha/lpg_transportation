var express = require('express');
var router = express.Router();

const { renderDistanceCapacity, renderAllGraph} = require('./../controllers/determine.controller');

router.get('/', renderDistanceCapacity);
router.get('/all-graph', renderAllGraph);

module.exports = router;