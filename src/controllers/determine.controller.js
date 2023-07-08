const UnitConversion = require('./../models/unit_conversion.model');

const UPPER_CAPACITY = 2600
const LOWER_CAPACITY = 300
const INTERVAL_CAPACITY = 10

const UPPER_DISTANCE = 720
const LOWER_DISTANCE = 50
const INTERVAL_DISTANCE = 10

const convertToFloat = (num) => {
    return Number(num.toString());
}

const createObj = (lower, upper, value) => {
    return {
        lower,
        upper,
        value
    }
}

// let incrementShipCapacity = 
// [
//     createObj(300, 640, 5.7),
//     createObj(650, 990, 9.8),
//     createObj(1000, 1190, 12),
//     createObj(1200, 1590, 13.5),
//     createObj(1600, 2090, 32),
//     createObj(2100, 2600, 40),
// ]

const incrementCrew = 
[
    createObj(300, 640,    0    ),
    createObj(650, 990,    0    ),
    createObj(1000, 1190,  1    ),
    createObj(1200, 1590,  1    ),
    createObj(1600, 2090,  2    ),
    createObj(2100, 2600,  2    ),
]

const sumCrew =
[
    13,15,21
]

const initialVariable = (increment, current) => {
    let value = 0
    increment.forEach(element => {
        if(current >= element.lower && current <= element.upper){
            value = element.value
        }
    });

    return value
}

