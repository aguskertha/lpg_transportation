const Project = require('./../models/project.model');
const Transportation = require('./../models/transportation.model');
const ObjectID = require('mongodb').ObjectId;
const TypeVoyage = require('./../models/type_voyage.model');
const TypeFreight = require('./../models/type_freight.model');
const CrewData = require('./../models/crew_data.model');
const UnitConversion = require('./../models/unit_conversion.model');
const Terminal = require('./../models/Terimnal/terminal');
const Storage = require('./../models/Terimnal/storage');
const Receiving = require('./../models/Terimnal/receiving');

const createProject = async (req, res, next) => {
    try {
        const topicID = req.body.topicID;
        const project = {
            name: req.body.projectName,
            topicID
        }
        const newProject = new Project(project);
        await newProject.save();
        res.redirect('/topic/'+topicID);

    } catch (error) {
        res.render('error', {
            layout: 'layouts/main-layout',
            message: error,
            status: 400
        });
    }
}

const getProjectTerminalByID = async (req, res, next) => {
    try {
        const ProjectID = req.params.projectID;
        const project = await Project.findOne({_id: ObjectID(ProjectID)});
        const terminals = await Terminal.find();
        res.render('Terminal/terminal-summary', {
            layout: 'layouts/main-layout',
            title: project.name,
            ProjectID,
            terminals
        });
    } catch (error) {
        res.render('error', {
            layout: 'layouts/main-layout',
            message: error,
            status: 400
        });
    }
}

const getFormTerminal = async (req, res, next) => {
    try {
        const project = await Project.findOne({_id: ObjectID(req.params.projectID)});
        const receivings = await Receiving.find();
        const jettyType = receivings[0];
        const jettyConnection = receivings[1];
        const unloadingFacility = receivings[2];
        const pipelineInstallation = receivings[3];
        const mooringFacilities = receivings[4];
        const metering = receivings[5];
        
        const storages = await Storage.find();
        const propaneStorageTank = storages[0];
        const butaneStorageTank = storages[1];
        const mixedStorageTank = storages[2];
        const loadingPump = receivings[6];
        
        const weightbridge = receivings[7];
        const loadingSkid = storages[3];

        res.render('Terminal/capex', {
            layout: 'layouts/main-layout',
            title: 'Form',
            ProjectID: req.params.projectID,
            ProjectName: project.name,
            jettyType,
            jettyConnection,
            unloadingFacility,
            pipelineInstallation,
            mooringFacilities,
            metering,
            propaneStorageTank,
            butaneStorageTank,
            mixedStorageTank,
            loadingPump,
            weightbridge,
            loadingSkid
        });
    } catch (error) {
        res.render('error', {
            layout: 'layouts/main-layout',
            message: error,
            status: 400
        });
    }
}

const createTerminal = async (req, res, next) => {
    try {
        let jettyTypeTotal = 0;
        for (let i = 1; i <= Number(req.body.jettyTypeNumber); i++) {
            jettyTypeTotal += Number(req.body['jettyTypeTotal'+i])
        }
        const jettyConnectionTotal = Number(req.body.jettyConnectionTotal);
        const unloadingFacilityTotal = Number(req.body.unloadingFacilityTotal);
        const pipelineInstallationTotal = Number(req.body.pipelineInstallationTotal);
        let mooringFacilitiesTotal = 0;
        for (let i = 1; i <= Number(req.body.mooringFacilitiesNumber); i++) {
            mooringFacilitiesTotal += Number(req.body['mooringFacilitiesTotal'+i]);
        }
        const meteringTotal = Number(req.body.meteringTotal);
        let receivingOthersTotal = 0;
        for (let i = 1; i <= Number(req.body.receivingOthersNumber); i++) {
            receivingOthersTotal += Number(req.body['receivingOthersTotal'+i]);
            
        }
        const receivingTotal = jettyTypeTotal+jettyConnectionTotal+unloadingFacilityTotal+pipelineInstallationTotal+mooringFacilitiesTotal+meteringTotal+receivingOthersTotal;

        let propaneStorageTankTotal = 0;
        for (let i = 1; i <= Number(req.body.propaneStorageTankNumber); i++) {
            propaneStorageTankTotal += Number(req.body['propaneStorageTankTotal'+i]);
        }
        let butaneStorageTankTotal = 0;
        for (let i = 1; i <= Number(req.body.butaneStorageTankNumber); i++) {
            butaneStorageTankTotal += Number(req.body['butaneStorageTankTotal'+i]);
        } 
        let mixedStorageTankTotal = 0;
        for (let i = 1; i <= Number(req.body.mixedStorageTankNumber); i++) {
            mixedStorageTankTotal += Number(req.body['mixedStorageTankTotal'+i]);
        } 
        const pipelineStorageTotal = Number(req.body.pipelineStorageTotal);
        let loadingPumpTotal = 0;
        for (let i = 1; i <= Number(req.body.loadingPumpNumber); i++) {
            loadingPumpTotal += Number(req.body['loadingPumpTotal'+i]);
        } 
        const heatExhargerTotal = Number(req.body.heatExhargerTotal);
        const boosterPumpTotal = Number(req.body.boosterPumpTotal);
        let storageOthersTotal = 0;
        for (let i = 1; i <= Number(req.body.storageOthersNumber); i++) {
            storageOthersTotal += Number(req.body['storageOthersTotal'+i]);
        } 
        const storagesTotal = propaneStorageTankTotal+butaneStorageTankTotal+mixedStorageTankTotal+pipelineStorageTotal+loadingPumpTotal+heatExhargerTotal+boosterPumpTotal+storageOthersTotal;

        const loadingSkidTotal = Number(req.body.loadingSkidTotal);
        const bufferTankTotal = Number(req.body.bufferTankTotal);
        const weightbridgeTotal = Number(req.body.weightbridgeTotal);
        const loadingBayTotal = Number(req.body.loadingBayTotal);
        let carouselFillingTotal = 0;
        for (let i = 1; i <= Number(req.body.carouselFillingNumber); i++) {
            carouselFillingTotal += Number(req.body['carouselFillingTotal'+i]);
        } 
        let fillingStationOthersTotal = 0;
        for (let i = 1; i <= Number(req.body.fillingStationOthersNumber); i++) {
            fillingStationOthersTotal += Number(req.body['fillingStationOthersTotal'+i]);
        } 
        const fillingStationTotal = loadingSkidTotal+bufferTankTotal+weightbridgeTotal+loadingBayTotal+carouselFillingTotal+fillingStationOthersTotal;

        const terminalAutomationTotal = Number(req.body.terminalAutomationTotal);

        const fireWaterPumpTotal = Number(req.body.fireWaterPumpTotal);
        const fireHydrantsTotal = Number(req.body.fireHydrantsTotal);
        const fireExtinguisersTotal = Number(req.body.fireExtinguisersTotal);
        const fireGasDetectorTotal = Number(req.body.fireGasDetectorTotal);
        const fireSystemTotal = fireWaterPumpTotal+fireHydrantsTotal+fireExtinguisersTotal+fireGasDetectorTotal;

        const flareTotal = Number(req.body.flareTotal);
        const instrumentAirTotal = Number(req.body.instrumentAirTotal);
        const emergencyPowerTotal = Number(req.body.emergencyPowerTotal);
        const dieselOilPumpTotal = Number(req.body.dieselOilPumpTotal);
        const freshWaterPumpTotal = Number(req.body.freshWaterPumpTotal);
        const oilPumpTotal = Number(req.body.oilPumpTotal);
        const dieselOilTankTotal = Number(req.body.dieselOilTankTotal);
        const freshWaterTankTotal = Number(req.body.freshWaterTankTotal);
        const oilTankTotal = Number(req.body.oilTankTotal);
        const utilityTotal = flareTotal+instrumentAirTotal+emergencyPowerTotal+dieselOilPumpTotal+freshWaterPumpTotal+oilPumpTotal+dieselOilTankTotal+freshWaterTankTotal+oilTankTotal;

        const buildingTotal = Number(req.body.buildingTotal);
        const landRentTotal = Number(req.body.buildingTotal);
        
        const infrastructureCost = receivingTotal+storagesTotal+fillingStationTotal+terminalAutomationTotal+fireSystemTotal+utilityTotal+buildingTotal+landRentTotal;
        const taxPermit = Number(infrastructureCost * 25/100);
        const PMTFeed = Number(infrastructureCost * 5/100);
        const totalCapex = infrastructureCost+taxPermit+PMTFeed;
        const disposalPrice = Number((unloadingFacilityTotal+loadingPumpTotal+bufferTankTotal+weightbridgeTotal+carouselFillingTotal+emergencyPowerTotal) * (30/100)) ;
        
        const totalOpex = Number(req.body.opexResult);
        const terminalName = req.body.terminalName;
        const terminal = {terminalName,infrastructureCost,taxPermit,PMTFeed,totalCapex,disposalPrice,totalOpex};
        const ProjectID = req.body.ProjectID;

        const newTerminal = new Terminal(terminal);
        await newTerminal.save();
        res.redirect(`/project/${ProjectID}/terminal`);
    } catch (error) {
        res.render('error', {
            layout: 'layouts/main-layout',
            message: error,
            status: 400
        });
    }
}

