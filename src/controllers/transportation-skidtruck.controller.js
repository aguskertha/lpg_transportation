const ObjectID = require('mongodb').ObjectId;
const Project = require('./../models/project.model')
const TransSkidTruckV2 = require('./../models/trans-skid-truckv2.model');
const TransSkidTruck = require('./../models/trans-skid-truck.model');
const TransSkidTruckBarge = require('./../models/trans-skid-truck-barge.model');
const TransSkidTruckOnly = require('./../models/trans-skid-truck-only.model');
const UnitConversion = require('./../models/unit_conversion.model');


const cases = [
    {
        name: 'Case 1',
        slug: 'case-1'
    },
    {
        name: 'Case 2',
        slug: 'case-2'
    },
    {
        name: 'Case 3',
        slug: 'case-3'
    },
];

const casesV2 = [
    {
        name: 'Case 1 - Multimoda case dependent (dedicated LCT/Barge)',
        slug: 'case-1'
    },
    // {
    //     name: 'Case 2',
    //     slug: 'case-2'
    // },
    // {
    //     name: 'Case 3',
    //     slug: 'case-3'
    // },
];

let unitConversion = {}

UnitConversion.find().then((data) => {
    const unit = data[0]
    if(data.length > 0){
        unitConversion.MTtoKG = unit.MTtoKG
        unitConversion.KGtoMMBTU = unit.KGtoMMBTU
        unitConversion.CBMtoMT = unit.CBMtoMT
        unitConversion.KMtoMILE = unit.KMtoMILE
        unitConversion.KMtoNauticalMILE = unit.KMtoNauticalMILE
        unitConversion.USDtoRP = unit.USDtoIDR
    }
});

