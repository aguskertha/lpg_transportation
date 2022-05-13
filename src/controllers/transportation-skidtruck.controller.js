const ObjectID = require('mongodb').ObjectId;
const Project = require('./../models/project.model')
const TransSkidTruck = require('./../models/trans-skid-truck.model');

const cases = [
    {
        name: 'Case 1',
        slug: 'case-1'
    },
    {
        name: 'Case 2',
        slug: 'case-2'
    },
];

const unitConversion = {
    MTtoKG : 1000,
    KGtoMMBTU : 0.046452,
    CBMtoMT: 0.56274620146314,
    KMtoMILE: 0.6214,
    KMtoNauticalMILE: 0.5399,
    USDtoRP: 14500
}

const getProjectSkidTruckByID = async (req, res, next) => {
    try {
        const ProjectID = req.params.projectID;
        const project = await Project.findOne({_id : ObjectID(ProjectID)});
        const transSkidTrucks = await TransSkidTruck.find();

        res.render('SkidTruck/summary', {
            layout: 'layouts/main-layout',
            title: 'Summary LPG Transportation + Skid Truck',
            project,
            transSkidTrucks
        });
    } catch (error) {
        res.render('error', {
            layout: 'layouts/main-layout',
            message: error,
            status: 400
        });
    }
}

