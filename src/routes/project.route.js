var express = require('express');
var router = express.Router();
const { 
    getProjectTerminalByID, 
    getProjectTransportationByID, 
    createProject, 
    deleteProjectByID, 
    updateProjectByID,
    getFormTransportation,
    getFormTransportationFreightVoyage,
    createTransportation,
    editTransportationByID,
    updateTransportationByID,
    duplicateTransportationByID,
    deleteTransportationByID,
    getFormTerminal,
    createTerminal,
    createTerminalCalculation,
    getTerminalCalculation,
    deleteTerminalByID,
    duplicateTerminalByID,
    getFormTransportationBunkerPriceSensitivity,
    createTransportationBunkerPriceSensitivity,
    getSummaryTransportationBunkerPriceSensitivity,
    createCostShipAge,

} = require('./../controllers/project.controller');

const { 
    getProjectSkidTruckByID, 
    getFormSkidTruck, 
    getFormSkidTruckByCase,
    createTransportationSkidTruck 
} = require('./../controllers/transportation-skidtruck.controller');

router.post('/', createProject);
router.post('/update', updateProjectByID);
router.post('/:projectID/form/:typeFreightSlug/:typeVoyageSlug', createTransportation);
router.post('/:projectID/transportation/:transportationID/update', updateTransportationByID);
router.get('/:projectID/form', getFormTransportation);
router.get('/:projectID/form/:transportationID/bunker-price-sensitivity', getFormTransportationBunkerPriceSensitivity);
router.post('/:projectID/:transportationID/bunker-price-sensitivity', createTransportationBunkerPriceSensitivity);
router.get('/:projectID/form/:typeFreightSlug/:typeVoyageSlug', getFormTransportationFreightVoyage);
router.get('/:projectID/terminal', getProjectTerminalByID);
router.post('/:projectID/terminal', createTerminal);
router.get('/:projectID/terminal/:terminalID/calculation', getTerminalCalculation);
router.post('/:projectID/terminal/:terminalID/calculation', createTerminalCalculation);
router.get('/:projectID/terminal/:terminalID/delete', deleteTerminalByID);
router.get('/:projectID/terminal/:terminalID/duplicate', duplicateTerminalByID);
router.get('/:projectID/terminal/form', getFormTerminal);
router.get('/:projectID/transportation', getProjectTransportationByID);
router.get('/:projectID/transportation/:transportationID/edit', editTransportationByID);
router.get('/:projectID/transportation/:transportationID/duplicate', duplicateTransportationByID);
router.get('/:projectID/transportation/:transportationID/delete', deleteTransportationByID);
router.get('/:projectID/delete', deleteProjectByID);

router.get('/:projectID/transportation/:transportationID/summary', getSummaryTransportationBunkerPriceSensitivity);
router.get('/create/costShipAge', createCostShipAge);

router.get('/:projectID/skidtruck', getProjectSkidTruckByID);
router.get('/:projectID/skidtruck/form', getFormSkidTruck);
router.get('/:projectID/skidtruck/form/:typeCase', getFormSkidTruckByCase);
router.post('/:projectID/skidtruck/form/:typeCase', createTransportationSkidTruck);
module.exports = router;