const getProjectSkidTruckV2ByID = async (req, res, next) => {
    try {
        const ProjectID = req.params.projectID;
        const project = await Project.findOne({_id : ObjectID(ProjectID)});

        const transSkidTruckV2Datas = await TransSkidTruckV2.find({ProjectID: ObjectID(ProjectID)});
       
        let transSkidTrucks = [];
        transSkidTruckV2Datas.forEach(transSkidTruckData => {
            const transSkidTruck = {
                _id: transSkidTruckData._id,
                TypeCase: 'Case 1',
                DistributionRute: transSkidTruckData.DistributionArea.distOrigin+" - "+transSkidTruckData.DistributionArea.distDestination+" - "+transSkidTruckData.SkidTruck.skidTruckCargoCapacity+" T",
                SummaryPrice : transSkidTruckData.SummaryPrice
            }
            transSkidTrucks.push(transSkidTruck);
        });

        res.render('SkidTruckV2/summary', {
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

const getFormSkidTruckV2 = async (req, res, next) => {
    try{
        const ProjectID = req.params.projectID;
        const project = await Project.findOne({_id: ObjectID(ProjectID)});
        if(!project){
            throw "project not found!";
        }

        res.render('SkidTruckV2/form', {
            layout: 'layouts/main-layout',
            title: 'Form LPG Transportation',
            cases: casesV2,
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

const getFormSkidTruckV2ByCase = async (req, res, next) => {
    try{
        const typeCaseSlug = req.params.typeCase;
        const ProjectID = req.params.projectID;
        const project = await Project.findOne({_id: ObjectID(ProjectID)});
        if(!project){
            throw "project not found!";
        }
        const typeCase = casesV2.find(item => item.slug == typeCaseSlug)

        res.render('SkidTruckV2/form', {
            layout: 'layouts/main-layout',
            title: 'Form LPG Transportation + SkidTruck',
            cases: casesV2,
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

const getProjectSkidTruckByID = async (req, res, next) => {
    try {
        const ProjectID = req.params.projectID;
        const project = await Project.findOne({_id : ObjectID(ProjectID)});
        const transSkidTruckDatas = await TransSkidTruck.find({ProjectID: ObjectID(ProjectID)});
        const transSkidTruckBarges = await TransSkidTruckBarge.find({ProjectID: ObjectID(ProjectID)});
        const transSkidTruckOnlyDatas = await TransSkidTruckOnly.find({ProjectID: ObjectID(ProjectID)});
        
        let transSkidTrucks = [];
        transSkidTruckDatas.forEach(transSkidTruckData => {
            const transSkidTruck = {
                _id: transSkidTruckData._id,
                TypeCase: 'Case 1',
                DistributionArea: {
                    distArea: transSkidTruckData.DistributionArea.distArea,
                    distOrigin: transSkidTruckData.DistributionArea.distOrigin,
                    distDestination: transSkidTruckData.DistributionArea.distDestination,
                },
                RealFreightRate: {
                    unitCostMassCargo_USD_KG_NM: transSkidTruckData.RealFreightRate.unitCostMassCargo_USD_KG_NM,
                    unitCostMassCargo_IDR_KG_NM: transSkidTruckData.RealFreightRate.unitCostMassCargo_IDR_KG_NM,
                },
                ProposedFreight: {
                    proposedFreight_USD_KG_NM: transSkidTruckData.ProposedFreight.proposedFreight_USD_KG_NM,
                    proposedFreight_IDR_KG_NM: transSkidTruckData.ProposedFreight.proposedFreight_IDR_KG_NM,
                    proposedFreight_USD_MT: transSkidTruckData.ProposedFreight.proposedFreight_USD_MT,
                    proposedFreight_IDR_MT: transSkidTruckData.ProposedFreight.proposedFreight_IDR_MT,
                }
            }
            transSkidTrucks.push(transSkidTruck);
        });

        transSkidTruckBarges.forEach(transSkidTruckBarge => {
            const transSkidTruck = {
                _id: transSkidTruckBarge._id,
                TypeCase: 'Case 2',
                DistributionArea: {
                    distArea: transSkidTruckBarge.DistributionArea.distArea,
                    distOrigin: transSkidTruckBarge.DistributionArea.distOrigin,
                    distDestination: transSkidTruckBarge.DistributionArea.distDestination,
                },
                RealFreightRate: {
                    unitCostMassCargo_USD_KG_NM: transSkidTruckBarge.RealFreightRateVesselTruck.unitCostMassCargo_USD_KG_NM,
                    unitCostMassCargo_IDR_KG_NM: transSkidTruckBarge.RealFreightRateVesselTruck.unitCostMassCargo_IDR_KG_NM,
                },
                ProposedFreight: {
                    proposedFreight_USD_KG_NM: transSkidTruckBarge.ProposedFreightRateVesselTruck.proposedFreight_USD_KG_NM,
                    proposedFreight_IDR_KG_NM: transSkidTruckBarge.ProposedFreightRateVesselTruck.proposedFreight_IDR_KG_NM,
                    proposedFreight_USD_MT: transSkidTruckBarge.ProposedFreightRateVesselTruck.proposedFreight_USD_MT,
                    proposedFreight_IDR_MT: transSkidTruckBarge.ProposedFreightRateVesselTruck.proposedFreight_IDR_MT,
                }
            }
            transSkidTrucks.push(transSkidTruck);
        });

        transSkidTruckOnlyDatas.forEach(transSkidTruckData => {
            const transSkidTruck = {
                _id: transSkidTruckData._id,
                TypeCase: 'Case 3',
                DistributionArea: {
                    distArea: transSkidTruckData.DistributionArea.distArea,
                    distOrigin: transSkidTruckData.DistributionArea.distOrigin,
                    distDestination: transSkidTruckData.DistributionArea.distDestination,
                },
                RealFreightRate: {
                    unitCostMassCargo_USD_KG_NM: transSkidTruckData.RealFreightRate.unitCostMassCargo_USD_KG_NM,
                    unitCostMassCargo_IDR_KG_NM: transSkidTruckData.RealFreightRate.unitCostMassCargo_IDR_KG_NM,
                },
                ProposedFreight: {
                    proposedFreight_USD_KG_NM: transSkidTruckData.ProposedFreight.proposedFreight_USD_KG_NM,
                    proposedFreight_IDR_KG_NM: transSkidTruckData.ProposedFreight.proposedFreight_IDR_KG_NM,
                    proposedFreight_USD_MT: transSkidTruckData.ProposedFreight.proposedFreight_USD_MT,
                    proposedFreight_IDR_MT: transSkidTruckData.ProposedFreight.proposedFreight_IDR_MT,
                }
            }
            transSkidTrucks.push(transSkidTruck);
        });

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

const createTransportationSkidTruck3 = async (req, res, next) => {
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
            basisDataRiskFactor: Number(req.body.basisDataRiskFactor),
        }
        
        const DeliveryData = {
            deliveryDataOriginLPG: req.body.deliveryDataOriginLPG,
            deliveryDataDestinationSPBE: req.body.deliveryDataDestinationSPBE,
            deliveryDataDistanceTruckingOriginKM: Number(req.body.deliveryDataDistanceTruckingOriginKM),
            deliveryDataDistanceTruckingOriginMile: Number(req.body.deliveryDataDistanceTruckingOriginMile),
            deliveryDataTotalDistance: Number(req.body.deliveryDataTotalDistance),
            deliveryDataLPGLoadUnload: Number(req.body.deliveryDataLPGLoadUnload),
            deliveryDataNumberTrucking: Number(req.body.deliveryDataNumberTrucking),
        }
        DeliveryData.deliveryDataRoundTripTrucking = (((DeliveryData.deliveryDataDistanceTruckingOriginKM / SkidTruck.skidTruckSpeed) * BasisData.basisDataRiskFactor ) * 2) + (DeliveryData.deliveryDataLPGLoadUnload * 2);
        DeliveryData.deliveryDataNumberTripYear = Math.ceil((98/100*365*12)/ Number(DeliveryData.deliveryDataRoundTripTrucking));
        DeliveryData.deliveryDataTotalCargoDelivery = (DeliveryData.deliveryDataNumberTrucking * SkidTruck.skidTruckCargoCapacity);
        DeliveryData.deliveryDataTotalCargoYearMT = (DeliveryData.deliveryDataTotalCargoDelivery * DeliveryData.deliveryDataNumberTripYear);
        DeliveryData.deliveryDataTotalCargoYearKG = DeliveryData.deliveryDataTotalCargoYearMT * unitConversion.MTtoKG;
        
        const CostComponent = {
            truckSkidCost : (BasisData.basisDataRentalPriceDay * DeliveryData.deliveryDataNumberTrucking * DeliveryData.deliveryDataNumberTripYear),
            truckFuelCost: (SkidTruck.skidTruckFuelConsume * BasisData.basisDataSolarPrice * DeliveryData.deliveryDataNumberTripYear * DeliveryData.deliveryDataRoundTripTrucking * DeliveryData.deliveryDataNumberTrucking),
            truckDriverCost: (DeliveryData.deliveryDataNumberTripYear * (BasisData.basisDataDriverSalaryDay + BasisData.basisDataAssistDriverSalaryDay) * DeliveryData.deliveryDataNumberTrucking),
            tollCost: 0,
            MiscCostTrucking: (BasisData.basisDataMisEtc * DeliveryData.deliveryDataNumberTrucking * DeliveryData.deliveryDataNumberTripYear),
            
            cargoInsurance: (0.05/100 * BasisData.basisDataLPGPriceRp * SkidTruck.skidTruckCargoCapacity * DeliveryData.deliveryDataNumberTrucking * DeliveryData.deliveryDataNumberTripYear),
            truckLicenseSertifCost: (32000 * DeliveryData.deliveryDataNumberTrucking * DeliveryData.deliveryDataNumberTripYear),
            maintenanceCost: (65000 * DeliveryData.deliveryDataNumberTrucking * DeliveryData.deliveryDataNumberTripYear),
        }
        CostComponent.deliveryCost = (CostComponent.truckSkidCost + CostComponent.truckFuelCost + CostComponent.truckDriverCost + CostComponent.tollCost +CostComponent.MiscCostTrucking)
        CostComponent.otherCost = (CostComponent.cargoInsurance + CostComponent.truckLicenseSertifCost + CostComponent.maintenanceCost)
        CostComponent.totalCostRP = (CostComponent.deliveryCost + CostComponent.otherCost);
        CostComponent.totalCostUSD = (CostComponent.totalCostRP / unitConversion.USDtoRP);

        const RealFreightRate = {
            unitCostMassCargo_USD_KG: (CostComponent.totalCostUSD / DeliveryData.deliveryDataTotalCargoYearKG),
            unitCostMassCargo_USD_MT: (CostComponent.totalCostUSD / DeliveryData.deliveryDataTotalCargoYearMT),
            unitCostMassCargo_IDR_KG: (CostComponent.totalCostRP / DeliveryData.deliveryDataTotalCargoYearKG),
            unitCostMassCargo_IDR_MT: (CostComponent.totalCostRP / DeliveryData.deliveryDataTotalCargoYearMT),
            unitCost_USD_MMBTU: (CostComponent.totalCostUSD / (DeliveryData.deliveryDataTotalCargoYearKG * unitConversion.KGtoMMBTU)),
            
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
        ProposedFreight.revenue = ProposedFreight.proposedFreight_USD_KG * DeliveryData.deliveryDataTotalCargoYearKG;
        ProposedFreight.netRevenue = ProposedFreight.revenue - CostComponent.totalCostUSD;
        ProposedFreight.ratioRevenue = ProposedFreight.netRevenue / CostComponent.totalCostUSD * 100;

        const transSkidTruckOnly = {
            ProjectID,
            DistributionArea,
            SkidTruck,
            BasisData,
            DeliveryData,
            CostComponent,
            RealFreightRate,
            ProposedFreight
        }
        if(req.body.skidTruckID){
            await TransSkidTruckOnly.updateOne(
                { _id: req.body.skidTruckID},
                {
                    $set: transSkidTruckOnly
                }
            );
            res.redirect(`/project/${ProjectID}/skidtruck`)
        }
        else{
            const newTransSkidTruckOnly = new TransSkidTruckOnly(transSkidTruckOnly);
            await newTransSkidTruckOnly.save();
            res.redirect(`/project/${ProjectID}/skidtruck`)
        }
    } catch (error) {
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
            ProjectID,
            DistributionArea,
            SkidTruck,
            BasisData,
            DeliveryData,
            CostComponent,
            RealFreightRate,
            ProposedFreight
        }

        if(req.body.skidTruckID){
            await TransSkidTruck.updateOne(
                { _id: req.body.skidTruckID},
                {
                    $set: transSkidTruck
                }
            );
            res.redirect(`/project/${ProjectID}/skidtruck`)
        }
        else{
            const newTransSkidTruck = new TransSkidTruck(transSkidTruck);
            await newTransSkidTruck.save();
            res.redirect(`/project/${ProjectID}/skidtruck`)
        }
    } catch (error) {
        res.render('error', {
            layout: 'layouts/main-layout',
            message: error,
            status: 400
        });
    }
}

const createTransportationSkidTruckV2_1 = async (req, res, next) => {
    try {
        const ProjectID = req.params.projectID;
        const DistributionArea = {
            distArea: req.body.distArea,
            distOrigin: req.body.distOrigin,
            distDestination: req.body.distDestination,
        }

        const SummaryPrice = {
            bunkerPriceVesselRp : req.body.bunkerPriceVesselRp,
            bunkerPriceVesselUSD : req.body.bunkerPriceVesselUSD,
            bunkerPriceTruck : req.body.bunkerPriceTruck
        }
    
        const LCT = {
            bargeVesselName: req.body.bargeVesselName,
            bargeTypeVessel: req.body.bargeTypeVessel,
            bargeCargoCapacityTruckWithTank: Number(req.body.bargeCargoCapacityTruckWithTank),
            bargeCargoCapacityCBM: Number(req.body.bargeCargoCapacityCBM),
            bargeCargoCapacityMT: Number(req.body.bargeCargoCapacityMT),
            bargeIMONumber: req.body.bargeIMONumber,
            bargeMMSINumber: req.body.bargeMMSINumber,
            bargeCallSign: req.body.bargeCallSign,
            bargeGrossTonnage: Number(req.body.bargeGrossTonnage),
            bargeSummerDWT: Number(req.body.bargeSummerDWT),
            bargeLengthBreadth: req.body.bargeLengthBreadth,
            bargeYearBuilt: Number(req.body.bargeYearBuilt),
            bargeShipAge: Number(req.body.bargeShipAge),
            bargeCrewNumber: Number(req.body.bargeCrewNumber),
            bargeSFOC: Number(req.body.bargeSFOC),
        } 

        const Tugboat = {
            tugboatVesselName: req.body.tugboatVesselName,
            tugboatTypeVessel: req.body.tugboatTypeVessel,
            tugboatIMONumber: req.body.tugboatIMONumber,
            tugboatMMSINumber: req.body.tugboatMMSINumber,
            tugboatCallSign: req.body.tugboatCallSign,
            tugboatGrossTonnage: Number(req.body.tugboatGrossTonnage),
            tugboatSummerDWT: Number(req.body.tugboatSummerDWT),
            tugboatLengthBreadth: req.body.tugboatLengthBreadth,
            tugboatYearBuilt: Number(req.body.tugboatYearBuilt),
            tugboatShipAge: Number(req.body.tugboatShipAge),
            tugboatCrewNumber: Number(req.body.tugboatCrewNumber),
            tugboatSFOC: Number(req.body.tugboatSFOC),
        }
        const VesselBargeLCT = {
            LCT,
            Tugboat
        }

        const SkidTruck = {
            skidTruckCargoCapacity: Number(req.body.skidTruckCargoCapacity),
            skidTruckHeadSpec: req.body.skidTruckHeadSpec,
            skidTruckSpeed: Number(req.body.skidTruckSpeed),
            skidTruckFuelConsume: Number(req.body.skidTruckFuelConsume),
            skidTruckNumberTruck: Number(req.body.skidTruckNumberTruck),
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
            basisDataTollExpenses: Number(req.body.basisDataTollExpenses),
            basisDataRiskFactor: Number(req.body.basisDataRiskFactor),
        }
        
        const Voyage = {
            deliveryVoyagePortLoading: req.body.deliveryVoyagePortLoading,
            deliveryVoyagePortDischarge: req.body.deliveryVoyagePortDischarge,
            deliveryVoyageDistanceNM: Number(req.body.deliveryVoyageDistanceNM),
            deliveryVoyageSpeedVessel: Number(req.body.deliveryVoyageSpeedVessel),
            deliveryVoyageLadenTo: Number(req.body.deliveryVoyageLadenTo),
            deliveryVoyageEnterWaitTimePOL: Number(req.body.deliveryVoyageEnterWaitTimePOL),
            deliveryVoyageBallastTo: Number(req.body.deliveryVoyageBallastTo),
            deliveryVoyageEnterWaitTimePOD: Number(req.body.deliveryVoyageEnterWaitTimePOD),
            deliveryVoyageTotalSailingTime: Number(req.body.deliveryVoyageTotalSailingTime),
        };
        
        const Trucking = {
            deliveryTruckOrigin: req.body.deliveryTruckOrigin,
            deliveryTruckPortOrigin: req.body.deliveryTruckPortOrigin,
            deliveryTruckDestination: req.body.deliveryTruckDestination,
            deliveryTruckLPGLoadingTimeTruk: Number(req.body.deliveryTruckLPGLoadingTimeTruk),
            deliveryTruckTotalLPGLoadingTimeTruck: Number(req.body.deliveryTruckTotalLPGLoadingTimeTruck),
            deliveryTruckTruckLoadingTimeLCT: Number(req.body.deliveryTruckTruckLoadingTimeLCT),
            deliveryTruckTotalTruckLoadingTimeLCT: Number(req.body.deliveryTruckTotalTruckLoadingTimeLCT),
            deliveryTruckDistanceTruckingPortKM: Number(req.body.deliveryTruckDistanceTruckingPortKM),
            deliveryTruckDistanceTruckingPortMile: Number(req.body.deliveryTruckDistanceTruckingPortMile),
            deliveryTruckTruckingTimePort: Number(req.body.deliveryTruckTruckingTimePort),
            deliveryTruckUnloadingLCT: Number(req.body.deliveryTruckUnloadingLCT),
            deliveryTruckTotalLoadingTimeLCT: Number(req.body.deliveryTruckTotalLoadingTimeLCT),
            deliveryTruckDistanceTruckingSPBEKM: Number(req.body.deliveryTruckDistanceTruckingSPBEKM),
            deliveryTruckDistanceTruckingSPBEMile: Number(req.body.deliveryTruckDistanceTruckingSPBEMile),
            deliveryTruckTruckingTimeSPBE: Number(req.body.deliveryTruckTruckingTimeSPBE),
            deliveryTruckNumberTruckingDelivery: Number(req.body.deliveryTruckNumberTruckingDelivery),
        }
        Voyage.deliveryVoyageTruckLoadUnloadTimePort = (Trucking.deliveryTruckTotalTruckLoadingTimeLCT + Trucking.deliveryTruckTotalLoadingTimeLCT) / 24
        Voyage.deliveryVoyageTotalTimeTurnAroundDay = (Voyage.deliveryVoyageTotalSailingTime + Voyage.deliveryVoyageTruckLoadUnloadTimePort) * 2
        Voyage.deliveryVoyageTotalTimeTurnAroundHour = Voyage.deliveryVoyageTotalTimeTurnAroundDay * 24

        Trucking.deliveryTruckTotalTruckingDistanceKM = (Trucking.deliveryTruckDistanceTruckingPortKM + Trucking.deliveryTruckDistanceTruckingSPBEKM)
        Trucking.deliveryTruckTotalTruckingDistanceNM = (Trucking.deliveryTruckTotalTruckingDistanceKM * unitConversion.KMtoNauticalMILE)
        Trucking.deliveryTruckTotalTruckingTimeHR = (Trucking.deliveryTruckTotalLPGLoadingTimeTruck + Trucking.deliveryTruckTotalTruckLoadingTimeLCT + Trucking.deliveryTruckTruckingTimePort + Trucking.deliveryTruckTotalLoadingTimeLCT + Trucking.deliveryTruckTruckingTimeSPBE ) * 2
        Trucking.deliveryTruckTotalTruckingTimeDay = (Trucking.deliveryTruckTotalTruckingTimeHR / 24)
        Trucking.deliveryTruckTotalCargoDelivery = Trucking.deliveryTruckNumberTruckingDelivery * SkidTruck.skidTruckCargoCapacity
        

        const  RoundTripDelivery = {
            effectiveDateDelivery: Number(req.body.effectiveDateDelivery),
            dependentDocking: Number(req.body.dependentDocking),
            effectiveDeliveryDay: Number(req.body.effectiveDeliveryDay),
        }
        RoundTripDelivery.numberVesselRoundTripYear = RoundTripDelivery.effectiveDeliveryDay / (Trucking.deliveryTruckTotalTruckingTimeDay + Voyage.deliveryVoyageTotalTimeTurnAroundDay)
        RoundTripDelivery.vesselIdleDayYear = RoundTripDelivery.effectiveDeliveryDay - (RoundTripDelivery.numberVesselRoundTripYear * Voyage.deliveryVoyageTotalTimeTurnAroundDay)
        RoundTripDelivery.truckIdleDayYear = RoundTripDelivery.effectiveDeliveryDay - (RoundTripDelivery.numberVesselRoundTripYear * (Voyage.deliveryVoyageTotalTimeTurnAroundDay + Trucking.deliveryTruckTotalTruckingTimeDay))
        RoundTripDelivery.totalCargoCarryingCapacityYearMT =  RoundTripDelivery.numberVesselRoundTripYear * LCT.bargeCargoCapacityMT
        RoundTripDelivery.totalCargoCarryingCapacityYearKG =  LCT.bargeCargoCapacityMT * unitConversion.MTtoKG * RoundTripDelivery.numberVesselRoundTripYear
        RoundTripDelivery.totalCargoCarryingCapacityYearMMBTU = RoundTripDelivery.totalCargoCarryingCapacityYearKG * unitConversion.KGtoMMBTU
        
        Trucking.deliveryTruckTotalCargoYearMT = Trucking.deliveryTruckTotalCargoDelivery * RoundTripDelivery.numberVesselRoundTripYear
        Trucking.deliveryTruckTotalCargoYearKG = Trucking.deliveryTruckTotalCargoYearMT * unitConversion.MTtoKG
        Trucking.deliveryTruckTotalCargoYearMMBTU = Trucking.deliveryTruckTotalCargoYearKG * unitConversion.KGtoMMBTU
        
        const DeliveryData = {
            Voyage,
            Trucking,
            RoundTripDelivery
        }


        const BunkeringCost = {
            bunkeringPortIdleMFO: Number(req.body.bunkeringPortIdleMFO),
            bunkeringPortIdleMDO: Number(req.body.bunkeringPortIdleMDO),
            bunkeringPortIdleMGO: Number(req.body.bunkeringPortIdleMGO),
            bunkeringPortWorkingMFO: Number(req.body.bunkeringPortWorkingMFO),
            bunkeringPortWorkingMDO: Number(req.body.bunkeringPortWorkingMDO),
            bunkeringPortWorkingMGO: Number(req.body.bunkeringPortWorkingMGO),
            bunkeringAtSeaMFO: Number(req.body.bunkeringAtSeaMFO),
            bunkeringAtSeaMDO: Number(req.body.bunkeringAtSeaMDO),
            bunkeringAtSeaMGO: Number(req.body.bunkeringAtSeaMGO),
            bunkeringBunkerPriceIDR: Number(req.body.bunkeringBunkerPriceIDR),
            bunkeringBunkerPriceUSD: Number(req.body.bunkeringBunkerPriceUSD),
        }
        
        BunkeringCost.bunkeringConsumeTrip = ((BunkeringCost.bunkeringPortIdleMFO + BunkeringCost.bunkeringPortIdleMDO + BunkeringCost.bunkeringPortIdleMGO) * DeliveryData.Voyage.deliveryVoyageTruckLoadUnloadTimePort) + ((BunkeringCost.bunkeringPortWorkingMFO + BunkeringCost.bunkeringPortWorkingMDO + BunkeringCost.bunkeringPortWorkingMGO) * DeliveryData.Voyage.deliveryVoyageTruckLoadUnloadTimePort) + ((BunkeringCost.bunkeringAtSeaMFO + BunkeringCost.bunkeringAtSeaMDO + BunkeringCost.bunkeringAtSeaMGO) * DeliveryData.Voyage.deliveryVoyageTotalSailingTime);
        BunkeringCost.bunkeringConsumeYear = (BunkeringCost.bunkeringConsumeTrip * RoundTripDelivery.numberVesselRoundTripYear);
        BunkeringCost.bunkeringTotalBunkerCostTripIDR = (BunkeringCost.bunkeringBunkerPriceIDR * BunkeringCost.bunkeringConsumeTrip);
        BunkeringCost.bunkeringTotalBunkerCostYearIDR = (BunkeringCost.bunkeringBunkerPriceIDR * BunkeringCost.bunkeringConsumeYear);
        BunkeringCost.bunkeringTotalBunkerCostTripUSD = (BunkeringCost.bunkeringBunkerPriceUSD * BunkeringCost.bunkeringConsumeTrip);
        BunkeringCost.bunkeringTotalBunkerCostYearUSD = (BunkeringCost.bunkeringBunkerPriceUSD * BunkeringCost.bunkeringConsumeYear);
        
        const ManningCrewCost = {
            Barge: {
                bunkeringBargeLoadingMaster: Number(req.body.bunkeringBargeLoadingMaster),
                bunkeringBargeBoatswain: Number(req.body.bunkeringBargeBoatswain),
            },
            Tugboat: {
                bunkeringTugboatDeckMaster: Number(req.body.bunkeringTugboatDeckMaster),
                bunkeringTugboatDeckChiefOfficer: Number(req.body.bunkeringTugboatDeckChiefOfficer),
                bunkeringTugboatDeckOfficer: Number(req.body.bunkeringTugboatDeckOfficer),
                bunkeringTugboatDeckRadioOperator: Number(req.body.bunkeringTugboatDeckRadioOperator),
                bunkeringTugboatDeckBoatswain: Number(req.body.bunkeringTugboatDeckBoatswain),
                bunkeringTugboatDeckAbleBodied: Number(req.body.bunkeringTugboatDeckAbleBodied),
                bunkeringTugboatDeckOrdinarySeamen: Number(req.body.bunkeringTugboatDeckOrdinarySeamen),
                bunkeringTugboatDeckChef: Number(req.body.bunkeringTugboatDeckChef),
                bunkeringTugboatDeckAssistantChef: Number(req.body.bunkeringTugboatDeckAssistantChef),
                bunkeringTugboatDeckOthers: Number(req.body.bunkeringTugboatDeckOthers),
                bunkeringTugboatEngineChiefEngineer: Number(req.body.bunkeringTugboatEngineChiefEngineer),
                bunkeringTugboatEngineChiefMachinist: Number(req.body.bunkeringTugboatEngineChiefMachinist),
                bunkeringTugboatEngineMachinist: Number(req.body.bunkeringTugboatEngineMachinist),
                bunkeringTugboatEngineEngineForemen: Number(req.body.bunkeringTugboatEngineEngineForemen),
                bunkeringTugboatEngineOiler: Number(req.body.bunkeringTugboatEngineOiler),
                bunkeringTugboatEngineWiper: Number(req.body.bunkeringTugboatEngineWiper),
                bunkeringTugboatEngineOthers: Number(req.body.bunkeringTugboatEngineOthers),
            }
        }

        ManningCrewCost.TotalCrewCostMonth = (
            ManningCrewCost.Barge.bunkeringBargeLoadingMaster +
            ManningCrewCost.Barge.bunkeringBargeBoatswain +
            ManningCrewCost.Tugboat.bunkeringTugboatDeckMaster +
            ManningCrewCost.Tugboat.bunkeringTugboatDeckChiefOfficer +
            ManningCrewCost.Tugboat.bunkeringTugboatDeckOfficer +
            ManningCrewCost.Tugboat.bunkeringTugboatDeckRadioOperator +
            ManningCrewCost.Tugboat.bunkeringTugboatDeckBoatswain +
            ManningCrewCost.Tugboat.bunkeringTugboatDeckAbleBodied +
            ManningCrewCost.Tugboat.bunkeringTugboatDeckOrdinarySeamen +
            ManningCrewCost.Tugboat.bunkeringTugboatDeckChef +
            ManningCrewCost.Tugboat.bunkeringTugboatDeckAssistantChef +
            ManningCrewCost.Tugboat.bunkeringTugboatDeckOthers +
            ManningCrewCost.Tugboat.bunkeringTugboatEngineChiefEngineer +
            ManningCrewCost.Tugboat.bunkeringTugboatEngineChiefMachinist +
            ManningCrewCost.Tugboat.bunkeringTugboatEngineMachinist +
            ManningCrewCost.Tugboat.bunkeringTugboatEngineEngineForemen +
            ManningCrewCost.Tugboat.bunkeringTugboatEngineOiler +
            ManningCrewCost.Tugboat.bunkeringTugboatEngineWiper +
            ManningCrewCost.Tugboat.bunkeringTugboatEngineOthers
        );
        ManningCrewCost.TotalCrewCostYear = (ManningCrewCost.TotalCrewCostMonth * 12);
        const PortCost = {
            portCostChargeRoundTrip: Number(req.body.portCostChargeRoundTrip),
        }
        PortCost.portCostTotalPortChargeYear = (PortCost.portCostChargeRoundTrip * RoundTripDelivery.numberVesselRoundTripYear);

        const CargoCostHandling = {
            portCostLasUnlasPOLTrip: Number(req.body.portCostLasUnlasPOLTrip),
            portCostLasUnlasPODTrip: Number(req.body.portCostLasUnlasPODTrip),
        }
        CargoCostHandling.totalCargoHandling = (CargoCostHandling.portCostLasUnlasPOLTrip + CargoCostHandling.portCostLasUnlasPODTrip)
        
        const VesselCharterCost = {
            vesselCharterCostCharterRateDay: Number(req.body.vesselCharterCostCharterRateDay),
        }
        VesselCharterCost.totalCharterRateYear = (VesselCharterCost.vesselCharterCostCharterRateDay*365);
        
        const InsuranceCost = {
            insuranceCostCrew: Number(req.body.insuranceCostCrew),
            insuranceCostShip: Number(req.body.insuranceCostShip),
            insuranceCostTotal: Number(req.body.insuranceCostTotal),
        }
        
        const DockRepairMTCost = {
            dockRepairMTDockingCost: Number(req.body.dockRepairMTDockingCost),
            dockRepairMTRepairStoreCost: Number(req.body.dockRepairMTRepairStoreCost),
            dockRepairMTLubeOilCost: Number(req.body.dockRepairMTLubeOilCost),
            dockRepairMTTotal: Number(req.body.dockRepairMTTotal),
        }
        
        const OtherCost = {
            otherCostVictually: Number(req.body.otherCostVictually),
            otherCostAdmin: Number(req.body.otherCostAdmin),
            otherCostTotal: Number(req.body.otherCostTotal),
        }
        const CostComponent = {
            BunkeringCost,
            ManningCrewCost,
            PortCost,
            CargoCostHandling,
            VesselCharterCost,
            InsuranceCost,
            DockRepairMTCost,
            OtherCost
        }
        CostComponent.TotalCostVesselLCTBargeUSD = (BunkeringCost.bunkeringTotalBunkerCostYearUSD + ManningCrewCost.TotalCrewCostYear + PortCost.portCostTotalPortChargeYear + CargoCostHandling.totalCargoHandling + VesselCharterCost.totalCharterRateYear + InsuranceCost.insuranceCostTotal + DockRepairMTCost.dockRepairMTTotal + OtherCost.otherCostTotal);
        CostComponent.TotalCostVesselLCTBargeIDR = (CostComponent.TotalCostVesselLCTBargeUSD * unitConversion.USDtoRP)
        
        const TruckingCost = {
            truckSkidCharterCost: (BasisData.basisDataRentalPriceDay * DeliveryData.Trucking.deliveryTruckNumberTruckingDelivery * 365),
            truckingFuelCost: (SkidTruck.skidTruckFuelConsume * Trucking.deliveryTruckTotalTruckingTimeHR * Trucking.deliveryTruckNumberTruckingDelivery * RoundTripDelivery.numberVesselRoundTripYear) * BasisData.basisDataSolarPrice,
            truckingDriverAssDriverCost: (BasisData.basisDataAssistDriverSalaryDay + BasisData.basisDataDriverSalaryDay) * Trucking.deliveryTruckNumberTruckingDelivery * (RoundTripDelivery.effectiveDeliveryDay - RoundTripDelivery.truckIdleDayYear),
            tollCost: 0,
            miscCost: (BasisData.basisDataMisEtc * Trucking.deliveryTruckNumberTruckingDelivery * RoundTripDelivery.numberVesselRoundTripYear),
            cargoInsurance: (0.05/100 * BasisData.basisDataLPGPriceRp * RoundTripDelivery.totalCargoCarryingCapacityYearMT),
            truckInspLicenseCertifCost: (32000 * Trucking.deliveryTruckNumberTruckingDelivery * RoundTripDelivery.effectiveDeliveryDay),
            maintenanceCost: (65000 * Trucking.deliveryTruckNumberTruckingDelivery * RoundTripDelivery.effectiveDeliveryDay),
        }
        TruckingCost.DeliveryCost = (TruckingCost.truckSkidCharterCost + TruckingCost.truckingFuelCost + TruckingCost.truckingDriverAssDriverCost + TruckingCost.tollCost + TruckingCost.miscCost );
        TruckingCost.OtherCost = (TruckingCost.cargoInsurance + TruckingCost.truckInspLicenseCertifCost + TruckingCost.maintenanceCost );
        TruckingCost.TotalCostTruckingRP = (TruckingCost.DeliveryCost + TruckingCost.OtherCost);
        TruckingCost.TotalCostTruckingUSD = (TruckingCost.TotalCostTruckingRP / unitConversion.USDtoRP);
        
        const RealFreightRateVessel = {
            unitCostMassCargo_USD_KG: (CostComponent.TotalCostVesselLCTBargeUSD/RoundTripDelivery.totalCargoCarryingCapacityYearKG),
            unitCostMassCargo_USD_MT: (CostComponent.TotalCostVesselLCTBargeUSD/RoundTripDelivery.totalCargoCarryingCapacityYearMT),
            unitCostMassCargo_IDR_KG: (CostComponent.TotalCostVesselLCTBargeIDR/RoundTripDelivery.totalCargoCarryingCapacityYearKG),
            unitCostMassCargo_IDR_MT: (CostComponent.TotalCostVesselLCTBargeIDR/RoundTripDelivery.totalCargoCarryingCapacityYearMT),
            unitCost_USD_MMBTU: (CostComponent.TotalCostVesselLCTBargeUSD/RoundTripDelivery.totalCargoCarryingCapacityYearMMBTU),
            unitCost_USD_MMBTU_NM: (CostComponent.TotalCostVesselLCTBargeUSD/RoundTripDelivery.totalCargoCarryingCapacityYearMMBTU / Voyage.deliveryVoyageDistanceNM),
            unitCostMassCargo_USD_KG_NM: (CostComponent.TotalCostVesselLCTBargeUSD/RoundTripDelivery.totalCargoCarryingCapacityYearKG / Voyage.deliveryVoyageDistanceNM),
            unitCostMassCargo_IDR_KG_NM: (CostComponent.TotalCostVesselLCTBargeIDR/RoundTripDelivery.totalCargoCarryingCapacityYearKG / Voyage.deliveryVoyageDistanceNM),
        }
        const RealFreightRateTruck = {
            unitCostMassCargo_USD_KG: (TruckingCost.TotalCostTruckingUSD/Trucking.deliveryTruckTotalCargoYearKG),
            unitCostMassCargo_USD_MT: (TruckingCost.TotalCostTruckingUSD/Trucking.deliveryTruckTotalCargoYearMT),
            unitCostMassCargo_IDR_KG: (TruckingCost.TotalCostTruckingRP/Trucking.deliveryTruckTotalCargoYearKG),
            unitCostMassCargo_IDR_MT: (TruckingCost.TotalCostTruckingRP/Trucking.deliveryTruckTotalCargoYearMT),
            unitCost_USD_MMBTU: (TruckingCost.TotalCostTruckingUSD/(Trucking.deliveryTruckTotalCargoYearMMBTU)),
            unitCost_USD_MMBTU_NM: (TruckingCost.TotalCostTruckingUSD/Trucking.deliveryTruckTotalCargoYearMMBTU / Trucking.deliveryTruckTotalTruckingDistanceNM),
            unitCostMassCargo_USD_KG_NM: (TruckingCost.TotalCostTruckingUSD/Trucking.deliveryTruckTotalCargoYearKG / Trucking.deliveryTruckTotalTruckingDistanceNM),
            unitCostMassCargo_IDR_KG_NM: (TruckingCost.TotalCostTruckingRP/Trucking.deliveryTruckTotalCargoYearKG / Trucking.deliveryTruckTotalTruckingDistanceNM),
        }
        const RealFreightRateVesselTruck = {
            unitCostMassCargo_USD_KG: (RealFreightRateTruck.unitCostMassCargo_USD_KG + RealFreightRateVessel.unitCostMassCargo_USD_KG),
            unitCostMassCargo_USD_MT: (RealFreightRateTruck.unitCostMassCargo_USD_MT + RealFreightRateVessel.unitCostMassCargo_USD_MT),
            unitCostMassCargo_IDR_KG: (RealFreightRateTruck.unitCostMassCargo_IDR_KG + RealFreightRateVessel.unitCostMassCargo_IDR_KG),
            unitCostMassCargo_IDR_MT: (RealFreightRateTruck.unitCostMassCargo_IDR_MT + RealFreightRateVessel.unitCostMassCargo_IDR_MT),
            unitCost_USD_MMBTU: (RealFreightRateTruck.unitCost_USD_MMBTU + RealFreightRateVessel.unitCost_USD_MMBTU),
            unitCost_USD_MMBTU_NM: (RealFreightRateTruck.unitCost_USD_MMBTU_NM + RealFreightRateVessel.unitCost_USD_MMBTU_NM),
            unitCostMassCargo_USD_KG_NM: (RealFreightRateTruck.unitCostMassCargo_USD_KG_NM + RealFreightRateVessel.unitCostMassCargo_USD_KG_NM),
            unitCostMassCargo_IDR_KG_NM: (RealFreightRateTruck.unitCostMassCargo_IDR_KG_NM + RealFreightRateVessel.unitCostMassCargo_IDR_KG_NM),
        }

        const profitMargin = Number(20/100);

        const ProposedFreightVessel = {
            profitMargin : profitMargin,
            proposedFreight_USD_KG : RealFreightRateVessel.unitCostMassCargo_USD_KG + (profitMargin * RealFreightRateVessel.unitCostMassCargo_USD_KG),
            proposedFreight_USD_MT : RealFreightRateVessel.unitCostMassCargo_USD_MT + (profitMargin * RealFreightRateVessel.unitCostMassCargo_USD_MT),
            proposedFreight_IDR_KG : RealFreightRateVessel.unitCostMassCargo_IDR_KG + (profitMargin * RealFreightRateVessel.unitCostMassCargo_IDR_KG),
            proposedFreight_IDR_MT : RealFreightRateVessel.unitCostMassCargo_IDR_MT + (profitMargin * RealFreightRateVessel.unitCostMassCargo_IDR_MT),
            proposedFreight_USD_MMBTU : (RealFreightRateVessel.unitCostMassCargo_USD_KG + (profitMargin * RealFreightRateVessel.unitCostMassCargo_USD_KG)) * unitConversion.KGtoMMBTU,
            proposedFreight_USD_MMBTU_NM : (RealFreightRateVessel.unitCostMassCargo_USD_KG + (profitMargin * RealFreightRateVessel.unitCostMassCargo_USD_KG)) * unitConversion.KGtoMMBTU / Voyage.deliveryVoyageDistanceNM,
            proposedFreight_USD_KG_NM : (RealFreightRateVessel.unitCostMassCargo_USD_KG + (profitMargin * RealFreightRateVessel.unitCostMassCargo_USD_KG)) / Voyage.deliveryVoyageDistanceNM,
            proposedFreight_IDR_KG_NM : (RealFreightRateVessel.unitCostMassCargo_IDR_KG + (profitMargin * RealFreightRateVessel.unitCostMassCargo_IDR_KG)) / Voyage.deliveryVoyageDistanceNM,
        }

        const ProposedFreightTruck = {
            profitMargin : profitMargin,
            proposedFreight_USD_KG : RealFreightRateTruck.unitCostMassCargo_USD_KG + (profitMargin * RealFreightRateTruck.unitCostMassCargo_USD_KG),
            proposedFreight_USD_MT : RealFreightRateTruck.unitCostMassCargo_USD_MT + (profitMargin * RealFreightRateTruck.unitCostMassCargo_USD_MT),
            proposedFreight_IDR_KG : RealFreightRateTruck.unitCostMassCargo_IDR_KG + (profitMargin * RealFreightRateTruck.unitCostMassCargo_IDR_KG),
            proposedFreight_IDR_MT : RealFreightRateTruck.unitCostMassCargo_IDR_MT + (profitMargin * RealFreightRateTruck.unitCostMassCargo_IDR_MT),
            proposedFreight_USD_MMBTU : (RealFreightRateTruck.unitCostMassCargo_USD_KG + (profitMargin * RealFreightRateTruck.unitCostMassCargo_USD_KG)) * unitConversion.KGtoMMBTU,
            proposedFreight_USD_MMBTU_NM : (RealFreightRateTruck.unitCostMassCargo_USD_KG + (profitMargin * RealFreightRateTruck.unitCostMassCargo_USD_KG)) * unitConversion.KGtoMMBTU / Trucking.deliveryTruckTotalTruckingDistanceNM,
            proposedFreight_USD_KG_NM : (RealFreightRateTruck.unitCostMassCargo_USD_KG + (profitMargin * RealFreightRateTruck.unitCostMassCargo_USD_KG)) / Trucking.deliveryTruckTotalTruckingDistanceNM,
            proposedFreight_IDR_KG_NM : (RealFreightRateTruck.unitCostMassCargo_IDR_KG + (profitMargin * RealFreightRateTruck.unitCostMassCargo_IDR_KG)) / Trucking.deliveryTruckTotalTruckingDistanceNM,
        }

        const ProposedFreightVesselTruck = {
            profitMargin : profitMargin,
            proposedFreight_USD_KG : RealFreightRateVesselTruck.unitCostMassCargo_USD_KG + (profitMargin * RealFreightRateVesselTruck.unitCostMassCargo_USD_KG),
            proposedFreight_USD_MT : RealFreightRateVesselTruck.unitCostMassCargo_USD_MT + (profitMargin * RealFreightRateVesselTruck.unitCostMassCargo_USD_MT),
            proposedFreight_IDR_KG : RealFreightRateVesselTruck.unitCostMassCargo_IDR_KG + (profitMargin * RealFreightRateVesselTruck.unitCostMassCargo_IDR_KG),
            proposedFreight_IDR_MT : RealFreightRateVesselTruck.unitCostMassCargo_IDR_MT + (profitMargin * RealFreightRateVesselTruck.unitCostMassCargo_IDR_MT),
            proposedFreight_USD_MMBTU : RealFreightRateVesselTruck.unitCost_USD_MMBTU + (profitMargin * RealFreightRateVesselTruck.unitCost_USD_MMBTU),  
            proposedFreight_USD_MMBTU_NM : RealFreightRateVesselTruck.unitCost_USD_MMBTU_NM + (profitMargin * RealFreightRateVesselTruck.unitCost_USD_MMBTU_NM),  
            proposedFreight_USD_KG_NM : RealFreightRateVesselTruck.unitCostMassCargo_USD_KG_NM + (profitMargin * RealFreightRateVesselTruck.unitCostMassCargo_USD_KG_NM),  
            proposedFreight_IDR_KG_NM : RealFreightRateVesselTruck.unitCostMassCargo_IDR_KG_NM + (profitMargin * RealFreightRateVesselTruck.unitCostMassCargo_IDR_KG_NM),   
        }

        SummaryPrice.vesselFreightCostReal = RealFreightRateVessel.unitCostMassCargo_IDR_KG
        SummaryPrice.truckFreightCostReal = RealFreightRateTruck.unitCostMassCargo_IDR_KG
        SummaryPrice.vesselTruckFreightCostReal = RealFreightRateVesselTruck.unitCostMassCargo_IDR_KG

        SummaryPrice.vesselFreightCostProposed = ProposedFreightVessel.proposedFreight_IDR_KG
        SummaryPrice.truckFreightCostProposed = ProposedFreightTruck.proposedFreight_IDR_KG
        SummaryPrice.vesselTruckFreightCostProposed = ProposedFreightVesselTruck.proposedFreight_IDR_KG

        const transSkidTruckV2 = {
            ProjectID,
            DistributionArea,
            SummaryPrice,
            VesselBargeLCT,
            SkidTruck,
            BasisData,
            DeliveryData,
            CostComponent,
            TruckingCost,
            RealFreightRateVessel,
            RealFreightRateTruck,
            RealFreightRateVesselTruck,
            ProposedFreightVessel,
            ProposedFreightTruck,
            ProposedFreightVesselTruck,
        }

        console.log(transSkidTruckV2)

        if(req.body.skidTruckID){
            // await TransSkidTruckBarge.updateOne(
            //     { _id: req.body.skidTruckID},
            //     {
            //         $set: transSkidTruckBarge
            //     }
            // );
            // res.redirect(`/project/${ProjectID}/skidtruck`)
        }
        else{
            const newTransSkidTruckV2 = new TransSkidTruckV2(transSkidTruckV2);
            await newTransSkidTruckV2.save()
            res.redirect(`/project/${ProjectID}/skidtruckv2`)
        }

    } catch (error) {
        res.render('error', {
            layout: 'layouts/main-layout',
            message: error,
            status: 400
        });
    }
}

const createTransportationSkidTruck2 = async (req, res, next) => {
    try {
        const ProjectID = req.params.projectID;
        const DistributionArea = {
            distArea: req.body.distArea,
            distOrigin: req.body.distOrigin,
            distDestination: req.body.distDestination,
        }
        
        const Barge = {
            bargeVesselName: req.body.bargeVesselName,
            bargeTypeVessel: req.body.bargeTypeVessel,
            bargeCargoCapacityCBM: Number(req.body.bargeCargoCapacityCBM),
            bargeCargoCapacityMT: Number(req.body.bargeCargoCapacityMT),
            bargeIMONumber: req.body.bargeIMONumber,
            bargeMMSINumber: req.body.bargeMMSINumber,
            bargeCallSign: req.body.bargeCallSign,
            bargeGrossTonnage: Number(req.body.bargeGrossTonnage),
            bargeSummerDWT: Number(req.body.bargeSummerDWT),
            bargeLengthBreadth: req.body.bargeLengthBreadth,
            bargeYearBuilt: Number(req.body.bargeYearBuilt),
            bargeShipAge: Number(req.body.bargeShipAge),
            bargeCrewNumber: Number(req.body.bargeCrewNumber),
            bargeSFOC: Number(req.body.bargeSFOC),
        } 

        const Tugboat = {
            tugboatVesselName: req.body.tugboatVesselName,
            tugboatTypeVessel: req.body.tugboatTypeVessel,
            tugboatIMONumber: req.body.tugboatIMONumber,
            tugboatMMSINumber: req.body.tugboatMMSINumber,
            tugboatCallSign: req.body.tugboatCallSign,
            tugboatGrossTonnage: Number(req.body.tugboatGrossTonnage),
            tugboatSummerDWT: Number(req.body.tugboatSummerDWT),
            tugboatLengthBreadth: req.body.tugboatLengthBreadth,
            tugboatYearBuilt: Number(req.body.tugboatYearBuilt),
            tugboatShipAge: Number(req.body.tugboatShipAge),
            tugboatCrewNumber: Number(req.body.tugboatCrewNumber),
            tugboatSFOC: Number(req.body.tugboatSFOC),
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
            basisDataRiskFactor: Number(req.body.basisDataRiskFactor),
        }
        
        const Voyage = {
            deliveryVoyagePortLoading: req.body.deliveryVoyagePortLoading,
            deliveryVoyagePortDischarge: req.body.deliveryVoyagePortDischarge,
            deliveryVoyageDistanceNM: Number(req.body.deliveryVoyageDistanceNM),
            deliveryVoyageSpeedVessel: Number(req.body.deliveryVoyageSpeedVessel),
            deliveryVoyageLadenTo: Number(req.body.deliveryVoyageLadenTo),
            deliveryVoyageBallastTo: Number(req.body.deliveryVoyageBallastTo),
            deliveryVoyagePumpPort1: Number(req.body.deliveryVoyagePumpPort1),
            deliveryVoyagePumpPort2: Number(req.body.deliveryVoyagePumpPort2),
            deliveryVoyageTotalLoadingTime: Number(req.body.deliveryVoyageTotalLoadingTime),
            deliveryVoyageEnterWaitTimePOL: Number(req.body.deliveryVoyageEnterWaitTimePOL),
            deliveryVoyageDiscPumpPort1: Number(req.body.deliveryVoyageDiscPumpPort1),
            deliveryVoyageDiscTotalLoadingTime: Number(req.body.deliveryVoyageDiscTotalLoadingTime),
            deliveryVoyageDiscEnterWaitTimePOL: Number(req.body.deliveryVoyageDiscEnterWaitTimePOL),
            deliveryVoyageCalendarDays: Number(req.body.deliveryVoyageCalendarDays),
            deliveryVoyageDockingEtc: Number(req.body.deliveryVoyageDockingEtc),
            deliveryVoyageMobilization: Number(req.body.deliveryVoyageMobilization),
        };
        Voyage.deliveryVoyageTotalTimeTurnAroundDay = (Voyage.deliveryVoyageLadenTo + Voyage.deliveryVoyageBallastTo + Voyage.deliveryVoyageEnterWaitTimePOL + Voyage.deliveryVoyageTotalLoadingTime + Voyage.deliveryVoyageDiscTotalLoadingTime + Voyage.deliveryVoyageDiscEnterWaitTimePOL);
        Voyage.deliveryVoyageTotalTimeTurnAroundHour = Voyage.deliveryVoyageTotalTimeTurnAroundDay * 24;
        Voyage.deliveryVoyageEffectiveDay = (Voyage.deliveryVoyageCalendarDays - Voyage.deliveryVoyageDockingEtc - Voyage.deliveryVoyageMobilization);
        Voyage.deliveryVoyageNumberVesselRoundTripYear = Math.floor((Number(Voyage.deliveryVoyageEffectiveDay) / Number(Voyage.deliveryVoyageTotalTimeTurnAroundDay))) ;
        Voyage.deliveryVoyageIdleDaysYear = (Voyage.deliveryVoyageEffectiveDay - (Voyage.deliveryVoyageNumberVesselRoundTripYear * Voyage.deliveryVoyageTotalTimeTurnAroundDay));
        Voyage.deliveryVoyageTotalCargoYearMT = (Voyage.deliveryVoyageNumberVesselRoundTripYear * Barge.bargeCargoCapacityMT);
        Voyage.deliveryVoyageTotalCargoYearKG = (Voyage.deliveryVoyageNumberVesselRoundTripYear * Barge.bargeCargoCapacityMT * unitConversion.MTtoKG);
        Voyage.deliveryVoyageTotalCargoYearMMBTU = (Voyage.deliveryVoyageTotalCargoYearKG * unitConversion.KGtoMMBTU);


        const Trucking = {
            deliveryTruckOrigin: req.body.deliveryTruckOrigin,
            deliveryTruckDestination: req.body.deliveryTruckDestination,
            deliveryTruckLPGFillRate: Number(req.body.deliveryTruckLPGFillRate),
            deliveryTruckNumberLPGFill: Number(req.body.deliveryTruckNumberLPGFill),
            deliveryTruckLPGDiscRate: Number(req.body.deliveryTruckLPGDiscRate),
            deliveryTruckNumberConnSPBE: Number(req.body.deliveryTruckNumberConnSPBE),
            deliveryTruckDistanceTruckingKM: Number(req.body.deliveryTruckDistanceTruckingKM),
            deliveryTruckDistanceTruckingMile: Number(req.body.deliveryTruckDistanceTruckingMile),
            deliveryTruckTotalTruckingTimeTrip: Number(req.body.deliveryTruckTotalTruckingTimeTrip),
            deliveryTruckNumberTruckingDelivery: Number(req.body.deliveryTruckNumberTruckingDelivery),
        }
        Trucking.deliveryTruckTotalTimeFillLPG = (Trucking.deliveryTruckLPGFillRate * Trucking.deliveryTruckNumberTruckingDelivery / Trucking.deliveryTruckNumberLPGFill);
        Trucking.deliveryTruckTotalDiscTimeFillLPG = (Trucking.deliveryTruckLPGDiscRate * Trucking.deliveryTruckNumberTruckingDelivery / Trucking.deliveryTruckNumberConnSPBE);
        Trucking.deliveryTruckTotalTimeTurnAround = ((Trucking.deliveryTruckTotalTruckingTimeTrip * 2) + Trucking.deliveryTruckTotalTimeFillLPG + Trucking.deliveryTruckTotalDiscTimeFillLPG);
        Trucking.deliveryTruckTotalCargoDelivery = (Trucking.deliveryTruckNumberTruckingDelivery * SkidTruck.skidTruckCargoCapacity);
        Trucking.deliveryTruckTotalTripYear = (98/100 * 365 * 12) / Trucking.deliveryTruckTotalTimeTurnAround;
        Trucking.deliveryTruckTotalCargoYearMT = (Trucking.deliveryTruckTotalTripYear * Trucking.deliveryTruckTotalCargoDelivery);
        Trucking.deliveryTruckTotalCargoYearKG = (Trucking.deliveryTruckTotalCargoYearMT * unitConversion.MTtoKG);
        Trucking.deliveryTruckTotalCargoYearMMBTU = (Trucking.deliveryTruckTotalCargoYearKG * unitConversion.KGtoMMBTU);

        const DeliveryData = {
            Voyage,
            Trucking
        }

        const BunkeringCost = {
            bunkeringPortIdleMFO: Number(req.body.bunkeringPortIdleMFO),
            bunkeringPortIdleMDO: Number(req.body.bunkeringPortIdleMDO),
            bunkeringPortIdleMGO: Number(req.body.bunkeringPortIdleMGO),
            bunkeringPortWorkingMFO: Number(req.body.bunkeringPortWorkingMFO),
            bunkeringPortWorkingMDO: Number(req.body.bunkeringPortWorkingMDO),
            bunkeringPortWorkingMGO: Number(req.body.bunkeringPortWorkingMGO),
            bunkeringAtSeaMFO: Number(req.body.bunkeringAtSeaMFO),
            bunkeringAtSeaMDO: Number(req.body.bunkeringAtSeaMDO),
            bunkeringAtSeaMGO: Number(req.body.bunkeringAtSeaMGO),
            bunkeringBunkerPriceIDR: Number(req.body.bunkeringBunkerPriceIDR),
            bunkeringBunkerPriceUSD: Number(req.body.bunkeringBunkerPriceUSD),
        }
        BunkeringCost.bunkeringConsumeTrip = ((BunkeringCost.bunkeringPortIdleMFO + BunkeringCost.bunkeringPortIdleMDO + BunkeringCost.bunkeringPortIdleMGO) * DeliveryData.Voyage.deliveryVoyageTotalLoadingTime) + ((BunkeringCost.bunkeringPortWorkingMFO + BunkeringCost.bunkeringPortWorkingMDO + BunkeringCost.bunkeringPortWorkingMGO) * DeliveryData.Voyage.deliveryVoyageDiscTotalLoadingTime) + ((BunkeringCost.bunkeringAtSeaMFO + BunkeringCost.bunkeringAtSeaMDO + BunkeringCost.bunkeringAtSeaMGO) * (DeliveryData.Voyage.deliveryVoyageLadenTo + DeliveryData.Voyage.deliveryVoyageBallastTo));
        BunkeringCost.bunkeringConsumeYear = (BunkeringCost.bunkeringConsumeTrip * DeliveryData.Voyage.deliveryVoyageNumberVesselRoundTripYear);
        BunkeringCost.bunkeringTotalBunkerCostTripIDR = (BunkeringCost.bunkeringBunkerPriceIDR * BunkeringCost.bunkeringConsumeTrip);
        BunkeringCost.bunkeringTotalBunkerCostYearIDR = (BunkeringCost.bunkeringBunkerPriceIDR * BunkeringCost.bunkeringConsumeYear);
        BunkeringCost.bunkeringTotalBunkerCostTripUSD = (BunkeringCost.bunkeringBunkerPriceUSD * BunkeringCost.bunkeringConsumeTrip);
        BunkeringCost.bunkeringTotalBunkerCostYearUSD = (BunkeringCost.bunkeringBunkerPriceUSD * BunkeringCost.bunkeringConsumeYear);
        
        
        const ManningCrewCost = {
            Barge: {
                bunkeringBargeLoadingMaster: Number(req.body.bunkeringBargeLoadingMaster),
                bunkeringBargeBoatswain: Number(req.body.bunkeringBargeBoatswain),
            },
            Tugboat: {
                bunkeringTugboatDeckMaster: Number(req.body.bunkeringTugboatDeckMaster),
                bunkeringTugboatDeckChiefOfficer: Number(req.body.bunkeringTugboatDeckChiefOfficer),
                bunkeringTugboatDeckOfficer: Number(req.body.bunkeringTugboatDeckOfficer),
                bunkeringTugboatDeckRadioOperator: Number(req.body.bunkeringTugboatDeckRadioOperator),
                bunkeringTugboatDeckBoatswain: Number(req.body.bunkeringTugboatDeckBoatswain),
                bunkeringTugboatDeckAbleBodied: Number(req.body.bunkeringTugboatDeckAbleBodied),
                bunkeringTugboatDeckOrdinarySeamen: Number(req.body.bunkeringTugboatDeckOrdinarySeamen),
                bunkeringTugboatDeckChef: Number(req.body.bunkeringTugboatDeckChef),
                bunkeringTugboatDeckAssistantChef: Number(req.body.bunkeringTugboatDeckAssistantChef),
                bunkeringTugboatDeckOthers: Number(req.body.bunkeringTugboatDeckOthers),
                bunkeringTugboatEngineChiefEngineer: Number(req.body.bunkeringTugboatEngineChiefEngineer),
                bunkeringTugboatEngineChiefMachinist: Number(req.body.bunkeringTugboatEngineChiefMachinist),
                bunkeringTugboatEngineMachinist: Number(req.body.bunkeringTugboatEngineMachinist),
                bunkeringTugboatEngineEngineForemen: Number(req.body.bunkeringTugboatEngineEngineForemen),
                bunkeringTugboatEngineOiler: Number(req.body.bunkeringTugboatEngineOiler),
                bunkeringTugboatEngineWiper: Number(req.body.bunkeringTugboatEngineWiper),
                bunkeringTugboatEngineOthers: Number(req.body.bunkeringTugboatEngineOthers),
            }
        }

        ManningCrewCost.TotalCrewCostMonth = (
            ManningCrewCost.Barge.bunkeringBargeLoadingMaster +
            ManningCrewCost.Barge.bunkeringBargeBoatswain +
            ManningCrewCost.Tugboat.bunkeringTugboatDeckMaster +
            ManningCrewCost.Tugboat.bunkeringTugboatDeckChiefOfficer +
            ManningCrewCost.Tugboat.bunkeringTugboatDeckOfficer +
            ManningCrewCost.Tugboat.bunkeringTugboatDeckRadioOperator +
            ManningCrewCost.Tugboat.bunkeringTugboatDeckBoatswain +
            ManningCrewCost.Tugboat.bunkeringTugboatDeckAbleBodied +
            ManningCrewCost.Tugboat.bunkeringTugboatDeckOrdinarySeamen +
            ManningCrewCost.Tugboat.bunkeringTugboatDeckChef +
            ManningCrewCost.Tugboat.bunkeringTugboatDeckAssistantChef +
            ManningCrewCost.Tugboat.bunkeringTugboatDeckOthers +
            ManningCrewCost.Tugboat.bunkeringTugboatEngineChiefEngineer +
            ManningCrewCost.Tugboat.bunkeringTugboatEngineChiefMachinist +
            ManningCrewCost.Tugboat.bunkeringTugboatEngineMachinist +
            ManningCrewCost.Tugboat.bunkeringTugboatEngineEngineForemen +
            ManningCrewCost.Tugboat.bunkeringTugboatEngineOiler +
            ManningCrewCost.Tugboat.bunkeringTugboatEngineWiper +
            ManningCrewCost.Tugboat.bunkeringTugboatEngineOthers
        );
        ManningCrewCost.TotalCrewCostYear = (ManningCrewCost.TotalCrewCostMonth * 12);
        const PortCost = {
            portCostChargeRoundTrip: Number(req.body.portCostChargeRoundTrip),
        }
        PortCost.portCostTotalPortChargeYear = (PortCost.portCostChargeRoundTrip * DeliveryData.Voyage.deliveryVoyageNumberVesselRoundTripYear);

        const CargoCostHandling = {
            portCostLasUnlasPOLTrip: Number(req.body.portCostLasUnlasPOLTrip),
            portCostLasUnlasPODTrip: Number(req.body.portCostLasUnlasPODTrip),
        }
        CargoCostHandling.totalCargoHandling = (CargoCostHandling.portCostLasUnlasPOLTrip + CargoCostHandling.portCostLasUnlasPODTrip)
        
        const VesselCharterCost = {
            vesselCharterCostCharterRateDay: Number(req.body.vesselCharterCostCharterRateDay),
        }
        VesselCharterCost.totalCharterRateYear = (VesselCharterCost.vesselCharterCostCharterRateDay*365);
        
        const InsuranceCost = {
            insuranceCostCrew: Number(req.body.insuranceCostCrew),
            insuranceCostShip: Number(req.body.insuranceCostShip),
            insuranceCostTotal: Number(req.body.insuranceCostTotal),
        }
        
        const DockRepairMTCost = {
            dockRepairMTDockingCost: Number(req.body.dockRepairMTDockingCost),
            dockRepairMTRepairStoreCost: Number(req.body.dockRepairMTRepairStoreCost),
            dockRepairMTLubeOilCost: Number(req.body.dockRepairMTLubeOilCost),
            dockRepairMTTotal: Number(req.body.dockRepairMTTotal),
        }
        
        const OtherCost = {
            otherCostVictually: Number(req.body.otherCostVictually),
            otherCostAdmin: Number(req.body.otherCostAdmin),
            otherCostTotal: Number(req.body.otherCostTotal),
        }
        const CostComponent = {
            BunkeringCost,
            ManningCrewCost,
            PortCost,
            CargoCostHandling,
            VesselCharterCost,
            InsuranceCost,
            DockRepairMTCost,
            OtherCost
        }
        CostComponent.TotalCostVesselLCTBargeUSD = (BunkeringCost.bunkeringTotalBunkerCostYearUSD + ManningCrewCost.TotalCrewCostYear + PortCost.portCostTotalPortChargeYear + CargoCostHandling.totalCargoHandling + VesselCharterCost.totalCharterRateYear + InsuranceCost.insuranceCostTotal + DockRepairMTCost.dockRepairMTTotal + OtherCost.otherCostTotal);
        CostComponent.TotalCostVesselLCTBargeIDR = (CostComponent.TotalCostVesselLCTBargeUSD * unitConversion.USDtoRP)
        
        const TruckingCost = {
            truckSkidCharterCost: (BasisData.basisDataRentalPriceDay * DeliveryData.Trucking.deliveryTruckNumberTruckingDelivery * 365),
            truckingFuelCost: (SkidTruck.skidTruckFuelConsume * BasisData.basisDataSolarPrice * DeliveryData.Trucking.deliveryTruckTotalTimeTurnAround * DeliveryData.Trucking.deliveryTruckTotalTripYear * DeliveryData.Trucking.deliveryTruckNumberTruckingDelivery),
            truckingDriverAssDriverCost: (365 * (BasisData.basisDataDriverSalaryDay + BasisData.basisDataAssistDriverSalaryDay) * DeliveryData.Trucking.deliveryTruckNumberTruckingDelivery),
            tollCost: 0,
            miscCost: (BasisData.basisDataMisEtc * DeliveryData.Voyage.deliveryVoyageNumberVesselRoundTripYear * DeliveryData.Trucking.deliveryTruckNumberTruckingDelivery),
            cargoInsurance: (0.05/100 * SkidTruck.skidTruckCargoCapacity * BasisData.basisDataLPGPriceRp * DeliveryData.Trucking.deliveryTruckNumberTruckingDelivery * DeliveryData.Voyage.deliveryVoyageNumberVesselRoundTripYear),
            truckInspLicenseCertifCost: (32000 * DeliveryData.Trucking.deliveryTruckNumberTruckingDelivery * 365),
            maintenanceCost: (65000 * DeliveryData.Trucking.deliveryTruckNumberTruckingDelivery * 365),
        }
        TruckingCost.DeliveryCost = (TruckingCost.truckSkidCharterCost + TruckingCost.truckingFuelCost + TruckingCost.truckingDriverAssDriverCost + TruckingCost.tollCost + TruckingCost.miscCost );
        TruckingCost.OtherCost = (TruckingCost.cargoInsurance + TruckingCost.truckInspLicenseCertifCost + TruckingCost.maintenanceCost );
        TruckingCost.TotalCostTruckingRP = (TruckingCost.DeliveryCost + TruckingCost.OtherCost);
        TruckingCost.TotalCostTruckingUSD = (TruckingCost.TotalCostTruckingRP / unitConversion.USDtoRP);
        
        const RealFreightRateVessel = {
            unitCostMassCargo_USD_KG: (CostComponent.TotalCostVesselLCTBargeUSD/DeliveryData.Voyage.deliveryVoyageTotalCargoYearKG),
            unitCostMassCargo_USD_MT: (CostComponent.TotalCostVesselLCTBargeUSD/DeliveryData.Voyage.deliveryVoyageTotalCargoYearKG / unitConversion.MTtoKG),
            unitCostMassCargo_IDR_KG: (CostComponent.TotalCostVesselLCTBargeIDR/DeliveryData.Voyage.deliveryVoyageTotalCargoYearKG),
            unitCostMassCargo_IDR_MT: (CostComponent.TotalCostVesselLCTBargeIDR/DeliveryData.Voyage.deliveryVoyageTotalCargoYearKG / unitConversion.MTtoKG),
            unitCost_USD_MMBTU: (CostComponent.TotalCostVesselLCTBargeUSD/DeliveryData.Voyage.deliveryVoyageTotalCargoYearMMBTU),
            unitCost_USD_MMBTU_NM: (CostComponent.TotalCostVesselLCTBargeUSD/DeliveryData.Voyage.deliveryVoyageTotalCargoYearMMBTU / DeliveryData.Voyage.deliveryVoyageDistanceNM),
            unitCostMassCargo_USD_KG_NM: (CostComponent.TotalCostVesselLCTBargeUSD/DeliveryData.Voyage.deliveryVoyageTotalCargoYearKG / DeliveryData.Voyage.deliveryVoyageDistanceNM),
            unitCostMassCargo_IDR_KG_NM: (CostComponent.TotalCostVesselLCTBargeIDR/DeliveryData.Voyage.deliveryVoyageTotalCargoYearKG / DeliveryData.Voyage.deliveryVoyageDistanceNM),
        }
        const RealFreightRateTruck = {
            unitCostMassCargo_USD_KG: (TruckingCost.TotalCostTruckingUSD/DeliveryData.Trucking.deliveryTruckTotalCargoYearKG),
            unitCostMassCargo_USD_MT: (TruckingCost.TotalCostTruckingUSD/DeliveryData.Trucking.deliveryTruckTotalCargoYearMT),
            unitCostMassCargo_IDR_KG: (TruckingCost.TotalCostTruckingRP/DeliveryData.Trucking.deliveryTruckTotalCargoYearKG),
            unitCostMassCargo_IDR_MT: (TruckingCost.TotalCostTruckingRP/DeliveryData.Trucking.deliveryTruckTotalCargoYearMT),
            unitCost_USD_MMBTU: (TruckingCost.TotalCostTruckingUSD/(DeliveryData.Trucking.deliveryTruckTotalCargoYearKG * unitConversion.KGtoMMBTU)),
            unitCost_USD_MMBTU_NM: (TruckingCost.TotalCostTruckingUSD/(DeliveryData.Trucking.deliveryTruckTotalCargoYearKG * unitConversion.KGtoMMBTU)) / (DeliveryData.Trucking.deliveryTruckDistanceTruckingKM * unitConversion.KMtoNauticalMILE),
            unitCostMassCargo_USD_KG_NM: (TruckingCost.TotalCostTruckingUSD/DeliveryData.Trucking.deliveryTruckTotalCargoYearKG) / (DeliveryData.Trucking.deliveryTruckDistanceTruckingKM * unitConversion.KMtoNauticalMILE),
            unitCostMassCargo_IDR_KG_NM: (TruckingCost.TotalCostTruckingRP/DeliveryData.Trucking.deliveryTruckTotalCargoYearKG) / (DeliveryData.Trucking.deliveryTruckDistanceTruckingKM * unitConversion.KMtoNauticalMILE),
        }
        const RealFreightRateVesselTruck = {
            unitCostMassCargo_USD_KG: (RealFreightRateTruck.unitCostMassCargo_USD_KG + RealFreightRateVessel.unitCostMassCargo_USD_KG),
            unitCostMassCargo_USD_MT: (RealFreightRateTruck.unitCostMassCargo_USD_MT + RealFreightRateVessel.unitCostMassCargo_USD_MT),
            unitCostMassCargo_IDR_KG: (RealFreightRateTruck.unitCostMassCargo_IDR_KG + RealFreightRateVessel.unitCostMassCargo_IDR_KG),
            unitCostMassCargo_IDR_MT: (RealFreightRateTruck.unitCostMassCargo_IDR_MT + RealFreightRateVessel.unitCostMassCargo_IDR_MT),
            unitCost_USD_MMBTU: (RealFreightRateTruck.unitCost_USD_MMBTU + RealFreightRateVessel.unitCost_USD_MMBTU),
            unitCost_USD_MMBTU_NM: (RealFreightRateTruck.unitCost_USD_MMBTU_NM + RealFreightRateVessel.unitCost_USD_MMBTU_NM),
            unitCostMassCargo_USD_KG_NM: (RealFreightRateTruck.unitCostMassCargo_USD_KG_NM + RealFreightRateVessel.unitCostMassCargo_USD_KG_NM),
            unitCostMassCargo_IDR_KG_NM: (RealFreightRateTruck.unitCostMassCargo_IDR_KG_NM + RealFreightRateVessel.unitCostMassCargo_IDR_KG_NM),
        }

        const profitMargin = Number(20/100);
        const proposedFreight_USD_KG =  (RealFreightRateVesselTruck.unitCostMassCargo_USD_KG +(RealFreightRateVesselTruck.unitCostMassCargo_USD_KG * profitMargin));
        const proposedFreight_IDR_KG =  (RealFreightRateVesselTruck.unitCostMassCargo_IDR_KG +(RealFreightRateVesselTruck.unitCostMassCargo_IDR_KG * profitMargin));
        const proposedFreight_USD_MMBTU = (RealFreightRateVesselTruck.unitCost_USD_MMBTU + (profitMargin * RealFreightRateVesselTruck.unitCost_USD_MMBTU));
        const ProposedFreightRateVesselTruck = {
            profitMargin,
            proposedFreight_USD_KG,
            proposedFreight_USD_MT: (RealFreightRateVesselTruck.unitCostMassCargo_USD_MT +(RealFreightRateVesselTruck.unitCostMassCargo_USD_MT * profitMargin)),
            proposedFreight_IDR_KG,
            proposedFreight_IDR_MT: (RealFreightRateVesselTruck.unitCostMassCargo_IDR_MT +(RealFreightRateVesselTruck.unitCostMassCargo_IDR_MT * profitMargin)),
            proposedFreight_USD_MMBTU,
            proposedFreight_USD_MMBTU_NM: (RealFreightRateVesselTruck.unitCost_USD_MMBTU_NM + (profitMargin * RealFreightRateVesselTruck.unitCost_USD_MMBTU_NM)),
            proposedFreight_USD_KG_NM: (RealFreightRateVesselTruck.unitCostMassCargo_USD_KG_NM + (profitMargin * RealFreightRateVesselTruck.unitCostMassCargo_USD_KG_NM)),
            proposedFreight_IDR_KG_NM: (RealFreightRateVesselTruck.unitCostMassCargo_IDR_KG_NM + (profitMargin * RealFreightRateVesselTruck.unitCostMassCargo_IDR_KG_NM)),
        }


        const transSkidTruckBarge = {
            ProjectID,
            DistributionArea,
            Barge,
            Tugboat,
            SkidTruck,
            BasisData,
            DeliveryData,
            CostComponent,
            TruckingCost,
            RealFreightRateVessel,
            RealFreightRateTruck,
            RealFreightRateVesselTruck,
            ProposedFreightRateVesselTruck,
        }

        if(req.body.skidTruckID){
            await TransSkidTruckBarge.updateOne(
                { _id: req.body.skidTruckID},
                {
                    $set: transSkidTruckBarge
                }
            );
            res.redirect(`/project/${ProjectID}/skidtruck`)
        }
        else{
            const newTransSkidTruckBarge = new TransSkidTruckBarge(transSkidTruckBarge);
            await newTransSkidTruckBarge.save()
            res.redirect(`/project/${ProjectID}/skidtruck`)
        }

    } catch (error) {
        res.render('error', {
            layout: 'layouts/main-layout',
            message: error,
            status: 400
        });
    }
}

const duplicateTransportationSkidTruckByID = async (req, res, next) => {
    try {
        const ProjectID = req.params.projectID;
        const skidTruckID = req.params.skidTruckID;
        const transSkidTruck = await TransSkidTruck.findOne({_id: ObjectID(skidTruckID)});
        if(transSkidTruck){
            transSkidTruck._id = ObjectID();
            TransSkidTruck.insertMany(transSkidTruck, (error, result)=>{
                res.redirect(`/project/${ProjectID}/skidtruck`)
            });
        }
        
        const transSkidTruckBarge = await TransSkidTruckBarge.findOne({_id: ObjectID(skidTruckID)});
        if(transSkidTruckBarge){
            transSkidTruckBarge._id = ObjectID();
            TransSkidTruckBarge.insertMany(transSkidTruckBarge, (error, result)=>{
                res.redirect(`/project/${ProjectID}/skidtruck`)
            });
        }

        const transSkidTruckOnly = await TransSkidTruckOnly.findOne({_id: ObjectID(skidTruckID)});
        if(transSkidTruckOnly){
            transSkidTruckOnly._id = ObjectID();
            TransSkidTruckOnly.insertMany(transSkidTruckOnly, (error, result)=>{
                res.redirect(`/project/${ProjectID}/skidtruck`)
            });
        }
        
    } catch (error) {
        res.render('error', {
            layout: 'layouts/main-layout',
            message: error,
            status: 400
        });
    }
}

const varDataTransSkidTruckOnly = async (dataSend, transSkidTruck) => {
    try{

        dataSend.distArea = transSkidTruck.DistributionArea.distArea;
        dataSend.distOrigin = transSkidTruck.DistributionArea.distOrigin;
        dataSend.distDestination = transSkidTruck.DistributionArea.distDestination;

        dataSend.skidTruckCargoCapacity = transSkidTruck.SkidTruck.skidTruckCargoCapacity;
        dataSend.skidTruckHeadSpec = transSkidTruck.SkidTruck.skidTruckHeadSpec;
        dataSend.skidTruckSpeed = transSkidTruck.SkidTruck.skidTruckSpeed;
        dataSend.skidTruckFuelConsume = transSkidTruck.SkidTruck.skidTruckFuelConsume;
        
        dataSend.basisDataLPGPriceUSD = transSkidTruck.BasisData.basisDataLPGPriceUSD;
        dataSend.basisDataLPGPriceRp = transSkidTruck.BasisData.basisDataLPGPriceRp;
        dataSend.basisDataLPGPriceRpKg = transSkidTruck.BasisData.basisDataLPGPriceRpKg;
        dataSend.basisDataSolarPrice = transSkidTruck.BasisData.basisDataSolarPrice;
        dataSend.basisDataRentalPriceMonth = transSkidTruck.BasisData.basisDataRentalPriceMonth;
        dataSend.basisDataRentalPriceDay = transSkidTruck.BasisData.basisDataRentalPriceDay;
        dataSend.basisDataDriverSalaryMonth = transSkidTruck.BasisData.basisDataDriverSalaryMonth;
        dataSend.basisDataDriverSalaryDay = transSkidTruck.BasisData.basisDataDriverSalaryDay;
        dataSend.basisDataAssistDriverSalaryMonth = transSkidTruck.BasisData.basisDataAssistDriverSalaryMonth;
        dataSend.basisDataAssistDriverSalaryDay = transSkidTruck.BasisData.basisDataAssistDriverSalaryDay;
        dataSend.basisDataMisEtc = transSkidTruck.BasisData.basisDataMisEtc;
        dataSend.basisDataRiskFactor = transSkidTruck.BasisData.basisDataRiskFactor;
        
        dataSend.deliveryDataOriginLPG = transSkidTruck.DeliveryData.deliveryDataOriginLPG;
        dataSend.deliveryDataDestinationSPBE = transSkidTruck.DeliveryData.deliveryDataDestinationSPBE;
        dataSend.deliveryDataDistanceTruckingOriginKM = transSkidTruck.DeliveryData.deliveryDataDistanceTruckingOriginKM;
        dataSend.deliveryDataDistanceTruckingOriginMile = transSkidTruck.DeliveryData.deliveryDataDistanceTruckingOriginMile;
        dataSend.deliveryDataTotalDistance = transSkidTruck.DeliveryData.deliveryDataTotalDistance;
        dataSend.deliveryDataLPGLoadUnload = transSkidTruck.DeliveryData.deliveryDataLPGLoadUnload;
        dataSend.deliveryDataRoundTripSailling = transSkidTruck.DeliveryData.deliveryDataRoundTripSailling;
        dataSend.deliveryDataNumberTrucking = transSkidTruck.DeliveryData.deliveryDataNumberTrucking;

        return dataSend;
    }
    catch(error){

    }
}

const varDataTransSkidTruck = async (dataSend, transSkidTruck) => {
    try{

        dataSend.distArea = transSkidTruck.DistributionArea.distArea;
        dataSend.distOrigin = transSkidTruck.DistributionArea.distOrigin;
        dataSend.distDestination = transSkidTruck.DistributionArea.distDestination;

        dataSend.skidTruckCargoCapacity = transSkidTruck.SkidTruck.skidTruckCargoCapacity;
        dataSend.skidTruckHeadSpec = transSkidTruck.SkidTruck.skidTruckHeadSpec;
        dataSend.skidTruckSpeed = transSkidTruck.SkidTruck.skidTruckSpeed;
        dataSend.skidTruckFuelConsume = transSkidTruck.SkidTruck.skidTruckFuelConsume;
        
        dataSend.basisDataLPGPriceUSD = transSkidTruck.BasisData.basisDataLPGPriceUSD;
        dataSend.basisDataLPGPriceRp = transSkidTruck.BasisData.basisDataLPGPriceRp;
        dataSend.basisDataLPGPriceRpKg = transSkidTruck.BasisData.basisDataLPGPriceRpKg;
        dataSend.basisDataSolarPrice = transSkidTruck.BasisData.basisDataSolarPrice;
        dataSend.basisDataRentalPriceMonth = transSkidTruck.BasisData.basisDataRentalPriceMonth;
        dataSend.basisDataRentalPriceDay = transSkidTruck.BasisData.basisDataRentalPriceDay;
        dataSend.basisDataDriverSalaryMonth = transSkidTruck.BasisData.basisDataDriverSalaryMonth;
        dataSend.basisDataDriverSalaryDay = transSkidTruck.BasisData.basisDataDriverSalaryDay;
        dataSend.basisDataAssistDriverSalaryMonth = transSkidTruck.BasisData.basisDataAssistDriverSalaryMonth;
        dataSend.basisDataAssistDriverSalaryDay = transSkidTruck.BasisData.basisDataAssistDriverSalaryDay;
        dataSend.basisDataMisEtc = transSkidTruck.BasisData.basisDataMisEtc;
        dataSend.basisDataLCTRate = transSkidTruck.BasisData.basisDataLCTRate;
        dataSend.basisDataLCTRateEtc = transSkidTruck.BasisData.basisDataLCTRateEtc;
        dataSend.basisDataTotalCost = transSkidTruck.BasisData.basisDataTotalCost;
        dataSend.basisDataRiskFactor = transSkidTruck.BasisData.basisDataRiskFactor;
        
        dataSend.deliveryDataOriginLPG = transSkidTruck.DeliveryData.deliveryDataOriginLPG;
        dataSend.deliveryDataOriginPort = transSkidTruck.DeliveryData.deliveryDataOriginPort;
        dataSend.deliveryDataDestinationPort = transSkidTruck.DeliveryData.deliveryDataDestinationPort;
        dataSend.deliveryDataDestinationSPBE = transSkidTruck.DeliveryData.deliveryDataDestinationSPBE;
        dataSend.deliveryDataDistanceTruckingOriginKM = transSkidTruck.DeliveryData.deliveryDataDistanceTruckingOriginKM;
        dataSend.deliveryDataDistanceTruckingOriginMile = transSkidTruck.DeliveryData.deliveryDataDistanceTruckingOriginMile;
        dataSend.deliveryDataDistanceSailFerryPortKM = transSkidTruck.DeliveryData.deliveryDataDistanceSailFerryPortKM;
        dataSend.deliveryDataDistanceSailFerryPortMile = transSkidTruck.DeliveryData.deliveryDataDistanceSailFerryPortMile;
        dataSend.deliveryDataDistanceTruckingPortSpbeKM = transSkidTruck.DeliveryData.deliveryDataDistanceTruckingPortSpbeKM;
        dataSend.deliveryDataDistanceTruckingPortSpbeMile = transSkidTruck.DeliveryData.deliveryDataDistanceTruckingPortSpbeMile;
        dataSend.deliveryDataTotalDistance = transSkidTruck.DeliveryData.deliveryDataTotalDistance;
        dataSend.deliveryDataLPGLoadUnload = transSkidTruck.DeliveryData.deliveryDataLPGLoadUnload;
        dataSend.deliveryDataRoundTripSailling = transSkidTruck.DeliveryData.deliveryDataRoundTripSailling;
        dataSend.deliveryDataNumberTrucking = transSkidTruck.DeliveryData.deliveryDataNumberTrucking;

        return dataSend;
    }
    catch(error){

    }
}

const varDataTransSkidTruckBarge = async (dataSend, transSkidTruckBarge) => {
    try{
        dataSend.distArea = transSkidTruckBarge.DistributionArea.distArea
        dataSend.distOrigin = transSkidTruckBarge.DistributionArea.distOrigin
        dataSend.distDestination = transSkidTruckBarge.DistributionArea.distDestination
        
        dataSend.bargeVesselName = transSkidTruckBarge.Barge.bargeVesselName
        dataSend.bargeTypeVessel = transSkidTruckBarge.Barge.bargeTypeVessel
        dataSend.bargeCargoCapacityCBM = transSkidTruckBarge.Barge.bargeCargoCapacityCBM
        dataSend.bargeCargoCapacityMT = transSkidTruckBarge.Barge.bargeCargoCapacityMT
        dataSend.bargeIMONumber = transSkidTruckBarge.Barge.bargeIMONumber
        dataSend.bargeMMSINumber = transSkidTruckBarge.Barge.bargeMMSINumber
        dataSend.bargeCallSign = transSkidTruckBarge.Barge.bargeCallSign
        dataSend.bargeGrossTonnage = transSkidTruckBarge.Barge.bargeGrossTonnage
        dataSend.bargeSummerDWT = transSkidTruckBarge.Barge.bargeSummerDWT
        dataSend.bargeLengthBreadth = transSkidTruckBarge.Barge.bargeLengthBreadth
        dataSend.bargeYearBuilt = transSkidTruckBarge.Barge.bargeYearBuilt
        dataSend.bargeShipAge = transSkidTruckBarge.Barge.bargeShipAge
        dataSend.bargeCrewNumber = transSkidTruckBarge.Barge.bargeCrewNumber
        dataSend.bargeSFOC = transSkidTruckBarge.Barge.bargeSFOC
        
        dataSend.tugboatVesselName = transSkidTruckBarge.Tugboat.tugboatVesselName
        dataSend.tugboatTypeVessel = transSkidTruckBarge.Tugboat.tugboatTypeVessel
        dataSend.tugboatIMONumber = transSkidTruckBarge.Tugboat.tugboatIMONumber
        dataSend.tugboatMMSINumber = transSkidTruckBarge.Tugboat.tugboatMMSINumber
        dataSend.tugboatCallSign = transSkidTruckBarge.Tugboat.tugboatCallSign
        dataSend.tugboatGrossTonnage = transSkidTruckBarge.Tugboat.tugboatGrossTonnage
        dataSend.tugboatSummerDWT = transSkidTruckBarge.Tugboat.tugboatSummerDWT
        dataSend.tugboatLengthBreadth = transSkidTruckBarge.Tugboat.tugboatLengthBreadth
        dataSend.tugboatYearBuilt = transSkidTruckBarge.Tugboat.tugboatYearBuilt
        dataSend.tugboatShipAge = transSkidTruckBarge.Tugboat.tugboatShipAge
        dataSend.tugboatCrewNumber = transSkidTruckBarge.Tugboat.tugboatCrewNumber
        dataSend.tugboatSFOC = transSkidTruckBarge.Tugboat.tugboatSFOC
        
        dataSend.skidTruckCargoCapacity = transSkidTruckBarge.SkidTruck.skidTruckCargoCapacity
        dataSend.skidTruckHeadSpec = transSkidTruckBarge.SkidTruck.skidTruckHeadSpec
        dataSend.skidTruckSpeed = transSkidTruckBarge.SkidTruck.skidTruckSpeed
        dataSend.skidTruckFuelConsume = transSkidTruckBarge.SkidTruck.skidTruckFuelConsume

        dataSend.basisDataLPGPriceUSD = transSkidTruckBarge.BasisData.basisDataLPGPriceUSD
        dataSend.basisDataLPGPriceRp = transSkidTruckBarge.BasisData.basisDataLPGPriceRp
        dataSend.basisDataLPGPriceRpKg = transSkidTruckBarge.BasisData.basisDataLPGPriceRpKg
        dataSend.basisDataSolarPrice = transSkidTruckBarge.BasisData.basisDataSolarPrice
        dataSend.basisDataRentalPriceMonth = transSkidTruckBarge.BasisData.basisDataRentalPriceMonth
        dataSend.basisDataRentalPriceDay = transSkidTruckBarge.BasisData.basisDataRentalPriceDay
        dataSend.basisDataDriverSalaryMonth = transSkidTruckBarge.BasisData.basisDataDriverSalaryMonth
        dataSend.basisDataDriverSalaryDay = transSkidTruckBarge.BasisData.basisDataDriverSalaryDay
        dataSend.basisDataAssistDriverSalaryMonth = transSkidTruckBarge.BasisData.basisDataAssistDriverSalaryMonth
        dataSend.basisDataAssistDriverSalaryDay = transSkidTruckBarge.BasisData.basisDataAssistDriverSalaryDay
        dataSend.basisDataMisEtc = transSkidTruckBarge.BasisData.basisDataMisEtc
        dataSend.basisDataRiskFactor = transSkidTruckBarge.BasisData.basisDataRiskFactor
        
        dataSend.deliveryVoyagePortLoading = transSkidTruckBarge.DeliveryData.Voyage.deliveryVoyagePortLoading
        dataSend.deliveryVoyagePortDischarge = transSkidTruckBarge.DeliveryData.Voyage.deliveryVoyagePortDischarge
        dataSend.deliveryVoyageDistanceNM = transSkidTruckBarge.DeliveryData.Voyage.deliveryVoyageDistanceNM
        dataSend.deliveryVoyageSpeedVessel = transSkidTruckBarge.DeliveryData.Voyage.deliveryVoyageSpeedVessel
        dataSend.deliveryVoyageLadenTo = transSkidTruckBarge.DeliveryData.Voyage.deliveryVoyageLadenTo
        dataSend.deliveryVoyageBallastTo = transSkidTruckBarge.DeliveryData.Voyage.deliveryVoyageBallastTo
        dataSend.deliveryVoyagePumpPort1 = transSkidTruckBarge.DeliveryData.Voyage.deliveryVoyagePumpPort1
        dataSend.deliveryVoyagePumpPort2 = transSkidTruckBarge.DeliveryData.Voyage.deliveryVoyagePumpPort2
        dataSend.deliveryVoyageTotalLoadingTime = transSkidTruckBarge.DeliveryData.Voyage.deliveryVoyageTotalLoadingTime
        dataSend.deliveryVoyageEnterWaitTimePOL = transSkidTruckBarge.DeliveryData.Voyage.deliveryVoyageEnterWaitTimePOL
        dataSend.deliveryVoyageDiscPumpPort1 = transSkidTruckBarge.DeliveryData.Voyage.deliveryVoyageDiscPumpPort1
        dataSend.deliveryVoyageDiscTotalLoadingTime = transSkidTruckBarge.DeliveryData.Voyage.deliveryVoyageDiscTotalLoadingTime
        dataSend.deliveryVoyageDiscEnterWaitTimePOL = transSkidTruckBarge.DeliveryData.Voyage.deliveryVoyageDiscEnterWaitTimePOL
        dataSend.deliveryVoyageCalendarDays = transSkidTruckBarge.DeliveryData.Voyage.deliveryVoyageCalendarDays
        dataSend.deliveryVoyageDockingEtc = transSkidTruckBarge.DeliveryData.Voyage.deliveryVoyageDockingEtc
        dataSend.deliveryVoyageMobilization = transSkidTruckBarge.DeliveryData.Voyage.deliveryVoyageMobilization
        
        dataSend.deliveryTruckOrigin = transSkidTruckBarge.DeliveryData.Trucking.deliveryTruckOrigin
        dataSend.deliveryTruckDestination = transSkidTruckBarge.DeliveryData.Trucking.deliveryTruckDestination
        dataSend.deliveryTruckLPGFillRate = transSkidTruckBarge.DeliveryData.Trucking.deliveryTruckLPGFillRate
        dataSend.deliveryTruckNumberLPGFill = transSkidTruckBarge.DeliveryData.Trucking.deliveryTruckNumberLPGFill
        dataSend.deliveryTruckLPGDiscRate = transSkidTruckBarge.DeliveryData.Trucking.deliveryTruckLPGDiscRate
        dataSend.deliveryTruckNumberConnSPBE = transSkidTruckBarge.DeliveryData.Trucking.deliveryTruckNumberConnSPBE
        dataSend.deliveryTruckDistanceTruckingKM = transSkidTruckBarge.DeliveryData.Trucking.deliveryTruckDistanceTruckingKM
        dataSend.deliveryTruckDistanceTruckingMile = transSkidTruckBarge.DeliveryData.Trucking.deliveryTruckDistanceTruckingMile
        dataSend.deliveryTruckTotalTruckingTimeTrip = transSkidTruckBarge.DeliveryData.Trucking.deliveryTruckTotalTruckingTimeTrip
        dataSend.deliveryTruckNumberTruckingDelivery = transSkidTruckBarge.DeliveryData.Trucking.deliveryTruckNumberTruckingDelivery
        
        dataSend.bunkeringPortIdleMFO = transSkidTruckBarge.CostComponent.BunkeringCost.bunkeringPortIdleMFO
        dataSend.bunkeringPortIdleMDO = transSkidTruckBarge.CostComponent.BunkeringCost.bunkeringPortIdleMDO
        dataSend.bunkeringPortIdleMGO = transSkidTruckBarge.CostComponent.BunkeringCost.bunkeringPortIdleMGO
        dataSend.bunkeringPortWorkingMFO = transSkidTruckBarge.CostComponent.BunkeringCost.bunkeringPortWorkingMFO
        dataSend.bunkeringPortWorkingMDO = transSkidTruckBarge.CostComponent.BunkeringCost.bunkeringPortWorkingMDO
        dataSend.bunkeringPortWorkingMGO = transSkidTruckBarge.CostComponent.BunkeringCost.bunkeringPortWorkingMGO
        dataSend.bunkeringAtSeaMFO = transSkidTruckBarge.CostComponent.BunkeringCost.bunkeringAtSeaMFO
        dataSend.bunkeringAtSeaMDO = transSkidTruckBarge.CostComponent.BunkeringCost.bunkeringAtSeaMDO
        dataSend.bunkeringAtSeaMGO = transSkidTruckBarge.CostComponent.BunkeringCost.bunkeringAtSeaMGO
        dataSend.bunkeringBunkerPriceIDR = transSkidTruckBarge.CostComponent.BunkeringCost.bunkeringBunkerPriceIDR
        dataSend.bunkeringBunkerPriceUSD = transSkidTruckBarge.CostComponent.BunkeringCost.bunkeringBunkerPriceUSD
        
        dataSend.bunkeringBargeLoadingMaster = transSkidTruckBarge.CostComponent.ManningCrewCost.Barge.bunkeringBargeLoadingMaster
        dataSend.bunkeringBargeBoatswain = transSkidTruckBarge.CostComponent.ManningCrewCost.Barge.bunkeringBargeBoatswain
        
        dataSend.bunkeringTugboatDeckMaster = transSkidTruckBarge.CostComponent.ManningCrewCost.Tugboat.bunkeringTugboatDeckMaster
        dataSend.bunkeringTugboatDeckChiefOfficer = transSkidTruckBarge.CostComponent.ManningCrewCost.Tugboat.bunkeringTugboatDeckChiefOfficer
        dataSend.bunkeringTugboatDeckOfficer = transSkidTruckBarge.CostComponent.ManningCrewCost.Tugboat.bunkeringTugboatDeckOfficer
        dataSend.bunkeringTugboatDeckRadioOperator = transSkidTruckBarge.CostComponent.ManningCrewCost.Tugboat.bunkeringTugboatDeckRadioOperator
        dataSend.bunkeringTugboatDeckBoatswain = transSkidTruckBarge.CostComponent.ManningCrewCost.Tugboat.bunkeringTugboatDeckBoatswain
        dataSend.bunkeringTugboatDeckAbleBodied = transSkidTruckBarge.CostComponent.ManningCrewCost.Tugboat.bunkeringTugboatDeckAbleBodied
        dataSend.bunkeringTugboatDeckOrdinarySeamen = transSkidTruckBarge.CostComponent.ManningCrewCost.Tugboat.bunkeringTugboatDeckOrdinarySeamen
        dataSend.bunkeringTugboatDeckChef = transSkidTruckBarge.CostComponent.ManningCrewCost.Tugboat.bunkeringTugboatDeckChef
        dataSend.bunkeringTugboatDeckAssistantChef = transSkidTruckBarge.CostComponent.ManningCrewCost.Tugboat.bunkeringTugboatDeckAssistantChef
        dataSend.bunkeringTugboatDeckOthers = transSkidTruckBarge.CostComponent.ManningCrewCost.Tugboat.bunkeringTugboatDeckOthers
        dataSend.bunkeringTugboatEngineChiefEngineer = transSkidTruckBarge.CostComponent.ManningCrewCost.Tugboat.bunkeringTugboatEngineChiefEngineer
        dataSend.bunkeringTugboatEngineChiefMachinist = transSkidTruckBarge.CostComponent.ManningCrewCost.Tugboat.bunkeringTugboatEngineChiefMachinist
        dataSend.bunkeringTugboatEngineMachinist = transSkidTruckBarge.CostComponent.ManningCrewCost.Tugboat.bunkeringTugboatEngineMachinist
        dataSend.bunkeringTugboatEngineEngineForemen = transSkidTruckBarge.CostComponent.ManningCrewCost.Tugboat.bunkeringTugboatEngineEngineForemen
        dataSend.bunkeringTugboatEngineOiler = transSkidTruckBarge.CostComponent.ManningCrewCost.Tugboat.bunkeringTugboatEngineOiler
        dataSend.bunkeringTugboatEngineWiper = transSkidTruckBarge.CostComponent.ManningCrewCost.Tugboat.bunkeringTugboatEngineWiper
        dataSend.bunkeringTugboatEngineOthers = transSkidTruckBarge.CostComponent.ManningCrewCost.Tugboat.bunkeringTugboatEngineOthers
        
        dataSend.portCostChargeRoundTrip = transSkidTruckBarge.CostComponent.PortCost.portCostChargeRoundTrip
        
        dataSend.portCostLasUnlasPOLTrip = transSkidTruckBarge.CostComponent.CargoCostHandling.portCostLasUnlasPOLTrip
        dataSend.portCostLasUnlasPODTrip = transSkidTruckBarge.CostComponent.CargoCostHandling.portCostLasUnlasPODTrip
        
        dataSend.vesselCharterCostCharterRateDay = transSkidTruckBarge.CostComponent.VesselCharterCost.vesselCharterCostCharterRateDay
        
        dataSend.insuranceCostCrew = transSkidTruckBarge.CostComponent.InsuranceCost.insuranceCostCrew
        dataSend.insuranceCostShip = transSkidTruckBarge.CostComponent.InsuranceCost.insuranceCostShip
        dataSend.insuranceCostTotal = transSkidTruckBarge.CostComponent.InsuranceCost.insuranceCostTotal
        
        dataSend.dockRepairMTDockingCost = transSkidTruckBarge.CostComponent.DockRepairMTCost.dockRepairMTDockingCost
        dataSend.dockRepairMTRepairStoreCost = transSkidTruckBarge.CostComponent.DockRepairMTCost.dockRepairMTRepairStoreCost
        dataSend.dockRepairMTLubeOilCost = transSkidTruckBarge.CostComponent.DockRepairMTCost.dockRepairMTLubeOilCost
        dataSend.dockRepairMTTotal = transSkidTruckBarge.CostComponent.DockRepairMTCost.dockRepairMTTotal
        
        dataSend.otherCostVictually = transSkidTruckBarge.CostComponent.OtherCost.otherCostVictually
        dataSend.otherCostAdmin = transSkidTruckBarge.CostComponent.OtherCost.otherCostAdmin
        dataSend.otherCostTotal = transSkidTruckBarge.CostComponent.OtherCost.otherCostTotal

        return dataSend;
    }
    catch(error){

    }
}

const editTransportationSkidTruckByID = async (req, res, next) => {
    try {
        const ProjectID = req.params.projectID;
        const skidTruckID = req.params.skidTruckID;
        const transSkidTruck = await TransSkidTruck.findOne({_id: ObjectID(skidTruckID)});
        if(transSkidTruck){
            let dataSend = {
                layout: 'layouts/main-layout',
                title: 'Form LPG Transportation',
                ProjectID,
                transSkidTruck,
                typeCase: {
                    name: 'Case 1',
                    slug: 'case-1'
                },
                unitConversion,
                skidTruckID
            }

            res.render('SkidTruck/form-case-1', await varDataTransSkidTruck(dataSend, transSkidTruck));
        }
        
        const transSkidTruckBarge = await TransSkidTruckBarge.findOne({_id: ObjectID(skidTruckID)});
        if(transSkidTruckBarge){
            let dataSend = {
                layout: 'layouts/main-layout',
                title: 'Form LPG Transportation',
                ProjectID,
                transSkidTruckBarge,
                typeCase: {
                    name: 'Case 2',
                    slug: 'case-2'
                },
                unitConversion,
                skidTruckID
            }
            res.render('SkidTruck/form-case-2', await varDataTransSkidTruckBarge(dataSend, transSkidTruckBarge));
        }

        const transSkidTruckOnly = await TransSkidTruckOnly.findOne({_id: ObjectID(skidTruckID)});
        if(transSkidTruckOnly){
            let dataSend = {
                layout: 'layouts/main-layout',
                title: 'Form LPG Transportation',
                ProjectID,
                transSkidTruckOnly,
                typeCase: {
                    name: 'Case 3',
                    slug: 'case-3'
                },
                unitConversion,
                skidTruckID
            }
            res.render('SkidTruck/form-case-3', await varDataTransSkidTruckOnly(dataSend, transSkidTruckOnly));
        }
    } catch (error) {
        res.render('error', {
            layout: 'layouts/main-layout',
            message: error,
            status: 400
        });
    }
}
const updateTransportationSkidTruckByID = async (req, res, next) => {
    try {
        
    } catch (error) {
        res.render('error', {
            layout: 'layouts/main-layout',
            message: error,
            status: 400
        });
    }
}
const deleteTransportationSkidTruckByID = async (req, res, next) => {
    try {
        const ProjectID = req.params.projectID;
        const skidTruckID = req.params.skidTruckID;

        const transSkidTruck = await TransSkidTruck.findOne({_id: ObjectID(skidTruckID)});
        if(transSkidTruck){
            await TransSkidTruck.deleteOne({_id : ObjectID(skidTruckID)});
            res.redirect(`/project/${ProjectID}/skidtruck`)
        }
        
        const transSkidTruckBarge = await TransSkidTruckBarge.findOne({_id: ObjectID(skidTruckID)});
        if(transSkidTruckBarge){
            await TransSkidTruckBarge.deleteOne({_id : ObjectID(skidTruckID)});
            res.redirect(`/project/${ProjectID}/skidtruck`)
        }

        const transSkidTruckOnly = await TransSkidTruckOnly.findOne({_id: ObjectID(skidTruckID)});
        if(transSkidTruckOnly){
            await TransSkidTruckOnly.deleteOne({_id : ObjectID(skidTruckID)});
            res.redirect(`/project/${ProjectID}/skidtruck`)
        }

        
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
    getProjectSkidTruckV2ByID,
    getFormSkidTruckV2,
    getFormSkidTruckV2ByCase,
    getFormSkidTruck,
    getFormSkidTruckByCase,
    createTransportationSkidTruck,
    createTransportationSkidTruck2,
    duplicateTransportationSkidTruckByID,
    deleteTransportationSkidTruckByID,
    updateTransportationSkidTruckByID,
    editTransportationSkidTruckByID,
    createTransportationSkidTruck3,
    createTransportationSkidTruckV2_1
}