const generateDistanceCapacity = async (capacity, distance, incrementShipCapacity, flag=0) =>
{
    const CURRENT_CAPACITY = capacity
    const CURRENT_DISTANCE = distance
    const CURRENT_FOC = initialVariable(incrementShipCapacity, CURRENT_CAPACITY)

    const unitConversion = await UnitConversion.find();
    const transportation = {};

    const unitKGtoLitre = convertToFloat(unitConversion[0].KGtoLitre);
    const unitCBMtoLitre = convertToFloat(unitConversion[0].CBMtoLitre);
    const unitKGtoMMBTU = convertToFloat(unitConversion[0].KGtoMMBTU);
    const unitCBMtoMT = convertToFloat(unitConversion[0].CBMtoMT);
    const unitUSDtoIDR = convertToFloat(unitConversion[0].USDtoIDR);
    const unitMTtoKG = convertToFloat(unitConversion[0].MTtoKG);
    const unitKMtoMILE = convertToFloat(unitConversion[0].KMtoMILE);
    const unitKMtoNauticalMILE = convertToFloat(unitConversion[0].KMtoNauticalMILE);

    let crewFlag = initialVariable(incrementCrew, CURRENT_CAPACITY)

    

    //ship
    let ship = {
        shipName: "",
        shipCapacityCBM: CURRENT_CAPACITY / unitCBMtoMT,
        // shipCapacityMT: req.body.shipCapacityMT,
        // typeVessel: req.body.typeVessel,
        // IMONumber: req.body.IMONumber,
        // MMSINumber: req.body.MMSINumber,
        // callSign: req.body.callSign,
        // grossTonnage: req.body.grossTonnage,
        // summerDWT: req.body.summerDWT,
        // lengthOverall: req.body.lengthOverall,
        // yearBuilt: req.body.yearBuilt,
        // shipAge: req.body.shipAge,
        crewNumber: sumCrew[crewFlag],
        // SFOC: req.body.SFOC,
    }
    transportation.Ship = ship;

    //voyage
    let voyage = {
        // POL: req.body.POL,
        // POD: req.body.POD,
        distance: Number(CURRENT_DISTANCE),
        serviceSpeedVessel: Number(10)
    }
    transportation.Voyage = voyage;

    //ShipCargoTankFullCapacity
    let cargoTank = [];
    let reqNumberOfCargoTank = 2;
    for (let i = 1; i <= reqNumberOfCargoTank; i++) {
        cargoTank.push(ship.shipCapacityCBM / 2);
    }
    let shipCargoTankFullCapacity = {
        numberOfCargoTank: reqNumberOfCargoTank,
        cargoTank: cargoTank
    }
    let totalCapacityCBM = 0;
    cargoTank.forEach(cargo => {
        totalCapacityCBM += Number(cargo);
    });
    const totalCapacityLitre = totalCapacityCBM / unitCBMtoLitre;
    const totalCapacityKG = totalCapacityLitre / unitKGtoLitre;
    shipCargoTankFullCapacity.totalCapacityCBM = totalCapacityCBM;
    shipCargoTankFullCapacity.totalCapacityLitre = totalCapacityLitre;
    shipCargoTankFullCapacity.totalCapacityKG = totalCapacityKG;
    transportation.ShipCargoTankFullCapacity = shipCargoTankFullCapacity;
    
    //ShipCargoTankOperationalCapacity
    let shipCargoTankOperationalCapacity = {};
    const loadingFactor = 100;
    shipCargoTankOperationalCapacity.loadingFactor = loadingFactor;
    let cargoTankOp = [];
    for (let i = 0; i < cargoTank.length; i++) {
        cargoTankOp.push(loadingFactor / 100 * Number(cargoTank[i]));
    }
    shipCargoTankOperationalCapacity.cargoTankOp = cargoTankOp;
    let totalCapacityOpCBM = 0;
    cargoTankOp.forEach(cargo => {
        totalCapacityOpCBM += Number(cargo);    
    });
    const totalCapacityOpLitre = totalCapacityOpCBM / unitCBMtoLitre;
    const totalCapacityOpKG = totalCapacityOpLitre / unitKGtoLitre;
    shipCargoTankOperationalCapacity.totalCapacityOpCBM = totalCapacityOpCBM;
    shipCargoTankOperationalCapacity.totalCapacityOpLitre = totalCapacityOpLitre;
    shipCargoTankOperationalCapacity.totalCapacityOpKG = totalCapacityOpKG;
    transportation.ShipCargoTankOperationalCapacity = shipCargoTankOperationalCapacity;
    
    //TURNAROUND VOYAGE
    const ladenSailingTime = voyage.distance/voyage.serviceSpeedVessel/24;
    const ballastSailingTime = voyage.distance/voyage.serviceSpeedVessel/24;
    const totalSailingTime = Number(ladenSailingTime + ballastSailingTime);

    let pumpLoadingRate = [];
    for (let i = 1; i <= reqNumberOfCargoTank; i++) {
        pumpLoadingRate.push(100);
    }
    let sumLoadingTime = 0;
    for (let i = 0; i < reqNumberOfCargoTank; i++) {
        sumLoadingTime += Number(Number(shipCargoTankOperationalCapacity.cargoTankOp[i])/Number(pumpLoadingRate[i]));
    }
    const totalLoadingTime = sumLoadingTime/24;
    let enterWaitTimePOL = 1;

    let pumpDischargeRate = [];
    let numberOfCargoTank = reqNumberOfCargoTank;
    
    for (let i = 1; i <= numberOfCargoTank; i++) {
        pumpDischargeRate.push(50);
    }
    let sumDischargeRate = 0;
    for (let i = 0; i < reqNumberOfCargoTank; i++) {
        sumDischargeRate += Number(Number(shipCargoTankOperationalCapacity.cargoTankOp[i])/Number(pumpDischargeRate[i]));
    }
    const totalDischargeTime = sumDischargeRate/24;
    let enterWaitTimePOD = 1;
    
    const totalTurnRoundTime = ladenSailingTime+ballastSailingTime+totalLoadingTime+enterWaitTimePOL+totalDischargeTime+enterWaitTimePOD;
    const calendarDaysYear = 360;
    const docking = 30;
    const mobilization = 0;
    const effectiveDays = calendarDaysYear-docking;
    let numberRoundTripYear = Number(Math.floor(effectiveDays/totalTurnRoundTime));

    const idleDaysYear = effectiveDays - (totalTurnRoundTime*numberRoundTripYear);
    const totalCargoCarryCapacityYearCBM = numberRoundTripYear * shipCargoTankOperationalCapacity.totalCapacityOpCBM;
    let totalCargoCarryCapacityYearKG = numberRoundTripYear * shipCargoTankOperationalCapacity.totalCapacityOpKG;
    
    const totalCargoCarryCapacityYearMMBTU = totalCargoCarryCapacityYearKG * unitKGtoMMBTU;

    const turnAroundVoyage = {
        ladenSailingTime,
        ballastSailingTime,
        totalSailingTime,
        pumpLoadingRate,
        totalLoadingTime,
        enterWaitTimePOL,
        pumpDischargeRate,
        totalDischargeTime,
        enterWaitTimePOD,
        totalTurnRoundTime,
        calendarDaysYear,
        docking,
        mobilization,
        effectiveDays,
        numberRoundTripYear,
        idleDaysYear,
        totalCargoCarryCapacityYearCBM,
        totalCargoCarryCapacityYearKG,
        totalCargoCarryCapacityYearMMBTU,
    }
    transportation.TurnAroundVoyage = turnAroundVoyage;
    
    //BUNKERING CALCULATION
    const portIdleMFO = Number(0);
    const portIdleMDO = Number(0.15 * CURRENT_FOC);
    const portIdleMGO = Number(0);
    const portWorkingMFO = Number(0);
    const portWorkingMDO = Number(0.2 * CURRENT_FOC);
    const portWorkingMGO = Number(0);
    const atSeaMFO = Number(0);
    const atSeaMDO = Number(CURRENT_FOC);
    const atSeaMGO = Number(0);
    const bunkerPriceIDRMFO = 0;
    const bunkerPriceIDRMDO = 20000000;
    const bunkerPriceIDRMGO = 0;
    // const bunkerPriceIDRMFO = Number(req.body.bunkerPriceIDRMFO);
    // const bunkerPriceIDRMDO = Number(req.body.bunkerPriceIDRMDO);
    // const bunkerPriceIDRMGO = Number(req.body.bunkerPriceIDRMGO);
    const bunkerConsumeTripMFO = (turnAroundVoyage.totalTurnRoundTime*atSeaMFO) + ((turnAroundVoyage.totalLoadingTime+turnAroundVoyage.totalDischargeTime)*portWorkingMFO) + ((turnAroundVoyage.enterWaitTimePOD+turnAroundVoyage.enterWaitTimePOL)*portIdleMFO);
    const bunkerConsumeTripMDO = (turnAroundVoyage.totalTurnRoundTime*atSeaMDO) + ((turnAroundVoyage.totalLoadingTime+turnAroundVoyage.totalDischargeTime)*portWorkingMDO) + ((turnAroundVoyage.enterWaitTimePOD+turnAroundVoyage.enterWaitTimePOL)*portIdleMDO);
    const bunkerConsumeTripMGO = (turnAroundVoyage.totalTurnRoundTime*atSeaMGO) + ((turnAroundVoyage.totalLoadingTime+turnAroundVoyage.totalDischargeTime)*portWorkingMGO) + ((turnAroundVoyage.enterWaitTimePOD+turnAroundVoyage.enterWaitTimePOL)*portIdleMGO);
    const bunkerConsumeYearMFO = bunkerConsumeTripMFO*turnAroundVoyage.numberRoundTripYear;
    const bunkerConsumeYearMDO = bunkerConsumeTripMDO*turnAroundVoyage.numberRoundTripYear;
    const bunkerConsumeYearMGO = bunkerConsumeTripMGO*turnAroundVoyage.numberRoundTripYear;
    const bunkerPriceUSDMFO = bunkerPriceIDRMFO / unitUSDtoIDR;
    const bunkerPriceUSDMDO = bunkerPriceIDRMDO / unitUSDtoIDR;
    const bunkerPriceUSDMGO = bunkerPriceIDRMGO / unitUSDtoIDR;
    const totalBunkerCostTripIDR = (bunkerConsumeTripMFO*bunkerPriceIDRMFO)+(bunkerConsumeTripMDO*bunkerPriceIDRMDO)+(bunkerConsumeTripMGO*bunkerPriceIDRMGO);
    const totalBunkerCostYearIDR = (bunkerConsumeYearMFO*bunkerPriceIDRMFO)+(bunkerConsumeYearMDO*bunkerPriceIDRMDO)+(bunkerConsumeYearMGO*bunkerPriceIDRMGO);
    const totalBunkerCostTripUSD = (bunkerConsumeTripMFO*bunkerPriceUSDMFO)+(bunkerConsumeTripMDO*bunkerPriceUSDMDO)+(bunkerConsumeTripMGO*bunkerPriceUSDMGO);
    const totalBunkerCostYearUSD = (bunkerConsumeYearMFO*bunkerPriceUSDMFO)+(bunkerConsumeYearMDO*bunkerPriceUSDMDO)+(bunkerConsumeYearMGO*bunkerPriceUSDMGO);
    const bunkeringCalculation = {
        portIdleMFO,
        portIdleMDO,
        portIdleMGO,
        portWorkingMFO,
        portWorkingMDO,
        portWorkingMGO,
        atSeaMFO,
        atSeaMDO,
        atSeaMGO,
        bunkerConsumeTripMFO,
        bunkerConsumeTripMDO,
        bunkerConsumeTripMGO,
        bunkerConsumeYearMFO,
        bunkerConsumeYearMDO,
        bunkerConsumeYearMGO,
        bunkerPriceIDRMFO,
        bunkerPriceIDRMDO,
        bunkerPriceIDRMGO,
        bunkerPriceUSDMFO,
        bunkerPriceUSDMDO,
        bunkerPriceUSDMGO,
        totalBunkerCostTripIDR,
        totalBunkerCostYearIDR,
        totalBunkerCostTripUSD,
        totalBunkerCostYearUSD,
    }
    transportation.BunkeringCalculation = bunkeringCalculation;
    
    let deckMasterQty   = 1
    let deckMasterPrice = 2000 
    let deckMasterTotal = 2000

    let deckChiefOfficerQty     = 1
    let deckChiefOfficerPrice   = 1800
    let deckChiefOfficerTotal   = 1800

    let deckOfficerQty      = 1
    let deckOfficerPrice    = 1500 
    let deckOfficerTotal    = 1500

    let deckRadioOperatorQty    = 1
    let deckRadioOperatorPrice  = 1200
    let deckRadioOperatorTotal  = 1200

    let deckBoatswainQty        = (crewFlag == 2 ? 2 : 1)
    let deckBoatswainPrice      = 1000
    let deckBoatswainTotal      = (deckBoatswainQty * deckBoatswainPrice)

    let deckAbleBodiedQty   = 2
    let deckAbleBodiedPrice = 800
    let deckAbleBodiedTotal = 1600
    
    let deckOrdinarySeamenQty   = (crewFlag == 2 ? 1 : 0)
    let deckOrdinarySeamenPrice = 750
    let deckOrdinarySeamenTotal = (deckOrdinarySeamenQty * deckOrdinarySeamenPrice)
    
    let deckChefQty     = (crewFlag == 2 ? 2 : 1)
    let deckChefPrice   = 650
    let deckChefTotal   = (deckChefQty * deckChefPrice)

    let deckAssistantChefQty    = 0
    let deckAssistantChefPrice  = 500
    let deckAssistantChefTotal  = 0
    
    let deckOthersQty   = 0
    let deckOthersPrice = 0
    let deckOthersTotal = 0
    

    //CREW COST
    const deckMaster = {
        qty: Number(deckMasterQty),
        price: Number(deckMasterPrice),
        total: Number(deckMasterTotal)
    }
    const deckChiefOfficer = {
        qty: Number(deckChiefOfficerQty),
        price: Number(deckChiefOfficerPrice),
        total: Number(deckChiefOfficerTotal)
    }
    const deckOfficer = {
        qty: Number(deckOfficerQty),
        price: Number(deckOfficerPrice),
        total: Number(deckOfficerTotal)
    }
    const deckRadioOperator = {
        qty: Number(deckRadioOperatorQty),
        price: Number(deckRadioOperatorPrice),
        total: Number(deckRadioOperatorTotal)
    }
    const deckBoatswain = {
        qty: Number(deckBoatswainQty),
        price: Number(deckBoatswainPrice),
        total: Number(deckBoatswainTotal)
    }
    const deckAbleBodied = {
        qty: Number(deckAbleBodiedQty),
        price: Number(deckAbleBodiedPrice),
        total: Number(deckAbleBodiedTotal)
    }
    const deckOrdinarySeamen = {
        qty: Number(deckOrdinarySeamenQty),
        price: Number(deckOrdinarySeamenPrice),
        total: Number(deckOrdinarySeamenTotal)
    }
    const deckChef = {
        qty: Number(deckChefQty),
        price: Number(deckChefPrice),
        total: Number(deckChefTotal)
    }
    const deckAssistantChef = {
        qty: Number(deckAssistantChefQty),
        price: Number(deckAssistantChefPrice),
        total: Number(deckAssistantChefTotal)
    }
    const deckOthers = {
        qty: Number(deckOthersQty),
        price: Number(deckOthersPrice),
        total: Number(deckOthersTotal)
    }
    const deckDept = {deckMaster, deckChiefOfficer, deckOfficer, deckRadioOperator, deckBoatswain, deckAbleBodied, deckOrdinarySeamen, deckChef, deckAssistantChef, deckOthers};
    
    let engineChiefEngineerQty      = 1
    let engineChiefEngineerPrice    = 1800
    let engineChiefEngineerTotal    = 1800
        
    let engineChiefMachinistQty     = (crewFlag == 2 ? 2 : 1)
    let engineChiefMachinistPrice   = 1500
    let engineChiefMachinistTotal   = (engineChiefMachinistQty * engineChiefMachinistPrice)

    let engineMachinistQty      = (crewFlag == 2 ? 2 : 1)
    let engineMachinistPrice    = 1200
    let engineMachinistTotal    = (engineMachinistQty * engineMachinistPrice)

    let engineForemenQty    = (crewFlag == 2 ? 2 : 1)
    let engineForemenPrice  = 1000
    let engineForemenTotal  = (engineForemenQty * engineForemenPrice)

    let engineOilerQty      = ((crewFlag == 1 || crewFlag == 2) ? 2 : 1 )
    let engineOilerPrice    = 800
    let engineOilerTotal    = Number(engineOilerQty * engineOilerPrice)
    
    let engineWiperQty      = ((crewFlag == 1 || crewFlag == 2) ? 1 : 0 )
    let engineWiperPrice    = 650
    let engineWiperTotal    = Number(engineWiperQty * engineWiperPrice)
    
    let engineOthersQty     = 0
    let engineOthersPrice   = 0
    let engineOthersTotal   = 0
    
    
    const engineChiefEngineer = {
        qty: Number(engineChiefEngineerQty),
        price: Number(engineChiefEngineerPrice),
        total: Number(engineChiefEngineerTotal)
    }
    const engineChiefMachinist = {
        qty: Number(engineChiefMachinistQty),
        price: Number(engineChiefMachinistPrice),
        total: Number(engineChiefMachinistTotal)
    }
    const engineMachinist = {
        qty: Number(engineMachinistQty),
        price: Number(engineMachinistPrice),
        total: Number(engineMachinistTotal)
    }
    const engineForemen = {
        qty: Number(engineForemenQty),
        price: Number(engineForemenPrice),
        total: Number(engineForemenTotal)
    }
    const engineOiler = {
        qty: Number(engineOilerQty),
        price: Number(engineOilerPrice),
        total: Number(engineOilerTotal)
    }
    const engineWiper = {
        qty: Number(engineWiperQty),
        price: Number(engineWiperPrice),
        total: Number(engineWiperTotal)
    }
    const engineOthers = {
        qty: Number(engineOthersQty),
        price: Number(engineOthersPrice),
        total: Number(engineOthersTotal)
    }
    
    const engineDept = {engineChiefEngineer, engineChiefMachinist, engineMachinist, engineForemen, engineOiler, engineWiper, engineOthers};
    const sumDeckDept = (deckMaster.total+deckChiefOfficer.total+deckOfficer.total+deckRadioOperator.total+deckBoatswain.total+deckAbleBodied.total+deckOrdinarySeamen.total+deckChef.total+deckAssistantChef.total+deckOthers.total);
    const sumEngineDept = (engineChiefEngineer.total+ engineChiefMachinist.total+ engineMachinist.total+ engineForemen.total+ engineOiler.total+ engineWiper.total+ engineOthers.total);
    const totalCrewCostMonth = sumDeckDept + sumEngineDept;
    const totalCrewCostYear = totalCrewCostMonth * 13;

    const crewCost = {
        DeckDept : deckDept,
        EngineDept : engineDept,
        totalCrewCostMonth,
        totalCrewCostYear
    };
    
    transportation.CrewCost = crewCost;

    //PORT COST
    const portChargesRoundTrip = Number(3424);
    const totalPortChargesYear = portChargesRoundTrip * turnAroundVoyage.numberRoundTripYear;
    const portCost = {portChargesRoundTrip, totalPortChargesYear};
    transportation.PortCost = portCost;

    //CARGO HANDLING COST
    const lasingUnlasPOLTrip = Number(0);
    const lasingUnlasPODTrip = Number(0);
    const totalCargoHandlingCostYear = (lasingUnlasPOLTrip*turnAroundVoyage.numberRoundTripYear)+(lasingUnlasPODTrip*turnAroundVoyage.numberRoundTripYear);
    const cargoHandlingCost = {lasingUnlasPOLTrip, lasingUnlasPODTrip, totalCargoHandlingCostYear};
    transportation.CargoHandlingCost = cargoHandlingCost;
    
    //VesselCharterCost
    const charterRateDay = Number(0);
    const totalCharterRateYear = charterRateDay*turnAroundVoyage.calendarDaysYear;
    const vesselCharterCost = {charterRateDay, totalCharterRateYear};
    transportation.VesselCharterCost = vesselCharterCost;

    //InsuranceCost
    const shipInsurance = Number(55000);
    const crewInsurance = Number((45/100) / (20/100) *shipInsurance);
    const totalInsuranceCostYear = shipInsurance + crewInsurance;
    const insuranceCost = {shipInsurance, crewInsurance, totalInsuranceCostYear};
    transportation.InsuranceCost = insuranceCost;

    //DockingRepairMaintenanceCost
    const dockingCost = Number(120000);
    const repairStoreCost = Number(15000);
    const lubeOilCost = Number(15000);
    const totalDockingRepairMaintenanceCost = dockingCost+repairStoreCost+lubeOilCost;
    const dockingRepairMaintenanceCost = {dockingCost, repairStoreCost, lubeOilCost, totalDockingRepairMaintenanceCost};
    transportation.DockingRepairMaintenanceCost = dockingRepairMaintenanceCost;

    //OtherCost
    const victually = Number(ship.crewNumber * 3 * 3 * 365);
    const administrationCost = Number(50000);
    const totalOtherCost = victually + administrationCost;
    const otherCost = {victually, administrationCost, totalOtherCost};
    transportation.OtherCost = otherCost;

    //TotalCost
    const tax = Number(1.2);
    const totalCostBeforeTax = 
        (bunkeringCalculation.totalBunkerCostYearUSD
            +crewCost.totalCrewCostYear
            +portCost.totalPortChargesYear
            +cargoHandlingCost.lasingUnlasPOLTrip
            +vesselCharterCost.totalCharterRateYear
            +insuranceCost.totalInsuranceCostYear
            +dockingRepairMaintenanceCost.totalDockingRepairMaintenanceCost
            +otherCost.totalOtherCost);
    const totalTax = totalCostBeforeTax * (tax/100);
    const totalCostAfterTax = totalCostBeforeTax + totalTax;
    const totalCost = {totalCostBeforeTax, totalCostAfterTax, totalTax, tax};
    transportation.TotalCost = totalCost;

    //RealFreightRate
    const unitCostMassCargo_USD_KG = (totalCost.totalCostAfterTax/turnAroundVoyage.totalCargoCarryCapacityYearKG);
    const unitCostMassCargo_USD_MT = unitCostMassCargo_USD_KG*1000;
    const unitCostMassCargo_IDR_KG = unitCostMassCargo_USD_KG * unitUSDtoIDR;
    const unitCostMassCargo_IDR_MT = unitCostMassCargo_IDR_KG*1000;
    const unitCost_USD_MMBTU = (totalCost.totalCostAfterTax/turnAroundVoyage.totalCargoCarryCapacityYearMMBTU);
    const unitCost_USD_MMBTU_NM = unitCost_USD_MMBTU/(turnAroundVoyage.numberRoundTripYear*voyage.distance*2);
    // const unitCostMassCargo_USD_KG_NM = unitCostMassCargo_USD_KG / (turnAroundVoyage.numberRoundTripYear*voyage.distance*2);
    const unitCostMassCargo_USD_KG_NM = unitCostMassCargo_USD_KG / (voyage.distance*2);
    const unitCostMassCargo_IDR_KG_NM = unitCostMassCargo_USD_KG_NM * unitUSDtoIDR;
    const realFreightRate = {unitCostMassCargo_USD_KG, unitCostMassCargo_USD_MT, unitCostMassCargo_IDR_KG, unitCostMassCargo_IDR_MT, unitCost_USD_MMBTU, unitCost_USD_MMBTU_NM, unitCostMassCargo_USD_KG_NM, unitCostMassCargo_IDR_KG_NM};
    transportation.RealFreightRate = realFreightRate;

    //ProposedFreight
    const profitMargin = Number(20/100);
    const proposedFreight_USD_KG = (realFreightRate.unitCostMassCargo_USD_KG+(realFreightRate.unitCostMassCargo_USD_KG*profitMargin));
    const proposedFreight_USD_MT = proposedFreight_USD_KG*1000;
    const proposedFreight_IDR_KG = proposedFreight_USD_KG*unitUSDtoIDR;
    const proposedFreight_IDR_MT = proposedFreight_IDR_KG*1000;
    const proposedFreight_USD_MMBTU = realFreightRate.unitCost_USD_MMBTU+(realFreightRate.unitCost_USD_MMBTU*profitMargin);
    const proposedFreight_USD_MMBTU_NM = realFreightRate.unitCost_USD_MMBTU_NM+(realFreightRate.unitCost_USD_MMBTU_NM*profitMargin);
    const proposedFreight_USD_KG_NM = realFreightRate.unitCostMassCargo_USD_KG_NM+(realFreightRate.unitCostMassCargo_USD_KG_NM*profitMargin);
    const proposedFreight_IDR_KG_NM = proposedFreight_USD_KG_NM*unitUSDtoIDR;
    const revenue = proposedFreight_USD_KG_NM*turnAroundVoyage.totalCargoCarryCapacityYearKG*voyage.distance*2;
    // const revenue = proposedFreight_USD_KG_NM*turnAroundVoyage.totalCargoCarryCapacityYearKG*turnAroundVoyage.numberRoundTripYear*voyage.distance*2;
    const netRevenue = revenue - totalCost.totalCostAfterTax;
    const ratioRevenue = revenue / totalCost.totalCostAfterTax - (100/100);
    const proposedFreight = {
        profitMargin,
        proposedFreight_USD_KG,
        proposedFreight_USD_MT,
        proposedFreight_IDR_KG,
        proposedFreight_IDR_MT,
        proposedFreight_USD_MMBTU,
        proposedFreight_USD_MMBTU_NM,
        proposedFreight_USD_KG_NM,
        proposedFreight_IDR_KG_NM,
        revenue,
        netRevenue,
        ratioRevenue
    }
    transportation.ProposedFreight = proposedFreight;

    if(flag != 0)
    {
        let newTransportation = {
            ProposedFreight : {
                proposedFreight_IDR_KG_NM : transportation.ProposedFreight.proposedFreight_IDR_KG_NM
            }
        }
        return newTransportation;
    }

    return transportation
}

