var express = require('express');
var router = express.Router();

const { renderAdminUnitConversion, updateAdminUnitConversion, initUnitConversion, deleteUnitConversions } = require('./../controllers/unit-conversion.controller');

router.get('/admin/', renderAdminUnitConversion);
router.post('/admin/edit', updateAdminUnitConversion);
router.get('/admin/init', initUnitConversion);
router.get('/admin/delete', deleteUnitConversions);

module.exports = router;