const duplicateTerminalByID = async (req, res, next) => {
    try {
        const ProjectID = req.params.projectID;
        const TerminalID = req.params.terminalID;
        const terminal = await Terminal.findOne({_id: ObjectID(TerminalID)});
        terminal._id = ObjectID();
        Terminal.insertMany(terminal, (error, result)=>{
            res.redirect(`/project/${ProjectID}/terminal`);
        });
    } catch (error) {
        res.render('error', {
            layout: 'layouts/main-layout',
            message: error,
            status: 400
        });
    }
}

const deleteTerminalByID = async (req,res,next) => {
    try {
        const ProjectID = req.params.projectID;
        const TerminalID = req.params.terminalID;
        await Terminal.deleteOne({_id : ObjectID(TerminalID)});
        res.redirect(`/project/${ProjectID}/terminal`);
    } catch (error) {
        res.render('error', {
            layout: 'layouts/main-layout',
            message: error,
            status: 400
        });
    }
}

const createTerminalCalculation = async (req, res, next) => {
    try {
        const terminal = await Terminal.findOne({_id: ObjectID(req.params.terminalID)});

        const disposalPrice = terminal.disposalPrice;

        const capexTotal = terminal.totalCapex;
        const opexTotal = terminal.totalOpex;

        const discountRateBody = Number(req.body.discountRate);
        const contractDuration = Number(req.body.contractDuration);
        const investTotal = capexTotal;
        const salvageValue = Number(5/100 * investTotal);
        const annualDepreciation = (investTotal - salvageValue) / contractDuration;

        const thruputDay = Number(req.body.thruput);
        const thruputYear = thruputDay * 356;
        let LPGCost = 0;
        let total = LPGCost * thruputYear;
        
        let revenue = 0;
        let opex = 0;
        let depreciation = 0;
        let EBT = 0;
        let beforeTax = 0
        let afterTax = 0;
        let proceeds = 0;
        let comulativeProceeds = 0;
        let unreturnedInvestment = 0;

        let datas = [];
        let invests = [];
        let arrayDataInvest = [];
        let arrayLabelInvest = [];
        let sumNPV = 0;

        const limit = 10000;
        let next = true;
        let iteration = 0;
        while(next){
            for (let i = 1; i <= contractDuration; i++) {
                if(i==1){
                    revenue = total;
                    opex = opexTotal;
                }
                else{
                    revenue = revenue * 1.002;
                    opex = opex * 1.005;
                }
                depreciation = annualDepreciation;
                EBT = revenue - opex - depreciation;
                beforeTax = (EBT * 22/100);
                if(beforeTax <= 0){
                    beforeTax = 0;
                }
                afterTax = EBT - beforeTax;
                if(unreturnedInvestment > 0){
                    proceeds = depreciation + afterTax + disposalPrice;
                }
                else{
                    proceeds = depreciation + afterTax;
                }
                comulativeProceeds += proceeds;
                unreturnedInvestment = comulativeProceeds - capexTotal;
                const data = {revenue, opex, depreciation, EBT, beforeTax, afterTax, proceeds, comulativeProceeds, unreturnedInvestment};
                datas.push(data);
        
                const discount = discountRateBody/100;
                let discountRate = Math.pow(Number(1+discount), -(i)); 
                let NPV = proceeds * discountRate;
                sumNPV += NPV;
                const invest = {proceeds, discountRate, NPV};
                invests.push(invest);
                arrayLabelInvest.push(i);
                arrayDataInvest.push(unreturnedInvestment);
            }
            const totalNPV = Number(sumNPV - capexTotal);
            
            if(totalNPV >= 0 && totalNPV <= 1500){    
                break;
            }
            else{
                if(totalNPV < 0){
                    LPGCost += 1;
                }
                else{
                    LPGCost -= Number(1/limit);
                }
                total = LPGCost * thruputYear;
                revenue = 0;
                opex = 0;
                depreciation = 0;
                EBT = 0;
                beforeTax = 0
                afterTax = 0;
                proceeds = 0;
                comulativeProceeds = 0;
                unreturnedInvestment = 0;
                datas = [];
                invests = [];
                arrayDataInvest = [];
                arrayLabelInvest = [];
                sumNPV = 0;
            }

            if(iteration == limit){
                next = false;
                break;
            }
            iteration++;
        }
        if(next == false){
            res.json({message: 'Error: Something wrong!'});
            return false;
        }
        const priceUSD_IDR = req.body.priceUSD_IDR;
        const lastInvest = {invests, totalNPV: Number(sumNPV - capexTotal), LPGCost}

        res.render('Terminal/terminal-optimization', {
            layout: 'layouts/main-layout',
            title: 'Form',
            terminal,
            ProjectID: req.params.projectID,
            datas,
            lastInvest,
            contractDuration,
            discountRateBody,
            thruputDay,
            priceUSD_IDR,
            arrayLabelInvest,
            arrayDataInvest
        });
    } catch (error) {
        res.render('error', {
            layout: 'layouts/main-layout',
            message: error,
            status: 400
        });
    }
}

