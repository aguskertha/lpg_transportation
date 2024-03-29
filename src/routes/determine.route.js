var express = require('express');
var router = express.Router();

const { renderDistanceCapacity, renderParameterDistanceCapacity, renderAllGraph, createParameterCapacityDistance, getAllDistanceCapacityParam} = require('./../controllers/determine.controller');

router.post('/parameter', createParameterCapacityDistance);
router.get('/', renderDistanceCapacity);
router.get('/distance-capacity', getAllDistanceCapacityParam);
router.get('/parameter', renderParameterDistanceCapacity);
router.post('/all-graph', renderAllGraph);

module.exports = router;