const renderParameterDistanceCapacity = async (req, res, next) => {
    try {
        res.render('Determined/parameter-distance-capacity', {
            layout: 'layouts/main-layout'
        })

    } catch (error) {
        res.render('error', {
            layout: 'layouts/main-layout',
            message: error,
            status: 400
        });
    }
}

const renderDistanceCapacity = async (req, res, next) => {
    try {
        let queryString = ''
        let incrementShipCapacitys = []
        if(typeof req.query.upper != 'undefined' && typeof req.query.lower != 'undefined' && typeof req.query.foc != 'undefined')
        {
            const uppers = JSON.parse(decodeURIComponent(req.query.upper))
            const lowers = JSON.parse(decodeURIComponent(req.query.lower))
            const focs = JSON.parse(decodeURIComponent(req.query.foc))

            const encodedUppers = encodeURIComponent(JSON.stringify(uppers));
            const encodedLowers = encodeURIComponent(JSON.stringify(lowers));
            const encodedFOCs = encodeURIComponent(JSON.stringify(focs));

            queryString = `upper=${encodedUppers}&lower=${encodedLowers}&foc=${encodedFOCs}`

            for (let i = 0; i < uppers.length; i++) {
                const upper = uppers[i];
                const lower = lowers[i];
                const foc = focs[i];
                
                incrementShipCapacitys.push(createObj(Number(lower), Number(upper), Number(foc)))
            }
        }

        let paramCapacity = LOWER_CAPACITY
        if(typeof req.query.capacity != 'undefined')
        {
            paramCapacity = req.query.capacity
        }
        const CURRENT_CAPACITY = paramCapacity

        let transportations = [];
        let datasets = []
        let dataset = {
            label : CURRENT_CAPACITY
        }
        let datas = []
        for (let i = LOWER_DISTANCE; i <= UPPER_DISTANCE; i+=INTERVAL_DISTANCE) {
            let transportation = await generateDistanceCapacity(CURRENT_CAPACITY, i, incrementShipCapacitys)
            transportations.push({
                distance : i,
                unitCostMassCargo_USD_KG_NM : transportation.RealFreightRate.unitCostMassCargo_USD_KG_NM,
                unitCostMassCargo_IDR_KG_NM : transportation.RealFreightRate.unitCostMassCargo_IDR_KG_NM,
                proposedFreight_USD_KG_NM : transportation.ProposedFreight.proposedFreight_USD_KG_NM,
                proposedFreight_IDR_KG_NM : transportation.ProposedFreight.proposedFreight_IDR_KG_NM,
                proposedFreight_USD_MT : transportation.ProposedFreight.proposedFreight_USD_MT,
                proposedFreight_IDR_MT : transportation.ProposedFreight.proposedFreight_IDR_MT,
                totalCostAfterTax : transportation.TotalCost.totalCostAfterTax
            })
            datas.push(transportation.ProposedFreight.proposedFreight_IDR_KG_NM)
        }
        dataset.data = datas
        datasets.push(dataset)

        res.render('Determined/determined-distance-capacity', {
            layout: 'layouts/main-layout',
            UPPER_CAPACITY,
            LOWER_CAPACITY,
            INTERVAL_CAPACITY,
            paramCapacity,
            transportations,
            datasets,
            distances : labelGenerator(),
            queryString
        })

    } catch (error) {
        res.render('error', {
            layout: 'layouts/main-layout',
            message: error,
            status: 400
        });
    }
}

