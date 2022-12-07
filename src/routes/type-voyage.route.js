var express = require('express');
var router = express.Router();

const { 
    renderAdminTypeVoyage, updateAdminTypeVoyage, deleteAdminTypeVoyageByID, 
    
} = require('./../controllers/type-voyage.controller');

router.get('/admin/', renderAdminTypeVoyage);
router.post('/admin/edit', updateAdminTypeVoyage);
router.get('/admin/delete/:typeVoyageID', deleteAdminTypeVoyageByID);

module.exports = router;