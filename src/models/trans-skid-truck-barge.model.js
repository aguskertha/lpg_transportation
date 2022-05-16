const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const transSkidTruckBargeSchema = new Schema({
    ProjectID: {
        type: String,
        required: true
    },
    DistributionArea: {
        distArea:{
            type: String,
            required: true
        },
        distOrigin:{
            type: String,
            required: true
        },
        distDestination:{
            type: String,
            required: true
        },
    },
    Barge:{
        bargeVesselName: {
            type: String,
            required: true
        },
        bargeTypeVessel:{
            type: String,
            required: false
        },
        bargeCargoCapacityCBM:{
            type: Number,
            required: true
        },
        bargeCargoCapacityMT:{
            type: String,
            required: false
        },
        bargeIMONumber:{
            type: String,
            required: false
        },
        bargeMMSINumber:{
            type: String,
            required: false
        },
        bargeCallSign:{
            type: String,
            required: false
        },
        bargeGrossTonnage:{
            type: String,
            required: false
        },
        bargeSummerDWT:{
            type: String,
            required: false
        },
        bargeLengthBreadth:{
            type: String,
            required: false
        },
        bargeYearBuilt:{
            type: String,
            required: false
        },
        bargeShipAge:{
            type: String,
            required: true
        },
        bargeCrewNumber:{
            type: String,
            required: true
        },
        bargeSFOC:{
            type: String,
            required: true
        }
    },
    Tugboat:{
        tugboatVesselName: {
            type: String,
            required: true
        },
        tugboatTypeVessel:{
            type: String,
            required: false
        },
        tugboatIMONumber:{
            type: String,
            required: false
        },
        tugboatMMSINumber:{
            type: String,
            required: false
        },
        tugboatCallSign:{
            type: String,
            required: false
        },
        tugboatGrossTonnage:{
            type: String,
            required: false
        },
        tugboatSummerDWT:{
            type: String,
            required: false
        },
        tugboatLengthBreadth:{
            type: String,
            required: false
        },
        tugboatYearBuilt:{
            type: String,
            required: false
        },
        tugboatShipAge:{
            type: String,
            required: true
        },
        tugboatCrewNumber:{
            type: String,
            required: true
        },
        tugboatSFOC:{
            type: String,
            required: true
        }
    },
    SkidTruck:{
        skidTruckCargoCapacity: {
            type: Number,
            required: true
        },
        skidTruckHeadSpec: {
            type: String,
        },
        skidTruckSpeed: {
            type: Number,
            required: true
        },
        skidTruckFuelConsume: {
            type: Number,
            required: true
        },
    },
    BasisData:{
        basisDataLPGPriceUSD: {
            type: Number,
            required: true
        },
        basisDataLPGPriceRp: {
            type: Number,
            required: true
        },
        basisDataLPGPriceRpKg: {
            type: Number,
            required: true
        },
        basisDataSolarPrice: {
            type: Number,
            required: true
        },
        basisDataRentalPriceMonth: {
            type: Number,
            required: true
        },
        basisDataRentalPriceDay: {
            type: Number,
            required: true
        },
        basisDataDriverSalaryMonth: {
            type: Number,
            required: true
        },
        basisDataDriverSalaryDay: {
            type: Number,
            required: true
        },
        basisDataAssistDriverSalaryMonth: {
            type: Number,
            required: true
        },
        basisDataAssistDriverSalaryDay: {
            type: Number,
            required: true
        },
        basisDataMisEtc: {
            type: Number,
            required: true
        },
        basisDataRiskFactor: {
            type: Number,
            required: true
        },
    },
    DeliveryData:{
        Voyage: {
            deliveryVoyagePortLoading: {
                type: String,
                required: true
            },
            deliveryVoyagePortDischarge: {
                type: String,
                required: true
            },
            deliveryVoyageDistanceNM: {
                type: Number,
                required: true
            },
            deliveryVoyageSpeedVessel: {
                type: Number,
                required: true
            },
            deliveryVoyageLadenTo: {
                type: Number,
                required: true
            },
            deliveryVoyageBallastTo: {
                type: Number,
                required: true
            },
            deliveryVoyagePumpPort1: {
                type: Number,
                required: true
            },
            deliveryVoyagePumpPort2: {
                type: Number,
                required: true
            },
            deliveryVoyageTotalLoadingTime: {
                type: Number,
                required: true
            },
            deliveryVoyageEnterWaitTimePOL: {
                type: Number,
                required: true
            },
            deliveryVoyageDiscPumpPort1: {
                type: Number,
                required: true
            },
            deliveryVoyageDiscTotalLoadingTime: {
                type: Number,
                required: true
            },
            deliveryVoyageDiscEnterWaitTimePOL: {
                type: Number,
                required: true
            },
            deliveryVoyageCalendarDays: {
                type: Number,
                required: true
            },
            deliveryVoyageDockingEtc: {
                type: Number,
                required: true
            },
            deliveryVoyageMobilization: {
                type: Number,
                required: true
            },
            deliveryVoyageTotalTimeTurnAroundDay: {
                type: Number,
                required: true
            },
            deliveryVoyageTotalTimeTurnAroundHour: {
                type: Number,
                required: true
            },
            deliveryVoyageEffectiveDay: {
                type: Number,
                required: true
            },
            deliveryVoyageNumberVesselRoundTripYear: {
                type: Number,
                required: true
            },
            deliveryVoyageIdleDaysYear: {
                type: Number,
                required: true
            },
            deliveryVoyageTotalCargoYearMT: {
                type: Number,
                required: true
            },
            deliveryVoyageTotalCargoYearKG: {
                type: Number,
                required: true
            },
            deliveryVoyageTotalCargoYearMMBTU: {
                type: Number,
                required: true
            },
        },
        Trucking:{
            deliveryTruckOrigin: {
                type: String,
                required: true
            },
            deliveryTruckDestination: {
                type: String,
                required: true
            },
            deliveryTruckLPGFillRate: {
                type: Number,
                required: true
            },
            deliveryTruckNumberLPGFill: {
                type: Number,
                required: true
            },
            deliveryTruckLPGDiscRate: {
                type: Number,
                required: true
            },
            deliveryTruckNumberConnSPBE: {
                type: Number,
                required: true
            },
            deliveryTruckDistanceTruckingKM: {
                type: Number,
                required: true
            },
            deliveryTruckDistanceTruckingMile: {
                type: Number,
                required: true
            },
            deliveryTruckTotalTruckingTimeTrip: {
                type: Number,
                required: true
            },
            deliveryTruckNumberTruckingDelivery: {
                type: Number,
                required: true
            },
            deliveryTruckTotalTimeFillLPG: {
                type: Number,
                required: true
            },
            deliveryTruckTotalDiscTimeFillLPG: {
                type: Number,
                required: true
            },
            deliveryTruckTotalTimeTurnAround: {
                type: Number,
                required: true
            },
            deliveryTruckTotalCargoDelivery: {
                type: Number,
                required: true
            },
            deliveryTruckTotalTripYear: {
                type: Number,
                required: true
            },
            deliveryTruckTotalCargoYearMT: {
                type: Number,
                required: true
            },
            deliveryTruckTotalCargoYearKG: {
                type: Number,
                required: true
            },
            deliveryTruckTotalCargoYearMMBTU: {
                type: Number,
                required: true
            },
        }
    },
    CostComponent:{
        BunkeringCost:{
            bunkeringPortIdleMFO: {
                type: Number,
                required: true
            },
            bunkeringPortIdleMDO: {
                type: Number,
                required: true
            },
            bunkeringPortIdleMGO: {
                type: Number,
                required: true
            },
            bunkeringPortWorkingMFO: {
                type: Number,
                required: true
            },
            bunkeringPortWorkingMDO: {
                type: Number,
                required: true
            },
            bunkeringPortWorkingMGO: {
                type: Number,
                required: true
            },
            bunkeringAtSeaMFO: {
                type: Number,
                required: true
            },
            bunkeringAtSeaMDO: {
                type: Number,
                required: true
            },
            bunkeringAtSeaMGO: {
                type: Number,
                required: true
            },
            bunkeringBunkerPriceIDR: {
                type: Number,
                required: true
            },
            bunkeringBunkerPriceUSD: {
                type: Number,
                required: true
            },
            bunkeringConsumeTrip: {
                type: Number,
                required: true
            },
            bunkeringConsumeYear: {
                type: Number,
                required: true
            },
            bunkeringTotalBunkerCostTripIDR: {
                type: Number,
                required: true
            },
            bunkeringTotalBunkerCostYearIDR: {
                type: Number,
                required: true
            },
            bunkeringTotalBunkerCostTripUSD: {
                type: Number,
                required: true
            },
            bunkeringTotalBunkerCostYearUSD: {
                type: Number,
                required: true
            },
        },
        ManningCrewCost:{
            Barge: {
                bunkeringBargeLoadingMaster: {
                    type: Number,
                    required: true
                },
                bunkeringBargeBoatswain: {
                    type: Number,
                    required: true
                },
            },
            Tugboat: {
                bunkeringTugboatDeckMaster: {
                    type: Number,
                    required: true
                },
                bunkeringTugboatDeckChiefOfficer: {
                    type: Number,
                    required: true
                },
                bunkeringTugboatDeckOfficer: {
                    type: Number,
                    required: true
                },
                bunkeringTugboatDeckRadioOperator: {
                    type: Number,
                    required: true
                },
                bunkeringTugboatDeckBoatswain: {
                    type: Number,
                    required: true
                },
                bunkeringTugboatDeckAbleBodied: {
                    type: Number,
                    required: true
                },
                bunkeringTugboatDeckOrdinarySeamen: {
                    type: Number,
                    required: true
                },
                bunkeringTugboatDeckChef: {
                    type: Number,
                    required: true
                },
                bunkeringTugboatDeckAssistantChef: {
                    type: Number,
                    required: true
                },
                bunkeringTugboatDeckOthers: {
                    type: Number,
                    required: true
                },
                bunkeringTugboatEngineChiefEngineer: {
                    type: Number,
                    required: true
                },
                bunkeringTugboatEngineChiefMachinist: {
                    type: Number,
                    required: true
                },
                bunkeringTugboatEngineMachinist: {
                    type: Number,
                    required: true
                },
                bunkeringTugboatEngineEngineForemen: {
                    type: Number,
                    required: true
                },
                bunkeringTugboatEngineOiler: {
                    type: Number,
                    required: true
                },
                bunkeringTugboatEngineWiper: {
                    type: Number,
                    required: true
                },
                bunkeringTugboatEngineOthers: {
                    type: Number,
                    required: true
                },
            },
            TotalCrewCostMonth: {
                type: Number,
                required: true
            },
            TotalCrewCostYear: {
                type: Number,
                required: true
            },
        },
        PortCost:{
            portCostChargeRoundTrip: {
                type: Number,
                required: true
            },
            portCostTotalPortChargeYear: {
                type: Number,
                required: true
            },
        },
        CargoCostHandling:{
            portCostLasUnlasPOLTrip: {
                type: Number,
                required: true
            },
            portCostLasUnlasPODTrip: {
                type: Number,
                required: true
            },
            totalCargoHandling: {
                type: Number,
                required: true
            },
        },
        VesselCharterCost:{
            vesselCharterCostCharterRateDay: {
                type: Number,
                required: true
            },
            totalCharterRateYear: {
                type: Number,
                required: true
            },

        },
        InsuranceCost:{
            insuranceCostCrew: {
                type: Number,
                required: true
            },
            insuranceCostShip: {
                type: Number,
                required: true
            },
            insuranceCostTotal: {
                type: Number,
                required: true
            },
        },
        DockRepairMTCost:{
            dockRepairMTDockingCost: {
                type: Number,
                required: true
            },
            dockRepairMTRepairStoreCost: {
                type: Number,
                required: true
            },
            dockRepairMTLubeOilCost: {
                type: Number,
                required: true
            },
            dockRepairMTTotal: {
                type: Number,
                required: true
            },
        },
        OtherCost:{
            otherCostVictually: {
                type: Number,
                required: true
            },
            otherCostAdmin: {
                type: Number,
                required: true
            },
            otherCostTotal: {
                type: Number,
                required: true
            },
        },
        TotalCostVesselLCTBargeUSD:{
            type: Number,
            required: true
        },
        TotalCostVesselLCTBargeIDR:{
            type: Number,
            required: true
        },
    },
    TruckingCost:{
        truckSkidCharterCost:{
            type: Number,
            required: true
        },
        truckingFuelCost:{
            type: Number,
            required: true
        },
        truckingDriverAssDriverCost:{
            type: Number,
            required: true
        },
        tollCost:{
            type: Number,
            required: true
        },
        miscCost:{
            type: Number,
            required: true
        },
        cargoInsurance:{
            type: Number,
            required: true
        },
        truckInspLicenseCertifCost:{
            type: Number,
            required: true
        },
        maintenanceCost:{
            type: Number,
            required: true
        },
        DeliveryCost:{
            type: Number,
            required: true
        },
        OtherCost:{
            type: Number,
            required: true
        },
        TotalCostTruckingRP:{
            type: Number,
            required: true
        },
        TotalCostTruckingUSD:{
            type: Number,
            required: true
        },
    },
    RealFreightRateVessel:{
        unitCostMassCargo_USD_KG:{
            type: Number,
            required: true
        },
        unitCostMassCargo_USD_MT:{
            type: Number,
            required: true
        },
        unitCostMassCargo_IDR_KG:{
            type: Number,
            required: true
        },
        unitCostMassCargo_IDR_MT:{
            type: Number,
            required: true
        },
        unitCost_USD_MMBTU:{
            type: Number,
            required: true
        },
        unitCost_USD_MMBTU_NM:{
            type: Number,
            required: true
        },
        unitCostMassCargo_USD_KG_NM:{
            type: Number,
            required: true
        },
        unitCostMassCargo_IDR_KG_NM:{
            type: Number,
            required: true
        },
    },
    RealFreightRateTruck:{
        unitCostMassCargo_USD_KG:{
            type: Number,
            required: true
        },
        unitCostMassCargo_USD_MT:{
            type: Number,
            required: true
        },
        unitCostMassCargo_IDR_KG:{
            type: Number,
            required: true
        },
        unitCostMassCargo_IDR_MT:{
            type: Number,
            required: true
        },
        unitCost_USD_MMBTU:{
            type: Number,
            required: true
        },
        unitCost_USD_MMBTU_NM:{
            type: Number,
            required: true
        },
        unitCostMassCargo_USD_KG_NM:{
            type: Number,
            required: true
        },
        unitCostMassCargo_IDR_KG_NM:{
            type: Number,
            required: true
        },
    },
    RealFreightRateVesselTruck:{
        unitCostMassCargo_USD_KG:{
            type: Number,
            required: true
        },
        unitCostMassCargo_USD_MT:{
            type: Number,
            required: true
        },
        unitCostMassCargo_IDR_KG:{
            type: Number,
            required: true
        },
        unitCostMassCargo_IDR_MT:{
            type: Number,
            required: true
        },
        unitCost_USD_MMBTU:{
            type: Number,
            required: true
        },
        unitCost_USD_MMBTU_NM:{
            type: Number,
            required: true
        },
        unitCostMassCargo_USD_KG_NM:{
            type: Number,
            required: true
        },
        unitCostMassCargo_IDR_KG_NM:{
            type: Number,
            required: true
        },
    },
    ProposedFreightRateVesselTruck:{
        profitMargin:{
            type: Number,
            required: true
        },
        proposedFreight_USD_KG:{
            type: Number,
            required: true
        },
        proposedFreight_USD_MT:{
            type: Number,
            required: true
        },
        proposedFreight_IDR_KG:{
            type: Number,
            required: true
        },
        proposedFreight_IDR_MT:{
            type: Number,
            required: true
        },
        proposedFreight_USD_MMBTU:{
            type: Number,
            required: true
        },
        proposedFreight_USD_MMBTU_NM:{
            type: Number,
            required: true
        },
        proposedFreight_USD_KG_NM:{
            type: Number,
            required: true
        },
        proposedFreight_IDR_KG_NM:{
            type: Number,
            required: true
        },
    },
}, {timestamps: true,});

const TransSkidTruckBarge = mongoose.model('TransSkidTruckBarge', transSkidTruckBargeSchema);

module.exports = TransSkidTruckBarge;