const getTerminalCalculation = async (req, res, next) => {
    try {
        
        const project = await Project.findOne({_id: ObjectID(req.params.projectID)});
        const terminal = await Terminal.findOne({_id: ObjectID(req.params.terminalID)});
        res.render('Terminal/terminal-optimization', {
            layout: 'layouts/main-layout',
            title: 'Form',
            terminal,
            ProjectID: req.params.projectID,
            ProjectName: project.name
        });
    } catch (error) {
        res.render('error', {
            layout: 'layouts/main-layout',
            message: error,
            status: 400
        });
    }
}

const getProjectTransportationByID = async (req, res, next) => {
    try {
        const ProjectID = req.params.projectID;
        const project = await Project.findOne({_id : ObjectID(ProjectID)});
        const transportations = await Transportation.find({ProjectID: ObjectID(ProjectID)});
        const filteredTransportations = [];
        transportations.forEach(transportation => {
            const filteredTransportation = {
                id: transportation._id,
                POL: transportation.Voyage.POL,
                POD: transportation.Voyage.POD,
                shipName: transportation.Ship.shipName,
                typeFreight: transportation.TypeFreight.name,
                typeVoyage: transportation.TypeVoyage.name,
                realFreight_USD_KG_NM: Number(Number(transportation.RealFreightRate.unitCostMassCargo_USD_KG_NM).toFixed(9)), 
                realFreight_IDR_KG_NM: Number(Number(transportation.RealFreightRate.unitCostMassCargo_IDR_KG_NM).toFixed(5)), 
                proposedFreight_USD_KG_NM: Number(Number(transportation.ProposedFreight.proposedFreight_USD_KG_NM).toFixed(9)),
                proposedFreight_IDR_KG_NM: Number(Number(transportation.ProposedFreight.proposedFreight_IDR_KG_NM).toFixed(5)),
                comparisonFreight_USD_MT: Number(Number(transportation.ProposedFreight.proposedFreight_USD_MT).toFixed(3)),
                comparisonFreight_IDR_KG: Number(Number(transportation.ProposedFreight.proposedFreight_IDR_KG).toFixed(2)),
                operatingCostFormula: Number(Number(transportation.TotalCost.totalCostAfterTax).toFixed(2)),
                operatingCostEmpirical: 0,
            }
            filteredTransportations.push(filteredTransportation);
        });
        res.render('Transportation/summary', {
            layout: 'layouts/main-layout',
            title: 'Summary LPG Transportation',
            filteredTransportations,
            project
        });
    } catch (error) {
        res.render('error', {
            layout: 'layouts/main-layout',
            message: error,
            status: 400
        });
    }
}

const updateProjectByID = async (req, res, next) => {
    try {
        const topicID = req.body.topicID;
        await Project.updateOne(
            { _id: ObjectID(req.body.ProjectID)},
            {
                $set: {
                    name: req.body.projectName
                }
            }
        );
        res.redirect('/topic/'+topicID);
    } catch (error) {
        res.render('error', {
            layout: 'layouts/main-layout',
            message: error,
            status: 400
        });
    }
}

const deleteProjectByID = async (req, res, next) => {
    try {
        const projectID = req.params.projectID;
        const topicID = req.body.topicID;
        await Project.deleteOne({_id: ObjectID(projectID)});
        res.redirect('/topic/'+topicID);
    } catch (error) {
        res.render('error', {
            layout: 'layouts/main-layout',
            message: error,
            status: 400
        });
    }
}

const getFormTransportation = async (req, res, next) => {
    try {
        const typeVoyages = await TypeVoyage.find();
        const typeFreights = await TypeFreight.find();
        const ProjectID = req.params.projectID;
        console.log(ProjectID)
        res.render('Transportation/form-ship', {
            layout: 'layouts/main-layout',
            title: 'Form LPG Transportation',
            typeVoyages,
            typeFreights,
            ProjectID
        });
    } catch (error) {
        res.render('error', {
            layout: 'layouts/main-layout',
            message: error,
            status: 400
        });
    }
}

const convertToFloat = (num) => {
    return Number(num.toString());
}

const getFormTransportationFreightVoyage = async (req, res, next) => {
    try {
        const typeVoyages = await TypeVoyage.find();
        const typeFreights = await TypeFreight.find();
        const typeFreight = await TypeFreight.findOne({slug: req.params.typeFreightSlug});
        const typeVoyage = await TypeVoyage.findOne({slug: req.params.typeVoyageSlug});
        const ProjectID = req.params.projectID;
        const unitConversion = await UnitConversion.find();
        const crewDatas = await CrewData.find().sort({'total':1});
        res.render('Transportation/form-ship', {
            layout: 'layouts/main-layout',
            title: 'Form LPG Transportation',
            typeVoyages,
            typeFreights,
            typeFreight,
            typeVoyage,
            ProjectID,
            currentYear: new Date().getFullYear(),
            CBMtoMT : convertToFloat(unitConversion[0].CBMtoMT),
            crewDatas
        });
    } catch (error) {
        res.render('error', {
            layout: 'layouts/main-layout',
            message: error,
            status: 400
        });
    }
}