const renderAllGraph = async (req, res, next) => {
    try {

        let queryString = ''
        let incrementShipCapacitys = []
        if(typeof req.query.upper != 'undefined' && typeof req.query.lower != 'undefined' && typeof req.query.foc != 'undefined')
        {
            const uppers = JSON.parse(decodeURIComponent(req.query.upper))
            const lowers = JSON.parse(decodeURIComponent(req.query.lower))
            const focs = JSON.parse(decodeURIComponent(req.query.foc))

            const encodedUppers = encodeURIComponent(JSON.stringify(uppers));
            const encodedLowers = encodeURIComponent(JSON.stringify(lowers));
            const encodedFOCs = encodeURIComponent(JSON.stringify(focs));

            queryString = `upper=${encodedUppers}&lower=${encodedLowers}&foc=${encodedFOCs}`

            for (let i = 0; i < uppers.length; i++) {
                const upper = uppers[i];
                const lower = lowers[i];
                const foc = focs[i];
                
                incrementShipCapacitys.push(createObj(Number(lower), Number(upper), Number(foc)))
            }
        }

        let datasets = []
        for (let i = LOWER_CAPACITY; i <= UPPER_CAPACITY; i+=INTERVAL_CAPACITY) {
            console.log("Do... "+i)
            let dataset = {
                label : i
            }
            let datas = []
            for (let j = LOWER_DISTANCE; j <= UPPER_DISTANCE; j+=INTERVAL_DISTANCE) {
                let transportation = await generateDistanceCapacity(i, j, incrementShipCapacitys, 1)
                datas.push(transportation.ProposedFreight.proposedFreight_IDR_KG_NM)
            }
            dataset.data = datas
            datasets.push(dataset)
            console.log("PASSED!")
        }
        
        res.render('Determined/graph-all-summary', {
            layout: 'layouts/main-layout',
            datasets,
            distances: labelGenerator()
        })
    } catch (error) {
        res.render('error', {
            layout: 'layouts/main-layout',
            message: error,
            status: 400
        });
    }
}

const labelGenerator = () => {
    let distances = []
    for (let i = LOWER_DISTANCE; i <= UPPER_DISTANCE; i+=INTERVAL_DISTANCE) {
        distances.push(i)
    }
    return distances
}

const createParameterCapacityDistance = async (req, res, next) => {
    try {
        if(typeof req.body =='undefined') throw "Bad Request!"
        
        const uppers = req.body.upper
        const lowers = req.body.lower
        const focs = req.body.foc

        const encodedUppers = encodeURIComponent(JSON.stringify(uppers));
        const encodedLowers = encodeURIComponent(JSON.stringify(lowers));
        const encodedFOCs = encodeURIComponent(JSON.stringify(focs));

        res.redirect(`/determine-distance-capacity?capacity=300&upper=${encodedUppers}&lower=${encodedLowers}&foc=${encodedFOCs}`)
    } catch (error) {
        res.render('error', {
            layout: 'layouts/main-layout',
            message: error,
            status: 400
        });
    }
}


module.exports = {
    renderDistanceCapacity,
    renderAllGraph,
    renderParameterDistanceCapacity,
    createParameterCapacityDistance
}