const getFormSkidTruck = async (req, res, next) => {
    try{
        const ProjectID = req.params.projectID;
        const project = await Project.findOne({_id: ObjectID(ProjectID)});
        if(!project){
            throw "project not found!";
        }

        res.render('SkidTruck/form', {
            layout: 'layouts/main-layout',
            title: 'Form LPG Transportation',
            cases,
            ProjectID,
            projectName: project.name
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

const getFormSkidTruckByCase = async (req, res, next) => {
    try{
        const typeCaseSlug = req.params.typeCase;
        const ProjectID = req.params.projectID;
        const project = await Project.findOne({_id: ObjectID(ProjectID)});
        if(!project){
            throw "project not found!";
        }
        const typeCase = cases.find(item => item.slug == typeCaseSlug)

        res.render('SkidTruck/form', {
            layout: 'layouts/main-layout',
            title: 'Form LPG Transportation + SkidTruck',
            cases,
            unitConversion,
            typeCase,
            ProjectID,
            projectName: project.name
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

const createTransportationSkidTruck = async (req, res, next) => {
    try {
        const ProjectID = req.params.projectID;
        const DistributionArea = {
            distArea: req.body.distArea,
            distOrigin: req.body.distOrigin,
            distDestination: req.body.distDestination
        }

        const SkidTruck = {
            skidTruckCargoCapacity: Number(req.body.skidTruckCargoCapacity),
            skidTruckHeadSpec: req.body.skidTruckHeadSpec,
            skidTruckSpeed: Number(req.body.skidTruckSpeed),
            skidTruckFuelConsume: Number(req.body.skidTruckFuelConsume),
        }
        
        const BasisData = {
            basisDataLPGPriceUSD: Number(req.body.basisDataLPGPriceUSD),
            basisDataLPGPriceRp: Number(req.body.basisDataLPGPriceRp),
            basisDataLPGPriceRpKg: Number(req.body.basisDataLPGPriceRpKg),
            basisDataSolarPrice: Number(req.body.basisDataSolarPrice),
            basisDataRentalPriceMonth: Number(req.body.basisDataRentalPriceMonth),
            basisDataRentalPriceDay: Number(req.body.basisDataRentalPriceDay),
            basisDataDriverSalaryMonth: Number(req.body.basisDataDriverSalaryMonth),
            basisDataDriverSalaryDay: Number(req.body.basisDataDriverSalaryDay),
            basisDataAssistDriverSalaryMonth: Number(req.body.basisDataAssistDriverSalaryMonth),
            basisDataAssistDriverSalaryDay: Number(req.body.basisDataAssistDriverSalaryDay),
            basisDataMisEtc: Number(req.body.basisDataMisEtc),
            basisDataLCTRate: Number(req.body.basisDataLCTRate),
            basisDataLCTRateEtc: Number(req.body.basisDataLCTRateEtc),
            basisDataTotalCost: Number(req.body.basisDataTotalCost),
            basisDataRiskFactor: Number(req.body.basisDataRiskFactor),
        }
        
        const DeliveryData = {
            deliveryDataOriginLPG: req.body.deliveryDataOriginLPG,
            deliveryDataOriginPort: req.body.deliveryDataOriginPort,
            deliveryDataDestinationPort: req.body.deliveryDataDestinationPort,
            deliveryDataDestinationSPBE: req.body.deliveryDataDestinationSPBE,
            deliveryDataDistanceTruckingOriginKM: Number(req.body.deliveryDataDistanceTruckingOriginKM),
            deliveryDataDistanceTruckingOriginMile: Number(req.body.deliveryDataDistanceTruckingOriginMile),
            deliveryDataDistanceSailFerryPortKM: Number(req.body.deliveryDataDistanceSailFerryPortKM),
            deliveryDataDistanceSailFerryPortMile: Number(req.body.deliveryDataDistanceSailFerryPortMile),
            deliveryDataDistanceTruckingPortSpbeKM: Number(req.body.deliveryDataDistanceTruckingPortSpbeKM),
            deliveryDataDistanceTruckingPortSpbeMile: Number(req.body.deliveryDataDistanceTruckingPortSpbeMile),
            deliveryDataTotalDistance: Number(req.body.deliveryDataTotalDistance),
            deliveryDataLPGLoadUnload: Number(req.body.deliveryDataLPGLoadUnload),
            deliveryDataRoundTripSailling: Number(req.body.deliveryDataRoundTripSailling),
            deliveryDataNumberTrucking: Number(req.body.deliveryDataNumberTrucking),
        }
        DeliveryData.deliveryDataRoundTripTrucking = ((DeliveryData.deliveryDataDistanceTruckingOriginKM + DeliveryData.deliveryDataDistanceTruckingPortSpbeKM) / SkidTruck.skidTruckSpeed ) * BasisData.basisDataRiskFactor * 2;
        DeliveryData.deliveryDataTotalRoundTrip = (2 * DeliveryData.deliveryDataLPGLoadUnload * DeliveryData.deliveryDataNumberTrucking) + DeliveryData.deliveryDataRoundTripSailling + DeliveryData.deliveryDataRoundTripTrucking;
        DeliveryData.deliveryDataTotalCargoDelivery = (DeliveryData.deliveryDataNumberTrucking * SkidTruck.skidTruckCargoCapacity);
        DeliveryData.deliveryDataNumberTripYear = (90/100*365*24)/DeliveryData.deliveryDataTotalRoundTrip;
        DeliveryData.deliveryDataTotalCargoYearMT = (DeliveryData.deliveryDataTotalCargoDelivery * DeliveryData.deliveryDataNumberTripYear);
        DeliveryData.deliveryDataTotalCargoYearKG = DeliveryData.deliveryDataTotalCargoYearMT * unitConversion.MTtoKG;
        DeliveryData.deliveryDataTotalCargoYearMMBTU = DeliveryData.deliveryDataTotalCargoYearKG * unitConversion.KGtoMMBTU;

        const CostComponent = {
            truckSkidCost : (BasisData.basisDataRentalPriceDay * DeliveryData.deliveryDataNumberTrucking * 365),
            truckFuelCost: (SkidTruck.skidTruckFuelConsume * BasisData.basisDataSolarPrice * DeliveryData.deliveryDataNumberTripYear * DeliveryData.deliveryDataRoundTripTrucking * DeliveryData.deliveryDataNumberTrucking),
            truckDriverCost: (365 * (BasisData.basisDataDriverSalaryDay + BasisData.basisDataAssistDriverSalaryDay) * DeliveryData.deliveryDataNumberTrucking),
            tollCost: 0,
            MiscCostTrucking: (BasisData.basisDataMisEtc * DeliveryData.deliveryDataNumberTrucking * DeliveryData.deliveryDataNumberTripYear),
            ferryCost: (2 * BasisData.basisDataTotalCost) * DeliveryData.deliveryDataNumberTrucking * DeliveryData.deliveryDataNumberTripYear,

            cargoInsurance: (0.05/100 * BasisData.basisDataLPGPriceRp * SkidTruck.skidTruckCargoCapacity * DeliveryData.deliveryDataNumberTrucking * DeliveryData.deliveryDataNumberTripYear),
            truckLicenseSertifCost: (32000 * DeliveryData.deliveryDataNumberTrucking * 365),
            maintenanceCost: (65000 * DeliveryData.deliveryDataNumberTrucking * 365),
        }
        CostComponent.deliveryCost = (CostComponent.truckSkidCost + CostComponent.truckFuelCost + CostComponent.truckDriverCost + CostComponent.tollCost +CostComponent.MiscCostTrucking + CostComponent.ferryCost)
        CostComponent.otherCost = (CostComponent.cargoInsurance + CostComponent.truckLicenseSertifCost + CostComponent.maintenanceCost)
        CostComponent.totalCostRP = (CostComponent.deliveryCost + CostComponent.otherCost);
        CostComponent.totalCostUSD = (CostComponent.totalCostRP / unitConversion.USDtoRP);

        const RealFreightRate = {
            unitCostMassCargo_USD_KG: (CostComponent.totalCostUSD / DeliveryData.deliveryDataTotalCargoYearKG),
            unitCostMassCargo_USD_MT: (CostComponent.totalCostUSD / DeliveryData.deliveryDataTotalCargoYearMT),
            unitCostMassCargo_IDR_KG: (CostComponent.totalCostRP / DeliveryData.deliveryDataTotalCargoYearKG),
            unitCostMassCargo_IDR_MT: (CostComponent.totalCostRP / DeliveryData.deliveryDataTotalCargoYearMT),
            unitCost_USD_MMBTU: (CostComponent.totalCostUSD / DeliveryData.deliveryDataTotalCargoYearMMBTU),
            
        }
        RealFreightRate.unitCost_USD_MMBTU_NM = Number(RealFreightRate.unitCost_USD_MMBTU) / (DeliveryData.deliveryDataTotalDistance * unitConversion.KMtoNauticalMILE);
        RealFreightRate.unitCostMassCargo_USD_KG_NM = (RealFreightRate.unitCostMassCargo_USD_KG / (DeliveryData.deliveryDataTotalDistance * unitConversion.KMtoNauticalMILE));
        RealFreightRate.unitCostMassCargo_IDR_KG_NM = (CostComponent.totalCostRP / DeliveryData.deliveryDataTotalCargoYearKG / (DeliveryData.deliveryDataTotalDistance * unitConversion.KMtoNauticalMILE));

        const profitMargin = Number(20/100);
        const proposedFreight_USD_KG =  (RealFreightRate.unitCostMassCargo_USD_KG +(RealFreightRate.unitCostMassCargo_USD_KG * profitMargin));
        const proposedFreight_IDR_KG =  (RealFreightRate.unitCostMassCargo_IDR_KG +(RealFreightRate.unitCostMassCargo_IDR_KG * profitMargin));
        const proposedFreight_USD_MMBTU = (RealFreightRate.unitCost_USD_MMBTU + (profitMargin * RealFreightRate.unitCost_USD_MMBTU));
        const ProposedFreight = {
            profitMargin,
            proposedFreight_USD_KG,
            proposedFreight_USD_MT: proposedFreight_USD_KG * unitConversion.MTtoKG,
            proposedFreight_IDR_KG,
            proposedFreight_IDR_MT: proposedFreight_IDR_KG * unitConversion.MTtoKG,
            proposedFreight_USD_MMBTU,
            proposedFreight_USD_MMBTU_NM: (proposedFreight_USD_MMBTU/(DeliveryData.deliveryDataTotalDistance * unitConversion.KMtoNauticalMILE)),
            proposedFreight_USD_KG_NM: (proposedFreight_USD_KG/(DeliveryData.deliveryDataTotalDistance * unitConversion.KMtoNauticalMILE)),
            proposedFreight_IDR_KG_NM: (proposedFreight_IDR_KG/(DeliveryData.deliveryDataTotalDistance * unitConversion.KMtoNauticalMILE))
        }

        const transSkidTruck = {
            DistributionArea,
            SkidTruck,
            BasisData,
            DeliveryData,
            CostComponent,
            RealFreightRate,
            ProposedFreight
        }
        const newTransSkidTruck = new TransSkidTruck(transSkidTruck);
        await newTransSkidTruck.save();
        res.redirect(`/project/${ProjectID}/skidtruck`)
    } catch (error) {
        res.render('error', {
            layout: 'layouts/main-layout',
            message: error,
            status: 400
        });
    }
}

module.exports = {
    getProjectSkidTruckByID,
    getFormSkidTruck,
    getFormSkidTruckByCase,
    createTransportationSkidTruck
}