const createTransportation = async (req, res, next) => {
    try {
        const unitConversion = await UnitConversion.find();
        const transportation = {};

        const typeFreight = await TypeFreight.findOne({slug: req.params.typeFreightSlug});
        const typeVoyage = await TypeVoyage.findOne({slug: req.params.typeVoyageSlug});

        transportation.ProjectID = req.body.ProjectID;

        transportation.TypeFreight = {
            name: typeFreight.name,
            slug: typeFreight.slug
        }

        transportation.TypeVoyage = {
            name: typeVoyage.name,
            slug: typeVoyage.slug
        }

        //ship
        let ship = {
            shipName: req.body.shipName,
            shipCapacityCBM: req.body.shipCapacityCBM,
            shipCapacityMT: req.body.shipCapacityMT,
            typeVessel: req.body.typeVessel,
            IMONumber: req.body.IMONumber,
            MMSINumber: req.body.MMSINumber,
            callSign: req.body.callSign,
            grossTonnage: req.body.grossTonnage,
            summerDWT: req.body.summerDWT,
            lengthOverall: req.body.lengthOverall,
            yearBuilt: req.body.yearBuilt,
            shipAge: req.body.shipAge,
            crewNumber: req.body.crewNumber,
            SFOC: req.body.SFOC,
        }
        transportation.Ship = ship;

        //voyage
        let voyage = {
            POL: req.body.POL,
            POD: req.body.POD,
            distance: Number(req.body.distance),
            serviceSpeedVessel: Number(req.body.serviceSpeedVessel)
        }
        transportation.Voyage = voyage;

        //ShipCargoTankFullCapacity
        let cargoTank = [];
        for (let i = 1; i <= req.body.numberOfCargoTank; i++) {
            cargoTank.push(req.body['cargoTank'+i]);
        }
        let shipCargoTankFullCapacity = {
            numberOfCargoTank: req.body.numberOfCargoTank,
            cargoTank: cargoTank
        }
        let totalCapacityCBM = 0;
        cargoTank.forEach(cargo => {
            totalCapacityCBM += Number(cargo);
        });
        const totalCapacityLitre = totalCapacityCBM / convertToFloat(unitConversion[0].CBMtoLitre);
        const totalCapacityKG = totalCapacityLitre / convertToFloat(unitConversion[0].KGtoLitre);
        shipCargoTankFullCapacity.totalCapacityCBM = totalCapacityCBM;
        shipCargoTankFullCapacity.totalCapacityLitre = totalCapacityLitre;
        shipCargoTankFullCapacity.totalCapacityKG = totalCapacityKG;
        transportation.ShipCargoTankFullCapacity = shipCargoTankFullCapacity;

        //ShipCargoTankOperationalCapacity
        let shipCargoTankOperationalCapacity = {};
        const loadingFactor = 98;
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
        const totalCapacityOpLitre = totalCapacityOpCBM / convertToFloat(unitConversion[0].CBMtoLitre);
        const totalCapacityOpKG = totalCapacityOpLitre / convertToFloat(unitConversion[0].KGtoLitre);
        shipCargoTankOperationalCapacity.totalCapacityOpCBM = totalCapacityOpCBM;
        shipCargoTankOperationalCapacity.totalCapacityOpLitre = totalCapacityOpLitre;
        shipCargoTankOperationalCapacity.totalCapacityOpKG = totalCapacityOpKG;
        transportation.ShipCargoTankOperationalCapacity = shipCargoTankOperationalCapacity;

        //TURNAROUND VOYAGE
        const ladenSailingTime = voyage.distance/voyage.serviceSpeedVessel/24;
        const ballastSailingTime = voyage.distance/voyage.serviceSpeedVessel/24;
        const totalSailingTime = Number(ladenSailingTime + ballastSailingTime);

        let pumpLoadingRate = [];
        for (let i = 1; i <= req.body.numberOfCargoTank; i++) {
            pumpLoadingRate.push(req.body['pumpLoadingRate'+i]);
        }
        let sumLoadingTime = 0;
        for (let i = 0; i < req.body.numberOfCargoTank; i++) {
            sumLoadingTime += Number(Number(shipCargoTankOperationalCapacity.cargoTankOp[i])/Number(pumpLoadingRate[i]));
        }
        const totalLoadingTime = sumLoadingTime/24;
        const enterWaitTimePOL = 1;

        let pumpDischargeRate = [];
        for (let i = 1; i <= req.body.numberOfCargoTank; i++) {
            pumpDischargeRate.push(req.body['pumpDischargeRate'+i]);
        }
        let sumDischargeRate = 0;
        for (let i = 0; i < req.body.numberOfCargoTank; i++) {
            sumDischargeRate += Number(Number(shipCargoTankOperationalCapacity.cargoTankOp[i])/Number(pumpDischargeRate[i]));
        }
        const totalDischargeTime = sumDischargeRate/24;
        const enterWaitTimePOD = 1;

        const totalTurnRoundTime = ladenSailingTime+ballastSailingTime+totalLoadingTime+enterWaitTimePOL+totalDischargeTime+enterWaitTimePOD;
        const calendarDaysYear = 360;
        const docking = 30;
        const mobilization = 0;
        const effectiveDays = calendarDaysYear-docking;
        const numberRoundTripYear = Number(Math.floor(effectiveDays/totalTurnRoundTime));
        const idleDaysYear = effectiveDays - (totalTurnRoundTime*numberRoundTripYear);
        const totalCargoCarryCapacityYearCBM = numberRoundTripYear * shipCargoTankOperationalCapacity.totalCapacityOpCBM;
        const totalCargoCarryCapacityYearKG = numberRoundTripYear * shipCargoTankOperationalCapacity.totalCapacityOpKG;
        const totalCargoCarryCapacityYearMMBTU = totalCargoCarryCapacityYearKG * convertToFloat(unitConversion[0].KGtoMMBTU);

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
        const portIdleMFO = Number(req.body.portIdleMFO);
        const portIdleMDO = Number(req.body.portIdleMDO);
        const portIdleMGO = Number(req.body.portIdleMGO);
        const portWorkingMFO = Number(req.body.portWorkingMFO);
        const portWorkingMDO = Number(req.body.portWorkingMDO);
        const portWorkingMGO = Number(req.body.portWorkingMGO);
        const atSeaMFO = Number(req.body.atSeaMFO);
        const atSeaMDO = Number(req.body.atSeaMDO);
        const atSeaMGO = Number(req.body.atSeaMGO);
        const bunkerPriceIDRMFO = Number(req.body.bunkerPriceIDRMFO);
        const bunkerPriceIDRMDO = Number(req.body.bunkerPriceIDRMDO);
        const bunkerPriceIDRMGO = Number(req.body.bunkerPriceIDRMGO);
        const bunkerConsumeTripMFO = (turnAroundVoyage.totalTurnRoundTime*atSeaMFO) + ((turnAroundVoyage.totalLoadingTime+turnAroundVoyage.totalDischargeTime)*portWorkingMFO) + ((turnAroundVoyage.enterWaitTimePOD+turnAroundVoyage.enterWaitTimePOL)*portIdleMFO);
        const bunkerConsumeTripMDO = (turnAroundVoyage.totalTurnRoundTime*atSeaMDO) + ((turnAroundVoyage.totalLoadingTime+turnAroundVoyage.totalDischargeTime)*portWorkingMDO) + ((turnAroundVoyage.enterWaitTimePOD+turnAroundVoyage.enterWaitTimePOL)*portIdleMDO);
        const bunkerConsumeTripMGO = (turnAroundVoyage.totalTurnRoundTime*atSeaMGO) + ((turnAroundVoyage.totalLoadingTime+turnAroundVoyage.totalDischargeTime)*portWorkingMGO) + ((turnAroundVoyage.enterWaitTimePOD+turnAroundVoyage.enterWaitTimePOL)*portIdleMGO);
        const bunkerConsumeYearMFO = bunkerConsumeTripMFO*turnAroundVoyage.numberRoundTripYear;
        const bunkerConsumeYearMDO = bunkerConsumeTripMDO*turnAroundVoyage.numberRoundTripYear;
        const bunkerConsumeYearMGO = bunkerConsumeTripMGO*turnAroundVoyage.numberRoundTripYear;
        const bunkerPriceUSDMFO = bunkerPriceIDRMFO / convertToFloat(unitConversion[0].USDtoIDR);
        const bunkerPriceUSDMDO = bunkerPriceIDRMDO / convertToFloat(unitConversion[0].USDtoIDR);
        const bunkerPriceUSDMGO = bunkerPriceIDRMGO / convertToFloat(unitConversion[0].USDtoIDR);
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
        
        //CREW COST
        const deckMaster = Number(req.body.deckMaster);
        const deckChiefOfficer = Number(req.body.deckChiefOfficer);
        const deckOfficer = Number(req.body.deckOfficer);
        const deckRadioOperator = Number(req.body.deckRadioOperator);
        const deckBoatswain = Number(req.body.deckBoatswain);
        const deckAbleBodied = Number(req.body.deckAbleBodied);
        const deckOrdinarySeamen = Number(req.body.deckOrdinarySeamen);
        const deckChef = Number(req.body.deckChef);
        const deckAssistantChef = Number(req.body.deckAssistantChef);
        const deckOthers = Number(req.body.deckOthers);
        const deckDept = {deckMaster, deckChiefOfficer, deckOfficer, deckRadioOperator, deckBoatswain, deckAbleBodied, deckOrdinarySeamen, deckChef, deckAssistantChef, deckOthers};
        const engineChiefEngineer = Number(req.body.engineChiefEngineer);
        const engineChiefMachinist = Number(req.body.engineChiefMachinist);
        const engineMachinist = Number(req.body.engineMachinist);
        const engineForemen = Number(req.body.engineForemen);
        const engineOiler = Number(req.body.engineOiler);
        const engineWiper = Number(req.body.engineWiper);
        const engineOthers = Number(req.body.engineOthers);
        const engineDept = {engineChiefEngineer, engineChiefMachinist, engineMachinist, engineForemen, engineOiler, engineWiper, engineOthers};
        const sumDeckDept = (deckMaster+deckChiefOfficer+deckOfficer+deckRadioOperator+deckBoatswain+deckAbleBodied+deckOrdinarySeamen+deckChef+deckAssistantChef+deckOthers);
        const sumEngineDept = (engineChiefEngineer+ engineChiefMachinist+ engineMachinist+ engineForemen+ engineOiler+ engineWiper+ engineOthers);
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
        const portChargesRoundTrip = Number(req.body.portChargesRoundTrip);
        const totalPortChargesYear = portChargesRoundTrip * turnAroundVoyage.numberRoundTripYear;
        const portCost = {portChargesRoundTrip, totalPortChargesYear};
        transportation.PortCost = portCost;

        //CARGO HANDLING COST
        const lasingUnlasPOLTrip = Number(req.body.lasingUnlasPOLTrip);
        const lasingUnlasPODTrip = Number(req.body.lasingUnlasPODTrip);
        const totalCargoHandlingCostYear = (lasingUnlasPOLTrip*turnAroundVoyage.numberRoundTripYear)+(lasingUnlasPODTrip*turnAroundVoyage.numberRoundTripYear);
        const cargoHandlingCost = {lasingUnlasPOLTrip, lasingUnlasPODTrip, totalCargoHandlingCostYear};
        transportation.CargoHandlingCost = cargoHandlingCost;
        
        //VesselCharterCost
        const charterRateDay = Number(req.body.charterRateDay);
        const totalCharterRateYear = charterRateDay*turnAroundVoyage.calendarDaysYear;
        const vesselCharterCost = {charterRateDay, totalCharterRateYear};
        transportation.VesselCharterCost = vesselCharterCost;

        //InsuranceCost
        const shipInsurance = Number(req.body.shipInsurance);
        const crewInsurance = Number(req.body.crewInsurance);
        const totalInsuranceCostYear = shipInsurance + crewInsurance;
        const insuranceCost = {shipInsurance, crewInsurance, totalInsuranceCostYear};
        transportation.InsuranceCost = insuranceCost;

        //DockingRepairMaintenanceCost
        const dockingCost = Number(req.body.dockingCost);
        const repairStoreCost = Number(req.body.repairStoreCost);
        const lubeOilCost = Number(req.body.lubeOilCost);
        const totalDockingRepairMaintenanceCost = dockingCost+repairStoreCost+lubeOilCost;
        const dockingRepairMaintenanceCost = {dockingCost, repairStoreCost, lubeOilCost, totalDockingRepairMaintenanceCost};
        transportation.DockingRepairMaintenanceCost = dockingRepairMaintenanceCost;

        //OtherCost
        const victually = Number(req.body.victually);
        const administrationCost = Number(req.body.administrationCost);
        const totalOtherCost = victually + administrationCost;
        const otherCost = {victually, administrationCost, totalOtherCost};
        transportation.OtherCost = otherCost;

        //TotalCost
        const tax = Number(req.body.tax);
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
        const unitCostMassCargo_IDR_KG = unitCostMassCargo_USD_KG * convertToFloat(unitConversion[0].USDtoIDR);
        const unitCostMassCargo_IDR_MT = unitCostMassCargo_IDR_KG*1000;
        const unitCost_USD_MMBTU = (totalCost.totalCostAfterTax/turnAroundVoyage.totalCargoCarryCapacityYearMMBTU);
        const unitCost_USD_MMBTU_NM = unitCost_USD_MMBTU/(turnAroundVoyage.numberRoundTripYear*voyage.distance*2);
        const unitCostMassCargo_USD_KG_NM = unitCostMassCargo_USD_KG / (turnAroundVoyage.numberRoundTripYear*voyage.distance*2);
        const unitCostMassCargo_IDR_KG_NM = unitCostMassCargo_USD_KG_NM * convertToFloat(unitConversion[0].USDtoIDR);
        const realFreightRate = {unitCostMassCargo_USD_KG, unitCostMassCargo_USD_MT, unitCostMassCargo_IDR_KG, unitCostMassCargo_IDR_MT, unitCost_USD_MMBTU, unitCost_USD_MMBTU_NM, unitCostMassCargo_USD_KG_NM, unitCostMassCargo_IDR_KG_NM};
        transportation.RealFreightRate = realFreightRate;

        //ProposedFreight
        const profitMargin = Number(20/100);
        const proposedFreight_USD_KG = (realFreightRate.unitCostMassCargo_USD_KG+(realFreightRate.unitCostMassCargo_USD_KG*profitMargin));
        const proposedFreight_USD_MT = proposedFreight_USD_KG*1000;
        const proposedFreight_IDR_KG = proposedFreight_USD_KG*convertToFloat(unitConversion[0].USDtoIDR);
        const proposedFreight_IDR_MT = proposedFreight_IDR_KG*1000;
        const proposedFreight_USD_MMBTU = realFreightRate.unitCost_USD_MMBTU+(realFreightRate.unitCost_USD_MMBTU*profitMargin);
        const proposedFreight_USD_MMBTU_NM = realFreightRate.unitCost_USD_MMBTU_NM+(realFreightRate.unitCost_USD_MMBTU_NM*profitMargin);
        const proposedFreight_USD_KG_NM = realFreightRate.unitCostMassCargo_USD_KG_NM+(realFreightRate.unitCostMassCargo_USD_KG_NM*profitMargin);
        const proposedFreight_IDR_KG_NM = proposedFreight_USD_KG_NM*convertToFloat(unitConversion[0].USDtoIDR);
        const revenue = proposedFreight_USD_KG_NM*turnAroundVoyage.totalCargoCarryCapacityYearKG*turnAroundVoyage.numberRoundTripYear*voyage.distance*2;
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

        const newTransportation = new Transportation(transportation);
        await newTransportation.save();
        res.redirect(`/project/${req.body.ProjectID}/transportation`);
    } catch (error) {
        res.render('error', {
            layout: 'layouts/main-layout',
            message: error,
            status: 400
        });
    }
}

