var express = require('express');
var router = express.Router();

const { 
    renderAdminTypeFreight, updateAdminTypeFreight, deleteAdminTypeFreightByID, 
    
} = require('./../controllers/type-freight.controller');

router.get('/admin/', renderAdminTypeFreight);
router.post('/admin/edit', updateAdminTypeFreight);
router.get('/admin/delete/:typeFreightID', deleteAdminTypeFreightByID);

module.exports = router;