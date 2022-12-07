var express = require('express');
var router = express.Router();

const { 
    renderAdminCostShipAge, updateAdminCostShipAge, deleteAdminCostShipAgeByID, initCostShipAge, deleteCostShipAges, 
    
} = require('../controllers/cost-ship-age.controller');

router.get('/admin/', renderAdminCostShipAge);
router.post('/admin/edit', updateAdminCostShipAge);
router.get('/admin/delete/:costShipAgeID', deleteAdminCostShipAgeByID);
router.get('/admin/init', initCostShipAge);
router.get('/admin/delete', deleteCostShipAges);

module.exports = router;