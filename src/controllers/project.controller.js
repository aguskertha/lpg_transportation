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
const BunkerPriceSensitivity = require('./../models/bunker-price-sensitivity');
const Topic = require('./../models/topic.model');
const CostShipAge = require('./../models/cost-ship-age');
const TypeCustom = require('./../models/type-custom.model');
const createProject = async (req, res, next) => {
    try {
        const topicID = req.body.topicID;
        const project = {
            name: req.body.projectName,
            topicID
        }
        const topics = await Topic.findOne({_id: ObjectID(topicID)});
        const newProject = new Project(project);
        await newProject.save();
        res.redirect('/topic/'+topicID);
        // res.render('Topic/topic',{
        //     layout: 'layouts/main-layout',
        //     topicID,
        //     topics
        // })

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
        const terminalDatas = await Terminal.find({ProjectID: ObjectID(ProjectID)});
        let terminals = [];
        terminalDatas.forEach(terminal => {
            const data = {
                _id: terminal._id,
                terminalName: terminal.terminalName,
                infrastructureCost: terminal.Capex.infrastructureCost,
                taxPermit: terminal.Capex.taxPermit,
                PMTFeed: terminal.Capex.PMTFeed,
                totalCapex: terminal.Capex.totalCapex,
                disposalPrice: terminal.Capex.disposalPrice,
                totalOpex: terminal.Opex.totalOpex,
            }
            terminals.push(data);
        });
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
        let jettyTypeSubTotals = [];
        for (let i = 1; i <= Number(req.body.jettyTypeNumber); i++) {
            jettyTypeSubTotals.push(Number(req.body['jettyTypeTotal'+i]));
            jettyTypeTotal += Number(req.body['jettyTypeTotal'+i])
        }
        const jettyConnectionTotal = Number(req.body.jettyConnectionTotal);
        const unloadingFacilityTotal = Number(req.body.unloadingFacilityTotal);
        const pipelineInstallationTotal = Number(req.body.pipelineInstallationTotal);
        let mooringFacilitiesTotal = 0;
        let mooringFacilitiesSubTotals = [];
        for (let i = 1; i <= Number(req.body.mooringFacilitiesNumber); i++) {
            mooringFacilitiesSubTotals.push(Number(req.body['mooringFacilitiesTotal'+i]));
            mooringFacilitiesTotal += Number(req.body['mooringFacilitiesTotal'+i]);
        }
        const meteringTotal = Number(req.body.meteringTotal);
        let receivingOthersTotal = 0;
        let receivingOthersSubTotals = [];
        for (let i = 1; i <= Number(req.body.receivingOthersNumber); i++) {
            receivingOthersSubTotals.push(Number(req.body['receivingOthersTotal'+i]))
            receivingOthersTotal += Number(req.body['receivingOthersTotal'+i]);
            
        }
        const receivingTotal = jettyTypeTotal+jettyConnectionTotal+unloadingFacilityTotal+pipelineInstallationTotal+mooringFacilitiesTotal+meteringTotal+receivingOthersTotal;

        const Receiving = {
            JettyType: {
                jettyTypeNumber: Number(req.body.jettyTypeNumber),
                jettyTypeSubTotals,
                jettyTypeTotal
            },
            jettyConnectionTotal,
            unloadingFacilityTotal,
            pipelineInstallationTotal,
            MooringFacility : {
                mooringFacilitiesNumber: Number(req.body.mooringFacilitiesNumber),
                mooringFacilitiesSubTotals,
                mooringFacilitiesTotal
            },
            meteringTotal,
            ReceivingOthers: {
                receivingOthersNumber: Number(req.body.receivingOthersNumber),
                receivingOthersSubTotals,
                receivingOthersTotal
            },
            receivingTotal
        }

        let propaneStorageTankTotal = 0;
        let propaneStorageTankSubTotals = [];
        for (let i = 1; i <= Number(req.body.propaneStorageTankNumber); i++) {
            propaneStorageTankSubTotals.push(Number(req.body['propaneStorageTankTotal'+i]));
            propaneStorageTankTotal += Number(req.body['propaneStorageTankTotal'+i]);
        }
        let butaneStorageTankTotal = 0;
        let butaneStorageTankSubTotals = [];
        for (let i = 1; i <= Number(req.body.butaneStorageTankNumber); i++) {
            butaneStorageTankSubTotals.push(Number(req.body['butaneStorageTankTotal'+i]));
            butaneStorageTankTotal += Number(req.body['butaneStorageTankTotal'+i]);
        } 
        let mixedStorageTankTotal = 0;
        let mixedStorageTankSubTotals = [];
        for (let i = 1; i <= Number(req.body.mixedStorageTankNumber); i++) {
            mixedStorageTankSubTotals.push(Number(req.body['mixedStorageTankTotal'+i]));
            mixedStorageTankTotal += Number(req.body['mixedStorageTankTotal'+i]);
        } 
        const pipelineStorageTotal = Number(req.body.pipelineStorageTotal);
        let loadingPumpTotal = 0;
        let loadingPumpSubTotals = [];
        for (let i = 1; i <= Number(req.body.loadingPumpNumber); i++) {
            loadingPumpSubTotals.push(Number(req.body['loadingPumpTotal'+i]));
            loadingPumpTotal += Number(req.body['loadingPumpTotal'+i]);
        } 
        const heatExhargerTotal = Number(req.body.heatExhargerTotal);
        const boosterPumpTotal = Number(req.body.boosterPumpTotal);
        let storageOthersTotal = 0;
        let storageOthersSubTotals = [];
        for (let i = 1; i <= Number(req.body.storageOthersNumber); i++) {
            storageOthersSubTotals.push(Number(req.body['storageOthersTotal'+i]));
            storageOthersTotal += Number(req.body['storageOthersTotal'+i]);
        } 
        const storagesTotal = propaneStorageTankTotal+butaneStorageTankTotal+mixedStorageTankTotal+pipelineStorageTotal+loadingPumpTotal+heatExhargerTotal+boosterPumpTotal+storageOthersTotal;

        const Storage = {
            PropaneStorageTank: {
                propaneStorageTankNumber: Number(req.body.propaneStorageTankNumber),
                propaneStorageTankSubTotals,
                propaneStorageTankTotal
            },
            ButaneStorageTank: {
                butaneStorageTankNumber: Number(req.body.butaneStorageTankNumber),
                butaneStorageTankSubTotals,
                butaneStorageTankTotal
            },
            MixedStorageTank: {
                mixedStorageTankNumber: Number(req.body.mixedStorageTankNumber),
                mixedStorageTankSubTotals,
                mixedStorageTankTotal
            },
            pipelineStorageTotal,
            LoadingPump: {
                loadingPumpNumber: Number(req.body.loadingPumpNumber),
                loadingPumpSubTotals,
                loadingPumpTotal
            },
            heatExhargerTotal,
            boosterPumpTotal,
            StorageOthers : {
                storageOthersNumber: Number(req.body.storageOthersNumber),
                storageOthersSubTotals,
                storageOthersTotal
            }

        }

        const loadingSkidTotal = Number(req.body.loadingSkidTotal);
        const bufferTankTotal = Number(req.body.bufferTankTotal);
        const weightbridgeTotal = Number(req.body.weightbridgeTotal);
        const loadingBayTotal = Number(req.body.loadingBayTotal);
        let carouselFillingTotal = 0;
        let carouselFillingSubTotals = [];
        for (let i = 1; i <= Number(req.body.carouselFillingNumber); i++) {
            carouselFillingSubTotals.push(Number(req.body['carouselFillingTotal'+i]));
            carouselFillingTotal += Number(req.body['carouselFillingTotal'+i]);
        } 
        let fillingStationOthersTotal = 0;
        let fillingStationOthersSubTotals = [];
        for (let i = 1; i <= Number(req.body.fillingStationOthersNumber); i++) {
            fillingStationOthersSubTotals.push(Number(req.body['fillingStationOthersTotal'+i]));
            fillingStationOthersTotal += Number(req.body['fillingStationOthersTotal'+i]);
        } 
        const fillingStationTotal = loadingSkidTotal+bufferTankTotal+weightbridgeTotal+loadingBayTotal+carouselFillingTotal+fillingStationOthersTotal;

        const LPGFillingStation = {
            loadingSkidTotal,
            bufferTankTotal,
            weightbridgeTotal,
            loadingBayTotal,
            CarouselFilling: {
                carouselFillingNumber: Number(req.body.carouselFillingNumber),
                carouselFillingSubTotals,
                carouselFillingTotal
            },
            FillingStationOthers: {
                fillingStationOthersNumber: Number(req.body.fillingStationOthersNumber),
                fillingStationOthersSubTotals,
                fillingStationOthersTotal
            },
            fillingStationTotal
        }

        const terminalAutomationTotal = Number(req.body.terminalAutomationTotal);

        const ControlRoom = {
            terminalAutomationTotal
        }

        const fireWaterPumpTotal = Number(req.body.fireWaterPumpTotal);
        const fireHydrantsTotal = Number(req.body.fireHydrantsTotal);
        const fireExtinguisersTotal = Number(req.body.fireExtinguisersTotal);
        const fireGasDetectorTotal = Number(req.body.fireGasDetectorTotal);
        const fireSystemTotal = fireWaterPumpTotal+fireHydrantsTotal+fireExtinguisersTotal+fireGasDetectorTotal;

        const FirefightingSystem = {
            fireWaterPumpTotal,
            fireHydrantsTotal,
            fireExtinguisersTotal,
            fireGasDetectorTotal,
            fireSystemTotal,
        }

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

        const Utility = {
            flareTotal,
            instrumentAirTotal,
            emergencyPowerTotal,
            dieselOilPumpTotal,
            freshWaterPumpTotal,
            oilPumpTotal,
            dieselOilTankTotal,
            freshWaterTankTotal,
            oilTankTotal,
            utilityTotal,
        }

        const buildingTotal = Number(req.body.buildingTotal);
        const OfficeBuilding = {
            buildingTotal
        }
        const landRentTotal = Number(req.body.landRentTotal);
        const LandRent = {
            landRentTotal
        }
        
        const infrastructureCost = receivingTotal+storagesTotal+fillingStationTotal+terminalAutomationTotal+fireSystemTotal+utilityTotal+buildingTotal+landRentTotal;
        const taxPermit = Number(infrastructureCost * 25/100);
        const PMTFeed = Number(infrastructureCost * 5/100);
        const totalCapex = infrastructureCost+taxPermit+PMTFeed;
        const disposalPrice = Number((unloadingFacilityTotal+loadingPumpTotal+bufferTankTotal+weightbridgeTotal+carouselFillingTotal+emergencyPowerTotal) * (30/100)) ;
        
        const Capex = {
            infrastructureCost,
            taxPermit,
            PMTFeed,
            totalCapex,
            disposalPrice,
        }

        const opexStorageCapacity = Number(req.body.opexInput);
        const jettyRentCapacity = Number(req.body.jettyRentCapacity);
        const jettyRentUnloading = Number(req.body.jettyRentUnloading);
        const jettyRentCost = Number(req.body.jettyRentCost);
        const totalOpex = Number(req.body.opexResult);

        const Opex = {
            opexStorageCapacity,
            jettyRentCapacity,
            jettyRentUnloading,
            jettyRentCost,
            totalOpex,
        }

        const terminalName = req.body.terminalName;
        // const terminal = {terminalName,infrastructureCost,taxPermit,PMTFeed,totalCapex,disposalPrice,totalOpex};
        const ProjectID = req.body.ProjectID;

        const terminal = {
            terminalName,
            ProjectID,
            Receiving,
            Storage,
            LPGFillingStation,
            ControlRoom,
            FirefightingSystem,
            Utility,
            OfficeBuilding,
            LandRent,
            Capex,
            Opex
        }

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

const updateTerminal = async (req, res, next) => {
    try {
        let jettyTypeTotal = 0;
        let jettyTypeSubTotals = [];
        for (let i = 1; i <= Number(req.body.jettyTypeNumber); i++) {
            jettyTypeSubTotals.push(Number(req.body['jettyTypeTotal'+i]));
            jettyTypeTotal += Number(req.body['jettyTypeTotal'+i])
        }
        const jettyConnectionTotal = Number(req.body.jettyConnectionTotal);
        const unloadingFacilityTotal = Number(req.body.unloadingFacilityTotal);
        const pipelineInstallationTotal = Number(req.body.pipelineInstallationTotal);
        let mooringFacilitiesTotal = 0;
        let mooringFacilitiesSubTotals = [];
        for (let i = 1; i <= Number(req.body.mooringFacilitiesNumber); i++) {
            mooringFacilitiesSubTotals.push(Number(req.body['mooringFacilitiesTotal'+i]));
            mooringFacilitiesTotal += Number(req.body['mooringFacilitiesTotal'+i]);
        }
        const meteringTotal = Number(req.body.meteringTotal);
        let receivingOthersTotal = 0;
        let receivingOthersSubTotals = [];
        for (let i = 1; i <= Number(req.body.receivingOthersNumber); i++) {
            receivingOthersSubTotals.push(Number(req.body['receivingOthersTotal'+i]))
            receivingOthersTotal += Number(req.body['receivingOthersTotal'+i]);
            
        }
        const receivingTotal = jettyTypeTotal+jettyConnectionTotal+unloadingFacilityTotal+pipelineInstallationTotal+mooringFacilitiesTotal+meteringTotal+receivingOthersTotal;

        const Receiving = {
            JettyType: {
                jettyTypeNumber: Number(req.body.jettyTypeNumber),
                jettyTypeSubTotals,
                jettyTypeTotal
            },
            jettyConnectionTotal,
            unloadingFacilityTotal,
            pipelineInstallationTotal,
            MooringFacility : {
                mooringFacilitiesNumber: Number(req.body.mooringFacilitiesNumber),
                mooringFacilitiesSubTotals,
                mooringFacilitiesTotal
            },
            meteringTotal,
            ReceivingOthers: {
                receivingOthersNumber: Number(req.body.receivingOthersNumber),
                receivingOthersSubTotals,
                receivingOthersTotal
            },
            receivingTotal
        }

        let propaneStorageTankTotal = 0;
        let propaneStorageTankSubTotals = [];
        for (let i = 1; i <= Number(req.body.propaneStorageTankNumber); i++) {
            propaneStorageTankSubTotals.push(Number(req.body['propaneStorageTankTotal'+i]));
            propaneStorageTankTotal += Number(req.body['propaneStorageTankTotal'+i]);
        }
        let butaneStorageTankTotal = 0;
        let butaneStorageTankSubTotals = [];
        for (let i = 1; i <= Number(req.body.butaneStorageTankNumber); i++) {
            butaneStorageTankSubTotals.push(Number(req.body['butaneStorageTankTotal'+i]));
            butaneStorageTankTotal += Number(req.body['butaneStorageTankTotal'+i]);
        } 
        let mixedStorageTankTotal = 0;
        let mixedStorageTankSubTotals = [];
        for (let i = 1; i <= Number(req.body.mixedStorageTankNumber); i++) {
            mixedStorageTankSubTotals.push(Number(req.body['mixedStorageTankTotal'+i]));
            mixedStorageTankTotal += Number(req.body['mixedStorageTankTotal'+i]);
        } 
        const pipelineStorageTotal = Number(req.body.pipelineStorageTotal);
        let loadingPumpTotal = 0;
        let loadingPumpSubTotals = [];
        for (let i = 1; i <= Number(req.body.loadingPumpNumber); i++) {
            loadingPumpSubTotals.push(Number(req.body['loadingPumpTotal'+i]));
            loadingPumpTotal += Number(req.body['loadingPumpTotal'+i]);
        } 
        const heatExhargerTotal = Number(req.body.heatExhargerTotal);
        const boosterPumpTotal = Number(req.body.boosterPumpTotal);
        let storageOthersTotal = 0;
        let storageOthersSubTotals = [];
        for (let i = 1; i <= Number(req.body.storageOthersNumber); i++) {
            storageOthersSubTotals.push(Number(req.body['storageOthersTotal'+i]));
            storageOthersTotal += Number(req.body['storageOthersTotal'+i]);
        } 
        const storagesTotal = propaneStorageTankTotal+butaneStorageTankTotal+mixedStorageTankTotal+pipelineStorageTotal+loadingPumpTotal+heatExhargerTotal+boosterPumpTotal+storageOthersTotal;

        const Storage = {
            PropaneStorageTank: {
                propaneStorageTankNumber: Number(req.body.propaneStorageTankNumber),
                propaneStorageTankSubTotals,
                propaneStorageTankTotal
            },
            ButaneStorageTank: {
                butaneStorageTankNumber: Number(req.body.butaneStorageTankNumber),
                butaneStorageTankSubTotals,
                butaneStorageTankTotal
            },
            MixedStorageTank: {
                mixedStorageTankNumber: Number(req.body.mixedStorageTankNumber),
                mixedStorageTankSubTotals,
                mixedStorageTankTotal
            },
            pipelineStorageTotal,
            LoadingPump: {
                loadingPumpNumber: Number(req.body.loadingPumpNumber),
                loadingPumpSubTotals,
                loadingPumpTotal
            },
            heatExhargerTotal,
            boosterPumpTotal,
            StorageOthers : {
                storageOthersNumber: Number(req.body.storageOthersNumber),
                storageOthersSubTotals,
                storageOthersTotal
            }

        }

        const loadingSkidTotal = Number(req.body.loadingSkidTotal);
        const bufferTankTotal = Number(req.body.bufferTankTotal);
        const weightbridgeTotal = Number(req.body.weightbridgeTotal);
        const loadingBayTotal = Number(req.body.loadingBayTotal);
        let carouselFillingTotal = 0;
        let carouselFillingSubTotals = [];
        for (let i = 1; i <= Number(req.body.carouselFillingNumber); i++) {
            carouselFillingSubTotals.push(Number(req.body['carouselFillingTotal'+i]));
            carouselFillingTotal += Number(req.body['carouselFillingTotal'+i]);
        } 
        let fillingStationOthersTotal = 0;
        let fillingStationOthersSubTotals = [];
        for (let i = 1; i <= Number(req.body.fillingStationOthersNumber); i++) {
            fillingStationOthersSubTotals.push(Number(req.body['fillingStationOthersTotal'+i]));
            fillingStationOthersTotal += Number(req.body['fillingStationOthersTotal'+i]);
        } 
        const fillingStationTotal = loadingSkidTotal+bufferTankTotal+weightbridgeTotal+loadingBayTotal+carouselFillingTotal+fillingStationOthersTotal;

        const LPGFillingStation = {
            loadingSkidTotal,
            bufferTankTotal,
            weightbridgeTotal,
            loadingBayTotal,
            CarouselFilling: {
                carouselFillingNumber: Number(req.body.carouselFillingNumber),
                carouselFillingSubTotals,
                carouselFillingTotal
            },
            FillingStationOthers: {
                fillingStationOthersNumber: Number(req.body.fillingStationOthersNumber),
                fillingStationOthersSubTotals,
                fillingStationOthersTotal
            },
            fillingStationTotal
        }

        const terminalAutomationTotal = Number(req.body.terminalAutomationTotal);

        const ControlRoom = {
            terminalAutomationTotal
        }

        const fireWaterPumpTotal = Number(req.body.fireWaterPumpTotal);
        const fireHydrantsTotal = Number(req.body.fireHydrantsTotal);
        const fireExtinguisersTotal = Number(req.body.fireExtinguisersTotal);
        const fireGasDetectorTotal = Number(req.body.fireGasDetectorTotal);
        const fireSystemTotal = fireWaterPumpTotal+fireHydrantsTotal+fireExtinguisersTotal+fireGasDetectorTotal;

        const FirefightingSystem = {
            fireWaterPumpTotal,
            fireHydrantsTotal,
            fireExtinguisersTotal,
            fireGasDetectorTotal,
            fireSystemTotal,
        }

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

        const Utility = {
            flareTotal,
            instrumentAirTotal,
            emergencyPowerTotal,
            dieselOilPumpTotal,
            freshWaterPumpTotal,
            oilPumpTotal,
            dieselOilTankTotal,
            freshWaterTankTotal,
            oilTankTotal,
            utilityTotal,
        }

        const buildingTotal = Number(req.body.buildingTotal);
        const OfficeBuilding = {
            buildingTotal
        }
        const landRentTotal = Number(req.body.landRentTotal);
        const LandRent = {
            landRentTotal
        }
        
        const infrastructureCost = receivingTotal+storagesTotal+fillingStationTotal+terminalAutomationTotal+fireSystemTotal+utilityTotal+buildingTotal+landRentTotal;
        const taxPermit = Number(infrastructureCost * 25/100);
        const PMTFeed = Number(infrastructureCost * 5/100);
        const totalCapex = infrastructureCost+taxPermit+PMTFeed;
        const disposalPrice = Number((unloadingFacilityTotal+loadingPumpTotal+bufferTankTotal+weightbridgeTotal+carouselFillingTotal+emergencyPowerTotal) * (30/100)) ;
        
        const Capex = {
            infrastructureCost,
            taxPermit,
            PMTFeed,
            totalCapex,
            disposalPrice,
        }

        const opexStorageCapacity = Number(req.body.opexInput);
        const jettyRentCapacity = Number(req.body.jettyRentCapacity);
        const jettyRentUnloading = Number(req.body.jettyRentUnloading);
        const jettyRentCost = Number(req.body.jettyRentCost);
        const totalOpex = Number(req.body.opexResult);

        const Opex = {
            opexStorageCapacity,
            jettyRentCapacity,
            jettyRentUnloading,
            jettyRentCost,
            totalOpex,
        }

        const terminalName = req.body.terminalName;
        // const terminal = {terminalName,infrastructureCost,taxPermit,PMTFeed,totalCapex,disposalPrice,totalOpex};
        const ProjectID = req.body.ProjectID;

        const terminal = {
            terminalName,
            ProjectID,
            Receiving,
            Storage,
            LPGFillingStation,
            ControlRoom,
            FirefightingSystem,
            Utility,
            OfficeBuilding,
            LandRent,
            Capex,
            Opex
        }

        const terminalID = req.params.terminalID;

        await Terminal.updateOne(
            { _id: terminalID},
            {
                $set: terminal
            }
        );

        // const newTerminal = new Terminal(terminal);
        // await newTerminal.save();
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

        const disposalPrice = terminal.Capex.disposalPrice;

        const capexTotal = terminal.Capex.totalCapex;
        const opexTotal = terminal.Opex.totalOpex;

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
        const project = await Project.findOne({_id: ObjectID(req.params.projectID)});

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
            arrayDataInvest,
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

const editTerminalByID = async (req, res, next) => {
    try{
        const TerminalID = req.params.terminalID;
        const ProjectID = req.params.projectID;
        const project = await Project.findOne({_id: ObjectID(ProjectID)});
        const terminal = await Terminal.findOne({_id: ObjectID(TerminalID)});
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

        res.render('Terminal/capex-edit', {
            layout: 'layouts/main-layout',
            title: 'Form',
            terminal,
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
            loadingSkid,
            terminal
        });
    }
    catch(error){
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
                shipCapacityMT: transportation.Ship.shipCapacityMT,
                shipName: transportation.Ship.shipName,
                typeVoyage: transportation.TypeVoyage.name,
                typeFreight: transportation.TypeFreight.name,
                status: transportation.status
            }
            filteredTransportations.push(filteredTransportation);
        });

        const topic = await Topic.findOne({slug: "transportation"})
        const projects = await Project.find({topicID: topic._id, _id: {$ne: ProjectID}})

        res.render('Transportation/summary', {
            layout: 'layouts/main-layout',
            title: 'Summary LPG Transportation',
            filteredTransportations,
            project,
            topic,
            projects
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
        const project = await Project.findOne({_id: ObjectID(ProjectID)});
        if(!project){
            throw "project not found!";
        }

        console.log(ProjectID)
        res.render('Transportation/form-ship', {
            layout: 'layouts/main-layout',
            title: 'Form LPG Transportation',
            typeVoyages,
            typeFreights,
            ProjectID,
            projectName: project.name
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
        const project = await Project.findOne({_id: ObjectID(ProjectID)});
        if(!project){
            throw "project not found!";
        }
        let form = 'Transportation/form-ship';
        if(req.params.typeFreightSlug === 'barge' && req.params.typeVoyageSlug === 'single_trip'){
            form = 'Transportation/form-barge';
        }
        res.render(form, {
            layout: 'layouts/main-layout',
            title: 'Form LPG Transportation',
            typeVoyages,
            typeFreights,
            typeFreight,
            typeVoyage,
            ProjectID,
            currentYear: new Date().getFullYear(),
            CBMtoMT : convertToFloat(unitConversion[0].CBMtoMT),
            crewDatas,
            projectName: project.name
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
        transportation.status = 0;

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

        if(req.params.typeFreightSlug === 'barge' && req.params.typeVoyageSlug === 'single_trip'){
            let tugboat = {
                shipName: req.body.shipName_tugboat,
                typeVessel: req.body.typeVessel_tugboat,
                IMONumber: req.body.IMONumber_tugboat,
                MMSINumber: req.body.MMSINumber_tugboat,
                callSign: req.body.callSign_tugboat,
                grossTonnage: req.body.grossTonnage_tugboat,
                summerDWT: req.body.summerDWT_tugboat,
                lengthOverall: req.body.lengthOverall_tugboat,
                yearBuilt: req.body.yearBuilt_tugboat,
                shipAge: req.body.shipAge_tugboat,
                crewNumber: req.body.crewNumber_tugboat,
                SFOC: req.body.SFOC_tugboat,
            }
            transportation.Tugboat = tugboat;
        }

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
        let enterWaitTimePOL = 1;

        let pumpDischargeRate = [];
        let numberOfCargoTank = req.body.numberOfCargoTank;
        if(transportation.TypeFreight.slug === 'barge' && transportation.TypeVoyage.slug === 'single_trip'){
            numberOfCargoTank = 1;
        }
        for (let i = 1; i <= numberOfCargoTank; i++) {
            pumpDischargeRate.push(req.body['pumpDischargeRate'+i]);
        }
        let sumDischargeRate = 0;
        for (let i = 0; i < req.body.numberOfCargoTank; i++) {
            if(transportation.TypeFreight.slug === 'barge' && transportation.TypeVoyage.slug === 'single_trip'){
                sumDischargeRate += Number(Number(shipCargoTankOperationalCapacity.cargoTankOp[i])/Number(pumpDischargeRate[0]));
            }
            else{
                sumDischargeRate += Number(Number(shipCargoTankOperationalCapacity.cargoTankOp[i])/Number(pumpDischargeRate[i]));
            }
        }
        const totalDischargeTime = sumDischargeRate/24;
        let enterWaitTimePOD = 1;
        if(transportation.TypeFreight.slug === 'barge' && transportation.TypeVoyage.slug === 'single_trip'){
            enterWaitTimePOD = 0;
            enterWaitTimePOL = 0;
        }
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
        const bunkerPriceIDRMFO = 0;
        const bunkerPriceIDRMDO = 0;
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
        if(req.params.typeFreightSlug === 'barge' && req.params.typeVoyageSlug === 'single_trip'){
            const barge = {
                bargeLoadingMaster: req.body.bargeLoadingMaster,
                bargeBoatswain: req.body.bargeBoatswain
            }
            crewCost.Barge = barge;
            crewCost.totalCrewCostMonth += (Number(barge.bargeLoadingMaster) + Number(barge.bargeBoatswain));
            crewCost.totalCrewCostYear = crewCost.totalCrewCostMonth * 13;
        }
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
        // const unitCostMassCargo_USD_KG_NM = unitCostMassCargo_USD_KG / (turnAroundVoyage.numberRoundTripYear*voyage.distance*2);
        const unitCostMassCargo_USD_KG_NM = unitCostMassCargo_USD_KG / (voyage.distance*2);
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
        // console.log(transportation.ProposedFreight)
        console.log(transportation.BunkeringCalculation)
        const newTransportation = new Transportation(transportation);
        await newTransportation.save();
        res.redirect(`/project/${req.body.ProjectID}/form/${newTransportation._id}/bunker-price-sensitivity`);
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
        const project = await Project.findOne({_id: ObjectID(ProjectID)});
        if(!project){
            throw "project not found!";
        }
        let form = 'Transportation/form-ship-edit';
        if(transportation.TypeFreight.slug === 'barge' && transportation.TypeVoyage.slug === 'single_trip'){
            form = 'Transportation/form-barge-edit';
        }
        res.render(form, {
            layout: 'layouts/main-layout',
            title: 'Edit Form LPG Transportation',
            transportation,
            currentYear: new Date().getFullYear(),
            CBMtoMT : convertToFloat(unitConversion[0].CBMtoMT),
            crewDatas,
            ProjectID,
            projectName: project.name,
            transportationName: transportation.Ship.shipName
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
        const transportationID = req.body.TransportationID;
        const transportationDB = await Transportation.findOne({_id: ObjectID(transportationID)});
        if(!transportationDB){
            throw "Transportation not found!"
        }
        if(transportationDB.bunkerPriceSensitivityID){
            const bunkerPriceSensitivity = await BunkerPriceSensitivity.findOne({_id: ObjectID(transportationDB.bunkerPriceSensitivityID)});
            if(!bunkerPriceSensitivity){
                throw "Bunker not found!"
            }
            await BunkerPriceSensitivity.deleteOne({_id : ObjectID(transportationDB.bunkerPriceSensitivityID)});
        }
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

        if(transportation.TypeFreight.slug === 'barge' && transportation.TypeVoyage.slug === 'single_trip'){
            let tugboat = {
                shipName: req.body.shipName_tugboat,
                typeVessel: req.body.typeVessel_tugboat,
                IMONumber: req.body.IMONumber_tugboat,
                MMSINumber: req.body.MMSINumber_tugboat,
                callSign: req.body.callSign_tugboat,
                grossTonnage: req.body.grossTonnage_tugboat,
                summerDWT: req.body.summerDWT_tugboat,
                lengthOverall: req.body.lengthOverall_tugboat,
                yearBuilt: req.body.yearBuilt_tugboat,
                shipAge: req.body.shipAge_tugboat,
                crewNumber: req.body.crewNumber_tugboat,
                SFOC: req.body.SFOC_tugboat,
            }
            transportation.Tugboat = tugboat;
        }

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
        let enterWaitTimePOL = 1;

        let pumpDischargeRate = [];
        let numberOfCargoTank = req.body.numberOfCargoTank;
        if(transportation.TypeFreight.slug === 'barge' && transportation.TypeVoyage.slug === 'single_trip'){
            numberOfCargoTank = 1;
        }
        for (let i = 1; i <= numberOfCargoTank; i++) {
            pumpDischargeRate.push(req.body['pumpDischargeRate'+i]);
        }
        let sumDischargeRate = 0;
        for (let i = 0; i < req.body.numberOfCargoTank; i++) {
            if(transportation.TypeFreight.slug === 'barge' && transportation.TypeVoyage.slug === 'single_trip'){
                sumDischargeRate += Number(Number(shipCargoTankOperationalCapacity.cargoTankOp[i])/Number(pumpDischargeRate[0]));
            }
            else{
                sumDischargeRate += Number(Number(shipCargoTankOperationalCapacity.cargoTankOp[i])/Number(pumpDischargeRate[i]));
            }
        }
        const totalDischargeTime = sumDischargeRate/24;
        let enterWaitTimePOD = 1;
        if(transportation.TypeFreight.slug === 'barge' && transportation.TypeVoyage.slug === 'single_trip'){
            enterWaitTimePOD = 0;
            enterWaitTimePOL = 0;
        }

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
        const bunkerPriceIDRMFO = 0;
        const bunkerPriceIDRMDO = 0;
        const bunkerPriceIDRMGO = 0;
        console.log(portIdleMDO)
        console.log(portWorkingMDO)
        console.log(atSeaMDO)
        // const bunkerPriceIDRMFO = Number(req.body.bunkerPriceIDRMFO);
        // const bunkerPriceIDRMDO = Number(req.body.bunkerPriceIDRMDO);
        // const bunkerPriceIDRMGO = Number(req.body.bunkerPriceIDRMGO);
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
        if(transportation.TypeFreight.slug === 'barge' && transportation.TypeVoyage.slug === 'single_trip'){
            const barge = {
                bargeLoadingMaster: req.body.bargeLoadingMaster,
                bargeBoatswain: req.body.bargeBoatswain
            }
            crewCost.Barge = barge;
            crewCost.totalCrewCostMonth += (Number(barge.bargeLoadingMaster) + Number(barge.bargeBoatswain));
            crewCost.totalCrewCostYear = crewCost.totalCrewCostMonth * 13;
        }
        transportation.CrewCost = crewCost;
        console.log(totalCrewCostYear);

        //PORT COST
        const portChargesRoundTrip = Number(req.body.portChargesRoundTrip);
        const totalPortChargesYear = portChargesRoundTrip * turnAroundVoyage.numberRoundTripYear;
        const portCost = {portChargesRoundTrip, totalPortChargesYear};
        transportation.PortCost = portCost;
        console.log(totalPortChargesYear);

        //CARGO HANDLING COST
        const lasingUnlasPOLTrip = Number(req.body.lasingUnlasPOLTrip);
        const lasingUnlasPODTrip = Number(req.body.lasingUnlasPODTrip);
        const totalCargoHandlingCostYear = (lasingUnlasPOLTrip*turnAroundVoyage.numberRoundTripYear)+(lasingUnlasPODTrip*turnAroundVoyage.numberRoundTripYear);
        const cargoHandlingCost = {lasingUnlasPOLTrip, lasingUnlasPODTrip, totalCargoHandlingCostYear};
        transportation.CargoHandlingCost = cargoHandlingCost;
        console.log(totalCargoHandlingCostYear);

        //VesselCharterCost
        const charterRateDay = Number(req.body.charterRateDay);
        const totalCharterRateYear = charterRateDay*turnAroundVoyage.calendarDaysYear;
        const vesselCharterCost = {charterRateDay, totalCharterRateYear};
        transportation.VesselCharterCost = vesselCharterCost;
        console.log(totalCharterRateYear);

        //InsuranceCost
        const shipInsurance = Number(req.body.shipInsurance);
        const crewInsurance = Number(req.body.crewInsurance);
        const totalInsuranceCostYear = shipInsurance + crewInsurance;
        const insuranceCost = {shipInsurance, crewInsurance, totalInsuranceCostYear};
        transportation.InsuranceCost = insuranceCost;
        console.log(totalInsuranceCostYear);

        //DockingRepairMaintenanceCost
        const dockingCost = Number(req.body.dockingCost);
        const repairStoreCost = Number(req.body.repairStoreCost);
        const lubeOilCost = Number(req.body.lubeOilCost);
        const totalDockingRepairMaintenanceCost = dockingCost+repairStoreCost+lubeOilCost;
        const dockingRepairMaintenanceCost = {dockingCost, repairStoreCost, lubeOilCost, totalDockingRepairMaintenanceCost};
        transportation.DockingRepairMaintenanceCost = dockingRepairMaintenanceCost;
        console.log(totalDockingRepairMaintenanceCost);

        //OtherCost
        const victually = Number(req.body.victually);
        const administrationCost = Number(req.body.administrationCost);
        const totalOtherCost = victually + administrationCost;
        const otherCost = {victually, administrationCost, totalOtherCost};
        transportation.OtherCost = otherCost;
        console.log(totalOtherCost);

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
        // const unitCostMassCargo_USD_KG_NM = unitCostMassCargo_USD_KG / (turnAroundVoyage.numberRoundTripYear*voyage.distance*2);
        const unitCostMassCargo_USD_KG_NM = unitCostMassCargo_USD_KG / (voyage.distance*2);
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
        transportation.status = 0;

        // console.log(transportation.BunkeringCalculation)
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

const transferTransportation = async (req, res, next) => {
    try {
        const {projectID, transportationID, transferProjectID} = req.body
        const transportation = await Transportation.findOne({_id: ObjectID(transportationID)})
        if(!transportation) throw 'Transportation not found!'
        const anotherProject = await Project.findOne({_id: ObjectID(transferProjectID)})
        if(!anotherProject) throw 'Route not found!'
        await Transportation.updateOne(
            { _id: transportationID},
            {
                $set: {
                    ProjectID: transferProjectID
                }
            }
        );
        res.redirect(`/project/${projectID}/transportation`);
    } catch (error) {
        res.render('error', {
            layout: 'layouts/main-layout',
            message: error,
            status: 400
        });
    }
}

const getFormTransportationBunkerPriceSensitivity = async (req, res, next) => {
    try{
        const transportationID = req.params.transportationID;
        const projectID = req.params.projectID;
        const project = await Project.findOne({_id: ObjectID(projectID)});
        if(!project){
            throw "project not found!";
        }
        res.render('Transportation/form-bunker-price-sensitivity', {
            layout: 'layouts/main-layout',
            title: 'Form Bunker Price Sensitivity',
            transportationID,
            projectID,
            projectName: project.name
        })
    }
    catch(error){
        res.render('error', {
            layout: 'layouts/main-layout',
            message: error,
            status: 400
        });
    }
}

const updateTransportationBunkerPriceSensitivity = async (transportation2, bunkerPrice) => {
    try {
        let transportation = await JSON.parse(JSON.stringify(transportation2));
        const unitConversion = await UnitConversion.find();
        //BUNKERING CALCULATION
        const portIdleMFO = Number(transportation.BunkeringCalculation.portIdleMFO.$numberDecimal);
        const portIdleMDO = Number(transportation.BunkeringCalculation.portIdleMDO.$numberDecimal);
        const portIdleMGO = Number(transportation.BunkeringCalculation.portIdleMGO.$numberDecimal);
        const portWorkingMFO = Number(transportation.BunkeringCalculation.portWorkingMFO.$numberDecimal);
        const portWorkingMDO = Number(transportation.BunkeringCalculation.portWorkingMDO.$numberDecimal);
        const portWorkingMGO = Number(transportation.BunkeringCalculation.portWorkingMGO.$numberDecimal);
        const atSeaMFO = Number(transportation.BunkeringCalculation.atSeaMFO.$numberDecimal);
        const atSeaMDO = Number(transportation.BunkeringCalculation.atSeaMDO.$numberDecimal);
        const atSeaMGO = Number(transportation.BunkeringCalculation.atSeaMGO.$numberDecimal);
        const bunkerPriceIDRMFO = Number(transportation.BunkeringCalculation.bunkerPriceIDRMFO.$numberDecimal);
        const bunkerPriceIDRMDO = Number(bunkerPrice);
        const bunkerPriceIDRMGO = Number(transportation.BunkeringCalculation.bunkerPriceIDRMGO.$numberDecimal);
        const bunkerConsumeTripMFO = (Number(transportation.TurnAroundVoyage.totalTurnRoundTime.$numberDecimal)*atSeaMFO) + ((Number(transportation.TurnAroundVoyage.totalLoadingTime.$numberDecimal)+Number(transportation.TurnAroundVoyage.totalDischargeTime.$numberDecimal))*portWorkingMFO) + ((Number(transportation.TurnAroundVoyage.enterWaitTimePOD.$numberDecimal)+Number(transportation.TurnAroundVoyage.enterWaitTimePOL.$numberDecimal))*portIdleMFO);
        const bunkerConsumeTripMDO = (Number(transportation.TurnAroundVoyage.totalTurnRoundTime.$numberDecimal)*atSeaMDO) + ((Number(transportation.TurnAroundVoyage.totalLoadingTime.$numberDecimal)+Number(transportation.TurnAroundVoyage.totalDischargeTime.$numberDecimal))*portWorkingMDO) + ((Number(transportation.TurnAroundVoyage.enterWaitTimePOD.$numberDecimal)+Number(transportation.TurnAroundVoyage.enterWaitTimePOL.$numberDecimal))*portIdleMDO);
        const bunkerConsumeTripMGO = (Number(transportation.TurnAroundVoyage.totalTurnRoundTime.$numberDecimal)*atSeaMGO) + ((Number(transportation.TurnAroundVoyage.totalLoadingTime.$numberDecimal)+Number(transportation.TurnAroundVoyage.totalDischargeTime.$numberDecimal))*portWorkingMGO) + ((Number(transportation.TurnAroundVoyage.enterWaitTimePOD.$numberDecimal)+Number(transportation.TurnAroundVoyage.enterWaitTimePOL.$numberDecimal))*portIdleMGO);
        const bunkerConsumeYearMFO = bunkerConsumeTripMFO*Number(transportation.TurnAroundVoyage.numberRoundTripYear.$numberDecimal);
        const bunkerConsumeYearMDO = bunkerConsumeTripMDO*Number(transportation.TurnAroundVoyage.numberRoundTripYear.$numberDecimal);
        const bunkerConsumeYearMGO = bunkerConsumeTripMGO*Number(transportation.TurnAroundVoyage.numberRoundTripYear.$numberDecimal);
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
       
        
        //TotalCost
        const tax = Number(transportation.TotalCost.tax.$numberDecimal)
        const totalCostBeforeTax = 
            (bunkeringCalculation.totalBunkerCostYearUSD
                +Number(transportation.CrewCost.totalCrewCostYear.$numberDecimal)
                +Number(transportation.PortCost.totalPortChargesYear.$numberDecimal)
                +Number(transportation.CargoHandlingCost.lasingUnlasPOLTrip.$numberDecimal)
                +Number(transportation.VesselCharterCost.totalCharterRateYear.$numberDecimal)
                +Number(transportation.InsuranceCost.totalInsuranceCostYear.$numberDecimal)
                +Number(transportation.DockingRepairMaintenanceCost.totalDockingRepairMaintenanceCost.$numberDecimal)
                +Number(transportation.OtherCost.totalOtherCost.$numberDecimal));
        const totalTax = totalCostBeforeTax * (tax/100);
        const totalCostAfterTax = totalCostBeforeTax + totalTax;
        const totalCost = {totalCostBeforeTax, totalCostAfterTax, totalTax, tax};
        transportation.TotalCost = totalCost;
        
        //RealFreightRate
        const unitCostMassCargo_USD_KG = (totalCost.totalCostAfterTax/Number(transportation.TurnAroundVoyage.totalCargoCarryCapacityYearKG.$numberDecimal));
        const unitCostMassCargo_USD_MT = unitCostMassCargo_USD_KG*1000;
        const unitCostMassCargo_IDR_KG = unitCostMassCargo_USD_KG * convertToFloat(unitConversion[0].USDtoIDR);
        const unitCostMassCargo_IDR_MT = unitCostMassCargo_IDR_KG*1000;
        const unitCost_USD_MMBTU = (totalCost.totalCostAfterTax/Number(transportation.TurnAroundVoyage.totalCargoCarryCapacityYearMMBTU.$numberDecimal));
        const unitCost_USD_MMBTU_NM = unitCost_USD_MMBTU/(Number(transportation.TurnAroundVoyage.numberRoundTripYear.$numberDecimal)*Number(transportation.Voyage.distance.$numberDecimal)*2);
        // const unitCostMassCargo_USD_KG_NM = unitCostMassCargo_USD_KG / (turnAroundVoyage.numberRoundTripYear*voyage.distance*2);
        const unitCostMassCargo_USD_KG_NM = unitCostMassCargo_USD_KG / (Number(transportation.Voyage.distance.$numberDecimal)*2);
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
        const revenue = proposedFreight_USD_KG_NM* Number(transportation.TurnAroundVoyage.totalCargoCarryCapacityYearKG.$numberDecimal)*Number(transportation.Voyage.distance.$numberDecimal)*2;
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

        const costShipAges = await CostShipAge.find().sort({"constantFactor": -1});
        const freightCostShipAges = [];
        costShipAges.forEach(costShipAge => {
            const result = (proposedFreight_IDR_MT * Number(costShipAge.constantFactor/100))+proposedFreight_IDR_MT;
            const freightCostShipAge = {
                shipAge: costShipAge.shipAge,
                constantFactor: costShipAge.constantFactor,
                feeOnShipAge_IDR_MT: result
            };
            freightCostShipAges.push(freightCostShipAge);
        });
        transportation.freightCostShipAges = freightCostShipAges;

        return transportation;
    } catch (error) {
        console.log(error)
    }
}

const generateAutoTransportation = async (bunkerPriceSensitivity, transportation) => {

    try{
        const {start, end, interval} = bunkerPriceSensitivity;
        let bunkerPrices = [];
        for (let i = start; i <= end; i+=interval) {
            bunkerPrices.push(i)
        }
        let promises = [];
        bunkerPrices.forEach(bunkerPrice => {
            promises.push(updateTransportationBunkerPriceSensitivity(transportation, bunkerPrice));
        });

        const transportationBunkerPriceSensitivitys = await Promise.all(promises);
        return transportationBunkerPriceSensitivitys;
    }
    catch(error){
        console.log(error)
    }

}


const getSummaryTransportationBunkerPriceSensitivity = async (req, res, next) => {
    try {
        const projectID = req.params.projectID;
        const transportationID = req.params.transportationID;
        const project = await Project.findOne({_id: ObjectID(projectID)});
        if(!project){
            throw "project not found!";
        }
        const transportation = await Transportation.findOne({_id: ObjectID(transportationID)});
        if(!transportation){
            throw "transportation not found!";
        }

        const bunkerPriceSensitivityID = transportation.bunkerPriceSensitivityID;
        const bunkerPriceSensitivity = await BunkerPriceSensitivity.findOne({_id: bunkerPriceSensitivityID});
        if(!bunkerPriceSensitivity){
            throw "Bunker not found!";
        }

        const transportationBunkerPriceSensitivitys = await generateAutoTransportation(bunkerPriceSensitivity, transportation);
        
        // transportationBunkerPriceSensitivitys.forEach(newTrans => {
        //     console.log(convertToFloat(newTrans.BunkeringCalculation.totalBunkerCostTripIDR));
        // });

        // for (let index = 0; index < transportationBunkerPriceSensitivitys.length; index++) {
        //     const transportation = transportationBunkerPriceSensitivitys[index];
        //     console.log(convertToFloat(transportation.OtherCost.totalOtherCost));
        //     console.log(convertToFloat(transportation.DockingRepairMaintenanceCost.totalDockingRepairMaintenanceCost));
        //     console.log(convertToFloat(transportation.InsuranceCost.totalInsuranceCostYear));
        //     console.log(convertToFloat(transportation.VesselCharterCost.totalCharterRateYear));
        //     console.log(convertToFloat(transportation.CargoHandlingCost.totalCargoHandlingCostYear));
        //     console.log(convertToFloat(transportation.CrewCost.totalCrewCostYear));
        //     console.log(convertToFloat(transportation.BunkeringCalculation.totalBunkerCostYearUSD))
        //     break
        // }

        res.render('Transportation/summary-transportation',{
            layout: 'layouts/main-layout',
            transportationBunkerPriceSensitivitys,
            project,
            title: 'Bunker Price Sensitivity'
        })
    } catch (error) {
        res.render('error', {
            layout: 'layouts/main-layout',
            message: error,
            status: 400
        });
    }
}

const createTransportationBunkerPriceSensitivity = async (req, res, next) => {
    try{
        const projectID = req.params.projectID;
        const transportationID = req.params.transportationID;
        const transportation = await Transportation.findOne({_id: ObjectID(transportationID)});
        if(!transportation){
            throw 'Transportation not found!';
        }
        const {startBunkerPrice, endBunkerPrice, intervalBunkerPrice} = req.body;
        const bunkerPriceSensitivity = {
            start: startBunkerPrice,
            end: endBunkerPrice,
            interval: intervalBunkerPrice,
            transportationID
        };
        const newBunkerPriceSensitivity = new BunkerPriceSensitivity(bunkerPriceSensitivity);
        await newBunkerPriceSensitivity.save();
        transportation.status = 1;
        transportation.bunkerPriceSensitivityID = newBunkerPriceSensitivity._id;
        await Transportation.updateOne(
            { _id: transportationID},
            {
                $set: transportation
            }
        );
        res.redirect(`/project/${projectID}/transportation/${transportationID}/summary`);
    }
    catch(error){
        res.render('error', {
            layout: 'layouts/main-layout',
            message: error,
            status: 400
        });
    }
}

const createCostShipAge = async (req, res, next) => {
    try{
        const costShipAges = [
            {
                shipAge: '0-5',
                constantFactor: 12.28
            },
            {
                shipAge: '6-10',
                constantFactor: 4.42
            },
            {
                shipAge: '11-15',
                constantFactor: 3.29
            },
            {
                shipAge: '16-20',
                constantFactor: -3.29
            },
            {
                shipAge: '21-25',
                constantFactor: -4.42
            },
            {
                shipAge: '26-30',
                constantFactor: -12.28
            },
        ];

        const result = await CostShipAge.insertMany(costShipAges);
        if(result){
            res.send({success: true});
        }
        
    }
    catch(err){

    }
}

const createCustom = async (req, res, next) => {
    try{
        const data = {
            name: "Putu Bagus Kertha Segara",
            project: [
                {
                    name: 'Pertamina',
                    job: 'Fullstack Dev'
                },
                {
                    name: 'Kemenkes',
                    jon: 'Expore Data'
                },
                {
                    name: 'Ptrokimia',
                    jon: 'Model Bisnis'
                },
            ],
            hobi: 'Coding'
        }

        const newData = new TypeCustom({data});
        const result = await newData.save()
        res.send(result)
    }
    catch(error){

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
    duplicateTerminalByID,
    getFormTransportationBunkerPriceSensitivity,
    createTransportationBunkerPriceSensitivity,
    getSummaryTransportationBunkerPriceSensitivity,
    createCostShipAge,
    createCustom,
    editTerminalByID,
    updateTerminal,
    transferTransportation
}