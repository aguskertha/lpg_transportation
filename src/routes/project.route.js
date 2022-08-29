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
    createCustom,
    editTerminalByID,
    updateTerminal,
    transferTransportation
} = require('./../controllers/project.controller');

const { 
    getProjectSkidTruckByID, 
    getFormSkidTruck, 
    getFormSkidTruckByCase,
    createTransportationSkidTruck, 
    createTransportationSkidTruck2,
    duplicateTransportationSkidTruckByID,
    deleteTransportationSkidTruckByID,
    editTransportationSkidTruckByID,
    updateTransportationSkidTruckByID,
    createTransportationSkidTruck3
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
router.get('/:projectID/terminal/:terminalID/edit', editTerminalByID);
router.post('/:projectID/terminal/:terminalID/update', updateTerminal);
router.get('/:projectID/terminal/form', getFormTerminal);
router.get('/:projectID/transportation', getProjectTransportationByID);
router.post('/:projectID/transportation/transfer', transferTransportation);
router.get('/:projectID/transportation/:transportationID/edit', editTransportationByID);
router.get('/:projectID/transportation/:transportationID/duplicate', duplicateTransportationByID);
router.get('/:projectID/transportation/:transportationID/delete', deleteTransportationByID);
router.get('/:projectID/delete', deleteProjectByID);

router.get('/:projectID/transportation/:transportationID/summary', getSummaryTransportationBunkerPriceSensitivity);
router.get('/create/costShipAge', createCostShipAge);

router.get('/:projectID/skidtruck', getProjectSkidTruckByID);
router.get('/:projectID/skidtruck/:skidTruckID/duplicate', duplicateTransportationSkidTruckByID);
router.get('/:projectID/skidtruck/:skidTruckID/delete', deleteTransportationSkidTruckByID);
router.get('/:projectID/skidtruck/:skidTruckID/edit', editTransportationSkidTruckByID);
router.get('/:projectID/skidtruck/:skidTruckID/update', updateTransportationSkidTruckByID);
router.get('/:projectID/skidtruck/form', getFormSkidTruck);
router.get('/:projectID/skidtruck/form/:typeCase', getFormSkidTruckByCase);
router.post('/:projectID/skidtruck/form/case-1', createTransportationSkidTruck);
router.post('/:projectID/skidtruck/form/case-2', createTransportationSkidTruck2);
router.post('/:projectID/skidtruck/form/case-3', createTransportationSkidTruck3);

router.get('/custom', createCustom);
module.exports = router;