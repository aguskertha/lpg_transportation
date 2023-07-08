var express = require('express');
var router = express.Router();

const { renderDistanceCapacity, renderParameterDistanceCapacity, renderAllGraph, createParameterCapacityDistance} = require('./../controllers/determine.controller');

router.post('/parameter', createParameterCapacityDistance);
router.get('/', renderDistanceCapacity);
router.get('/parameter', renderParameterDistanceCapacity);
router.get('/all-graph', renderAllGraph);

module.exports = router;