const editTransportationByID = async (req, res, next) => {
    try {
        const transportation = await Transportation.findOne({_id: req.params.transportationID});
        const unitConversion = await UnitConversion.find();
        const crewDatas = await CrewData.find().sort({'total':1});
        const ProjectID = req.params.projectID;
        console.log(transportation)
        res.render('Transportation/form-ship-edit', {
            layout: 'layouts/main-layout',
            title: 'Edit Form LPG Transportation',
            transportation,
            currentYear: new Date().getFullYear(),
            CBMtoMT : convertToFloat(unitConversion[0].CBMtoMT),
            crewDatas,
            ProjectID
        });
    } catch (error) {
        console.log(error)
        res.render('error', {
            layout: 'layouts/main-layout',
            message: error,
            status: 400
        });
    }
}

const updateTransportationByID = async (req, res, next) => {
    try {
        const unitConversion = await UnitConversion.find();
        const transportation = {};

        const typeFreight = await TypeFreight.findOne({slug: req.body.typeFreightSlug});
        const typeVoyage = await TypeVoyage.findOne({slug: req.body.typeVoyageSlug});

        transportation.ProjectID = req.body.ProjectID;

        transportation.TypeFreight = {
            name: typeFreight.name,
            slug: typeFreight.slug
        }

        transportation.TypeVoyage = {
            name: typeVoyage.name,
            slug: typeVoyage.slug
        }

        //ship
        let ship = {
            shipName: req.body.shipName,
            shipCapacityCBM: req.body.shipCapacityCBM,
            shipCapacityMT: req.body.shipCapacityMT,
            typeVessel: req.body.typeVessel,
            IMONumber: req.body.IMONumber,
            MMSINumber: req.body.MMSINumber,
            callSign: req.body.callSign,
            grossTonnage: req.body.grossTonnage,
            summerDWT: req.body.summerDWT,
            lengthOverall: req.body.lengthOverall,
            yearBuilt: req.body.yearBuilt,
            shipAge: req.body.shipAge,
            crewNumber: req.body.crewNumber,
            SFOC: req.body.SFOC,
        }
        transportation.Ship = ship;

        //voyage
        let voyage = {
            POL: req.body.POL,
            POD: req.body.POD,
            distance: Number(req.body.distance),
            serviceSpeedVessel: Number(req.body.serviceSpeedVessel)
        }
        transportation.Voyage = voyage;

        //ShipCargoTankFullCapacity
        let cargoTank = [];
        for (let i = 1; i <= req.body.numberOfCargoTank; i++) {
            cargoTank.push(req.body['cargoTank'+i]);
        }
        let shipCargoTankFullCapacity = {
            numberOfCargoTank: req.body.numberOfCargoTank,
            cargoTank: cargoTank
        }
        let totalCapacityCBM = 0;
        cargoTank.forEach(cargo => {
            totalCapacityCBM += Number(cargo);
        });
        const totalCapacityLitre = totalCapacityCBM / convertToFloat(unitConversion[0].CBMtoLitre);
        const totalCapacityKG = totalCapacityLitre / convertToFloat(unitConversion[0].KGtoLitre);
        shipCargoTankFullCapacity.totalCapacityCBM = totalCapacityCBM;
        shipCargoTankFullCapacity.totalCapacityLitre = totalCapacityLitre;
        shipCargoTankFullCapacity.totalCapacityKG = totalCapacityKG;
        transportation.ShipCargoTankFullCapacity = shipCargoTankFullCapacity;

        //ShipCargoTankOperationalCapacity
        let shipCargoTankOperationalCapacity = {};
        const loadingFactor = 98;
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
        const totalCapacityOpLitre = totalCapacityOpCBM / convertToFloat(unitConversion[0].CBMtoLitre);
        const totalCapacityOpKG = totalCapacityOpLitre / convertToFloat(unitConversion[0].KGtoLitre);
        shipCargoTankOperationalCapacity.totalCapacityOpCBM = totalCapacityOpCBM;
        shipCargoTankOperationalCapacity.totalCapacityOpLitre = totalCapacityOpLitre;
        shipCargoTankOperationalCapacity.totalCapacityOpKG = totalCapacityOpKG;
        transportation.ShipCargoTankOperationalCapacity = shipCargoTankOperationalCapacity;

        //TURNAROUND VOYAGE
        const ladenSailingTime = voyage.distance/voyage.serviceSpeedVessel/24;
        const ballastSailingTime = voyage.distance/voyage.serviceSpeedVessel/24;
        const totalSailingTime = Number(ladenSailingTime + ballastSailingTime);

        let pumpLoadingRate = [];
        for (let i = 1; i <= req.body.numberOfCargoTank; i++) {
            pumpLoadingRate.push(req.body['pumpLoadingRate'+i]);
        }
        let sumLoadingTime = 0;
        for (let i = 0; i < req.body.numberOfCargoTank; i++) {
            sumLoadingTime += Number(Number(shipCargoTankOperationalCapacity.cargoTankOp[i])/Number(pumpLoadingRate[i]));
        }
        const totalLoadingTime = sumLoadingTime/24;
        const enterWaitTimePOL = 1;

        let pumpDischargeRate = [];
        for (let i = 1; i <= req.body.numberOfCargoTank; i++) {
            pumpDischargeRate.push(req.body['pumpDischargeRate'+i]);
        }
        let sumDischargeRate = 0;
        for (let i = 0; i < req.body.numberOfCargoTank; i++) {
            sumDischargeRate += Number(Number(shipCargoTankOperationalCapacity.cargoTankOp[i])/Number(pumpDischargeRate[i]));
        }
        const totalDischargeTime = sumDischargeRate/24;
        const enterWaitTimePOD = 1;

        const totalTurnRoundTime = ladenSailingTime+ballastSailingTime+totalLoadingTime+enterWaitTimePOL+totalDischargeTime+enterWaitTimePOD;
        const calendarDaysYear = 360;
        const docking = 30;
        const mobilization = 0;
        const effectiveDays = calendarDaysYear-docking;
        const numberRoundTripYear = Number(Math.floor(effectiveDays/totalTurnRoundTime));
        const idleDaysYear = effectiveDays - (totalTurnRoundTime*numberRoundTripYear);
        const totalCargoCarryCapacityYearCBM = numberRoundTripYear * shipCargoTankOperationalCapacity.totalCapacityOpCBM;
        const totalCargoCarryCapacityYearKG = numberRoundTripYear * shipCargoTankOperationalCapacity.totalCapacityOpKG;
        const totalCargoCarryCapacityYearMMBTU = totalCargoCarryCapacityYearKG * convertToFloat(unitConversion[0].KGtoMMBTU);

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
        const portIdleMFO = Number(req.body.portIdleMFO);
        const portIdleMDO = Number(req.body.portIdleMDO);
        const portIdleMGO = Number(req.body.portIdleMGO);
        const portWorkingMFO = Number(req.body.portWorkingMFO);
        const portWorkingMDO = Number(req.body.portWorkingMDO);
        const portWorkingMGO = Number(req.body.portWorkingMGO);
        const atSeaMFO = Number(req.body.atSeaMFO);
        const atSeaMDO = Number(req.body.atSeaMDO);
        const atSeaMGO = Number(req.body.atSeaMGO);
        const bunkerPriceIDRMFO = Number(req.body.bunkerPriceIDRMFO);
        const bunkerPriceIDRMDO = Number(req.body.bunkerPriceIDRMDO);
        const bunkerPriceIDRMGO = Number(req.body.bunkerPriceIDRMGO);
        const bunkerConsumeTripMFO = (turnAroundVoyage.totalTurnRoundTime*atSeaMFO) + ((turnAroundVoyage.totalLoadingTime+turnAroundVoyage.totalDischargeTime)*portWorkingMFO) + ((turnAroundVoyage.enterWaitTimePOD+turnAroundVoyage.enterWaitTimePOL)*portIdleMFO);
        const bunkerConsumeTripMDO = (turnAroundVoyage.totalTurnRoundTime*atSeaMDO) + ((turnAroundVoyage.totalLoadingTime+turnAroundVoyage.totalDischargeTime)*portWorkingMDO) + ((turnAroundVoyage.enterWaitTimePOD+turnAroundVoyage.enterWaitTimePOL)*portIdleMDO);
        const bunkerConsumeTripMGO = (turnAroundVoyage.totalTurnRoundTime*atSeaMGO) + ((turnAroundVoyage.totalLoadingTime+turnAroundVoyage.totalDischargeTime)*portWorkingMGO) + ((turnAroundVoyage.enterWaitTimePOD+turnAroundVoyage.enterWaitTimePOL)*portIdleMGO);
        const bunkerConsumeYearMFO = bunkerConsumeTripMFO*turnAroundVoyage.numberRoundTripYear;
        const bunkerConsumeYearMDO = bunkerConsumeTripMDO*turnAroundVoyage.numberRoundTripYear;
        const bunkerConsumeYearMGO = bunkerConsumeTripMGO*turnAroundVoyage.numberRoundTripYear;
        const bunkerPriceUSDMFO = bunkerPriceIDRMFO / convertToFloat(unitConversion[0].USDtoIDR);
        const bunkerPriceUSDMDO = bunkerPriceIDRMDO / convertToFloat(unitConversion[0].USDtoIDR);
        const bunkerPriceUSDMGO = bunkerPriceIDRMGO / convertToFloat(unitConversion[0].USDtoIDR);
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
        
        //CREW COST
        const deckMaster = Number(req.body.deckMaster);
        const deckChiefOfficer = Number(req.body.deckChiefOfficer);
        const deckOfficer = Number(req.body.deckOfficer);
        const deckRadioOperator = Number(req.body.deckRadioOperator);
        const deckBoatswain = Number(req.body.deckBoatswain);
        const deckAbleBodied = Number(req.body.deckAbleBodied);
        const deckOrdinarySeamen = Number(req.body.deckOrdinarySeamen);
        const deckChef = Number(req.body.deckChef);
        const deckAssistantChef = Number(req.body.deckAssistantChef);
        const deckOthers = Number(req.body.deckOthers);
        const deckDept = {deckMaster, deckChiefOfficer, deckOfficer, deckRadioOperator, deckBoatswain, deckAbleBodied, deckOrdinarySeamen, deckChef, deckAssistantChef, deckOthers};
        const engineChiefEngineer = Number(req.body.engineChiefEngineer);
        const engineChiefMachinist = Number(req.body.engineChiefMachinist);
        const engineMachinist = Number(req.body.engineMachinist);
        const engineForemen = Number(req.body.engineForemen);
        const engineOiler = Number(req.body.engineOiler);
        const engineWiper = Number(req.body.engineWiper);
        const engineOthers = Number(req.body.engineOthers);
        const engineDept = {engineChiefEngineer, engineChiefMachinist, engineMachinist, engineForemen, engineOiler, engineWiper, engineOthers};
        const sumDeckDept = (deckMaster+deckChiefOfficer+deckOfficer+deckRadioOperator+deckBoatswain+deckAbleBodied+deckOrdinarySeamen+deckChef+deckAssistantChef+deckOthers);
        const sumEngineDept = (engineChiefEngineer+ engineChiefMachinist+ engineMachinist+ engineForemen+ engineOiler+ engineWiper+ engineOthers);
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
        const portChargesRoundTrip = Number(req.body.portChargesRoundTrip);
        const totalPortChargesYear = portChargesRoundTrip * turnAroundVoyage.numberRoundTripYear;
        const portCost = {portChargesRoundTrip, totalPortChargesYear};
        transportation.PortCost = portCost;

        //CARGO HANDLING COST
        const lasingUnlasPOLTrip = Number(req.body.lasingUnlasPOLTrip);
        const lasingUnlasPODTrip = Number(req.body.lasingUnlasPODTrip);
        const totalCargoHandlingCostYear = (lasingUnlasPOLTrip*turnAroundVoyage.numberRoundTripYear)+(lasingUnlasPODTrip*turnAroundVoyage.numberRoundTripYear);
        const cargoHandlingCost = {lasingUnlasPOLTrip, lasingUnlasPODTrip, totalCargoHandlingCostYear};
        transportation.CargoHandlingCost = cargoHandlingCost;
        
        //VesselCharterCost
        const charterRateDay = Number(req.body.charterRateDay);
        const totalCharterRateYear = charterRateDay*turnAroundVoyage.calendarDaysYear;
        const vesselCharterCost = {charterRateDay, totalCharterRateYear};
        transportation.VesselCharterCost = vesselCharterCost;

        //InsuranceCost
        const shipInsurance = Number(req.body.shipInsurance);
        const crewInsurance = Number(req.body.crewInsurance);
        const totalInsuranceCostYear = shipInsurance + crewInsurance;
        const insuranceCost = {shipInsurance, crewInsurance, totalInsuranceCostYear};
        transportation.InsuranceCost = insuranceCost;

        //DockingRepairMaintenanceCost
        const dockingCost = Number(req.body.dockingCost);
        const repairStoreCost = Number(req.body.repairStoreCost);
        const lubeOilCost = Number(req.body.lubeOilCost);
        const totalDockingRepairMaintenanceCost = dockingCost+repairStoreCost+lubeOilCost;
        const dockingRepairMaintenanceCost = {dockingCost, repairStoreCost, lubeOilCost, totalDockingRepairMaintenanceCost};
        transportation.DockingRepairMaintenanceCost = dockingRepairMaintenanceCost;

        //OtherCost
        const victually = Number(req.body.victually);
        const administrationCost = Number(req.body.administrationCost);
        const totalOtherCost = victually + administrationCost;
        const otherCost = {victually, administrationCost, totalOtherCost};
        transportation.OtherCost = otherCost;

        //TotalCost
        const tax = Number(req.body.tax);
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
        const unitCostMassCargo_IDR_KG = unitCostMassCargo_USD_KG * convertToFloat(unitConversion[0].USDtoIDR);
        const unitCostMassCargo_IDR_MT = unitCostMassCargo_IDR_KG*1000;
        const unitCost_USD_MMBTU = (totalCost.totalCostAfterTax/turnAroundVoyage.totalCargoCarryCapacityYearMMBTU);
        const unitCost_USD_MMBTU_NM = unitCost_USD_MMBTU/(turnAroundVoyage.numberRoundTripYear*voyage.distance*2);
        const unitCostMassCargo_USD_KG_NM = unitCostMassCargo_USD_KG / (turnAroundVoyage.numberRoundTripYear*voyage.distance*2);
        const unitCostMassCargo_IDR_KG_NM = unitCostMassCargo_USD_KG_NM * convertToFloat(unitConversion[0].USDtoIDR);
        const realFreightRate = {unitCostMassCargo_USD_KG, unitCostMassCargo_USD_MT, unitCostMassCargo_IDR_KG, unitCostMassCargo_IDR_MT, unitCost_USD_MMBTU, unitCost_USD_MMBTU_NM, unitCostMassCargo_USD_KG_NM, unitCostMassCargo_IDR_KG_NM};
        transportation.RealFreightRate = realFreightRate;

        //ProposedFreight
        const profitMargin = Number(20/100);
        const proposedFreight_USD_KG = (realFreightRate.unitCostMassCargo_USD_KG+(realFreightRate.unitCostMassCargo_USD_KG*profitMargin));
        const proposedFreight_USD_MT = proposedFreight_USD_KG*1000;
        const proposedFreight_IDR_KG = proposedFreight_USD_KG*convertToFloat(unitConversion[0].USDtoIDR);
        const proposedFreight_IDR_MT = proposedFreight_IDR_KG*1000;
        const proposedFreight_USD_MMBTU = realFreightRate.unitCost_USD_MMBTU+(realFreightRate.unitCost_USD_MMBTU*profitMargin);
        const proposedFreight_USD_MMBTU_NM = realFreightRate.unitCost_USD_MMBTU_NM+(realFreightRate.unitCost_USD_MMBTU_NM*profitMargin);
        const proposedFreight_USD_KG_NM = realFreightRate.unitCostMassCargo_USD_KG_NM+(realFreightRate.unitCostMassCargo_USD_KG_NM*profitMargin);
        const proposedFreight_IDR_KG_NM = proposedFreight_USD_KG_NM*convertToFloat(unitConversion[0].USDtoIDR);
        const revenue = proposedFreight_USD_KG_NM*turnAroundVoyage.totalCargoCarryCapacityYearKG*turnAroundVoyage.numberRoundTripYear*voyage.distance*2;
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
        await Transportation.updateOne(
            { _id: req.body.TransportationID},
            {
                $set: transportation
            }
        );
        res.redirect(`/project/${req.body.ProjectID}/transportation`);
    } catch (error) {
        res.render('error', {
            layout: 'layouts/main-layout',
            message: error,
            status: 400
        });
    }
}

const duplicateTransportationByID = async (req, res, next) => {
    try {
        const ProjectID = req.params.projectID;
        const TransportationID = req.params.transportationID;
        const transportation = await Transportation.findOne({_id: ObjectID(TransportationID)});
        transportation._id = ObjectID();
        Transportation.insertMany(transportation, (error, result)=>{
            res.redirect(`/project/${ProjectID}/transportation`);
        });
    } catch (error) {
        res.render('error', {
            layout: 'layouts/main-layout',
            message: error,
            status: 400
        });
    }
}

const deleteTransportationByID = async (req, res, next) => {
    try {
        const ProjectID = req.params.projectID;
        const TransportationID = req.params.transportationID;
        await Transportation.deleteOne({_id : ObjectID(TransportationID)});
        res.redirect(`/project/${ProjectID}/transportation`);
    } catch (error) {
        res.render('error', {
            layout: 'layouts/main-layout',
            message: error,
            status: 400
        });
    }
}

module.exports = {
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
    duplicateTerminalByID
}