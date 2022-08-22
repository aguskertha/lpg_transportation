const mongoose = require('mongoose');

const Transportation = mongoose.model('Transportation', {
    ProjectID: {
        type: String,
        require: true
    },
    status: {
        type: Number,
        require: true
    },
    isNegotiation: {
        type: String,
        require: true
    },
    TypeFreight: {
        name: {
            type: String,
            require: true
        },
        slug: {
            type: String,
            require: true
        },
    },
    TypeVoyage: {
        name: {
            type: String,
            require: true
        },
        slug: {
            type: String,
            require: true
        },
    },
    Ship : {
        shipName: {
            type: String,
            require: true
        },
        shipCapacityCBM:{
            type: "Decimal128",
            require: true
        },
        shipCapacityMT:{
            type: "Decimal128",
            require: false
        },
        typeVessel:{
            type: String,
            require: false
        },
        IMONumber:{
            type: String,
            require: false
        },
        MMSINumber:{
            type: String,
            require: false
        },
        callSign:{
            type: String,
            require: false
        },
        grossTonnage:{
            type: "Decimal128",
            require: false
        },
        summerDWT:{
            type: "Decimal128",
            require: false
        },
        lengthOverall:{
            type: String,
            require: false
        },
        yearBuilt:{
            type: "Decimal128",
            require: false
        },
        shipAge:{
            type: "Decimal128",
            require: true
        },
        crewNumber:{
            type: "Decimal128",
            require: true
        },
        SFOC:{
            type: "Decimal128",
            require: true
        }
    },
    Tugboat : {
        shipName: {
            type: String,
            require: true
        },
        typeVessel:{
            type: String,
            require: false
        },
        IMONumber:{
            type: String,
            require: false
        },
        MMSINumber:{
            type: String,
            require: false
        },
        callSign:{
            type: String,
            require: false
        },
        grossTonnage:{
            type: "Decimal128",
            require: false
        },
        summerDWT:{
            type: "Decimal128",
            require: false
        },
        lengthOverall:{
            type: String,
            require: false
        },
        yearBuilt:{
            type: "Decimal128",
            require: false
        },
        shipAge:{
            type: "Decimal128",
            require: true
        },
        crewNumber:{
            type: "Decimal128",
            require: true
        },
        SFOC:{
            type: "Decimal128",
            require: true
        }
    },
    Voyage: {
        POL:{
            type: String,
            require: true
        },
        POD:{
            type: String,
            require: true
        },
        distance:{
            type: "Decimal128",
            require: true
        },
        serviceSpeedVessel:{
            type: "Decimal128",
            require: true
        },   
    },
    ShipCargoTankFullCapacity: {
        numberOfCargoTank: {
            type: "Decimal128",
            require: true
        },
        cargoTank: [
            {
                type: "Decimal128",
                require: true
            }
        ],
        totalCapacityCBM: {
            type: "Decimal128",
            require: true
        },
        totalCapacityLitre: {
            type: "Decimal128",
            require: true
        },
        totalCapacityKG: {
            type: "Decimal128",
            require: true
        },
    },
    ShipCargoTankOperationalCapacity: {
        loadingFactor: {
            type: "Decimal128",
            require: true
        },
        cargoTankOp: [
            {
                type: "Decimal128",
                require: true
            }
        ],
        totalCapacityOpCBM: {
            type: "Decimal128",
            require: true
        },
        totalCapacityOpLitre: {
            type: "Decimal128",
            require: true
        },
        totalCapacityOpKG: {
            type: "Decimal128",
            require: true
        },
    },
    TurnAroundVoyage: {
        ladenSailingTime: {
            type: "Decimal128",
            require: true
        },
        ballastSailingTime: {
            type: "Decimal128",
            require: true
        },
        totalSailingTime: {
            type: "Decimal128",
            require: true
        },
        pumpLoadingRate: [
            {
                type: "Decimal128",
                require: true
            }
        ],
        totalLoadingTime: {
            type: "Decimal128",
            require: true
        },
        enterWaitTimePOL: {
            type: "Decimal128",
            require: true
        },
        pumpDischargeRate: [
            {
                type: "Decimal128",
                require: true
            }
        ],
        totalDischargeTime: {
            type: "Decimal128",
            require: true
        },
        enterWaitTimePOD: {
            type: "Decimal128",
            require: true
        },
        totalTurnRoundTime: {
            type: "Decimal128",
            require: true
        },
        calendarDaysYear: {
            type: "Decimal128",
            require: true
        },
        docking: {
            type: "Decimal128",
            require: true
        },
        mobilization: {
            type: "Decimal128",
            require: true
        },
        effectiveDays: {
            type: "Decimal128",
            require: true
        },
        numberRoundTripYear: {
            type: "Decimal128",
            require: true
        },
        idleDaysYear: {
            type: "Decimal128",
            require: true
        },
        totalCargoCarryCapacityYearCBM: {
            type: "Decimal128",
            require: true
        },
        totalCargoCarryCapacityYearKG: {
            type: "Decimal128",
            require: true
        },
        totalCargoCarryCapacityYearMMBTU: {
            type: "Decimal128",
            require: true
        },
    },
    BunkeringCalculation: {
        portIdleMFO: {
            type: "Decimal128",
            require: true
        },
        portIdleMDO: {
            type: "Decimal128",
            require: true
        },
        portIdleMGO: {
            type: "Decimal128",
            require: true
        },
        portWorkingMFO: {
            type: "Decimal128",
            require: true
        },   
        portWorkingMDO: {
            type: "Decimal128",
            require: true
        },
        portWorkingMGO: {
            type: "Decimal128",
            require: true
        },
        atSeaMFO: {
            type: "Decimal128",
            require: true
        },
        atSeaMDO: {
            type: "Decimal128",
            require: true
        },
        atSeaMGO: {
            type: "Decimal128",
            require: true
        },
        bunkerConsumeTripMFO:{
            type: "Decimal128",
            require: true
        },
        bunkerConsumeTripMDO:{
            type: "Decimal128",
            require: true
        },
        bunkerConsumeTripMGO:{
            type: "Decimal128",
            require: true
        },
        bunkerConsumeYearMFO:{
            type: "Decimal128",
            require: true
        },
        bunkerConsumeYearMDO:{
            type: "Decimal128",
            require: true
        },
        bunkerConsumeYearMGO:{
            type: "Decimal128",
            require: true
        },
        bunkerPriceIDRMFO: {
            type: "Decimal128",
            require: true
        },
        bunkerPriceIDRMDO: {
            type: "Decimal128",
            require: true
        },
        bunkerPriceIDRMGO: {
            type: "Decimal128",
            require: true
        },
        bunkerPriceUSDMFO: {
            type: "Decimal128",
            require: true
        },
        bunkerPriceUSDMDO: {
            type: "Decimal128",
            require: true
        },
        bunkerPriceUSDMGO: {
            type: "Decimal128",
            require: true
        },
        totalBunkerCostTripIDR: {
            type: "Decimal128",
            require: true
        },
        totalBunkerCostYearIDR: {
            type: "Decimal128",
            require: true
        },
        totalBunkerCostTripUSD: {
            type: "Decimal128",
            require: true
        },
        totalBunkerCostYearUSD: {
            type: "Decimal128",
            require: true
        },
    },
    CrewCost: {
        DeckDept: {
            deckMaster: {
                type: "Decimal128",
                require: true
            },
            deckChiefOfficer: {
                type: "Decimal128",
                require: true
            },
            deckOfficer: {
                type: "Decimal128",
                require: true
            },
            deckRadioOperator: {
                type: "Decimal128",
                require: true
            },
            deckBoatswain : {
                type: "Decimal128",
                require: true
            },
            deckAbleBodied : {
                type: "Decimal128",
                require: true
            },
            deckOrdinarySeamen : {
                type: "Decimal128",
                require: true
            },
            deckChef : {
                type: "Decimal128",
                require: true
            },
            deckAssistantChef : {
                type: "Decimal128",
                require: true
            },
            deckOthers : {
                type: "Decimal128",
                require: true
            },
        },
        EngineDept: {
            engineChiefEngineer : {
                type: "Decimal128",
                require: true
            },
            engineChiefMachinist : {
                type: "Decimal128",
                require: true
            },
            engineMachinist : {
                type: "Decimal128",
                require: true
            },
            engineForemen : {
                type: "Decimal128",
                require: true
            },
            engineOiler : {
                type: "Decimal128",
                require: true
            },
            engineWiper : {
                type: "Decimal128",
                require: true
            },
            engineOthers : {
                type: "Decimal128",
                require: true
            },
        },
        Barge: {
            bargeLoadingMaster : {
                type: "Decimal128",
                require: true
            },
            bargeBoatswain : {
                type: "Decimal128",
                require: true
            },
        },
        totalCrewCostMonth : {
            type: "Decimal128",
            require: true
        },
        totalCrewCostYear : {
            type: "Decimal128",
            require: true
        },
    },
    PortCost: {
        portChargesRoundTrip : {
            type: "Decimal128",
            require: true
        },
        totalPortChargesYear : {
            type: "Decimal128",
            require: true
        },
    },
    CargoHandlingCost: {
        lasingUnlasPOLTrip : {
            type: "Decimal128",
            require: true
        },
        lasingUnlasPODTrip : {
            type: "Decimal128",
            require: true
        },
        totalCargoHandlingCostYear : {
            type: "Decimal128",
            require: true
        },
    },
    VesselCharterCost: {
        charterRateDay : {
            type: "Decimal128",
            require: true
        },
        totalCharterRateYear : {
            type: "Decimal128",
            require: true
        },
    },
    InsuranceCost: {
        crewInsurance : {
            type: "Decimal128",
            require: true
        },
        shipInsurance : {
            type: "Decimal128",
            require: true
        },
        totalInsuranceCostYear : {
            type: "Decimal128",
            require: true
        },
    },
    DockingRepairMaintenanceCost: {
        dockingCost : {
            type: "Decimal128",
            require: true
        },
        repairStoreCost : {
            type: "Decimal128",
            require: true
        },
        lubeOilCost : {
            type: "Decimal128",
            require: true
        },
        totalDockingRepairMaintenanceCost : {
            type: "Decimal128",
            require: true
        },
    },
    OtherCost:{
        victually : {
            type: "Decimal128",
            require: true
        },
        administrationCost : {
            type: "Decimal128",
            require: true
        },
        totalOtherCost : {
            type: "Decimal128",
            require: true
        },
    },
    TotalCost:{
        totalCostBeforeTax : {
            type: "Decimal128",
            require: true
        },
        totalCostAfterTax : {
            type: "Decimal128",
            require: true
        },
        totalTax : {
            type: "Decimal128",
            require: true
        },
        tax : {
            type: "Decimal128",
            require: true
        },
    },
    RealFreightRate: {
        unitCostMassCargo_USD_KG : {
            type: "Decimal128",
            require: true
        },
        unitCostMassCargo_USD_MT : {
            type: "Decimal128",
            require: true
        },
        unitCostMassCargo_IDR_KG : {
            type: "Decimal128",
            require: true
        },
        unitCostMassCargo_IDR_MT : {
            type: "Decimal128",
            require: true
        },
        unitCost_USD_MMBTU : {
            type: "Decimal128",
            require: true
        },
        unitCost_USD_MMBTU_NM : {
            type: "Decimal128",
            require: true
        },
        unitCostMassCargo_USD_KG_NM : {
            type: "Decimal128",
            require: true
        },
        unitCostMassCargo_IDR_KG_NM : {
            type: "Decimal128",
            require: true
        },
    },
    ProposedFreight: {
        profitMargin : {
            type: "Decimal128",
            require: true
        },
        proposedFreight_USD_KG : {
            type: "Decimal128",
            require: true
        },
        proposedFreight_USD_MT : {
            type: "Decimal128",
            require: true
        },
        proposedFreight_IDR_KG : {
            type: "Decimal128",
            require: true
        },
        proposedFreight_IDR_MT : {
            type: "Decimal128",
            require: true
        },
        proposedFreight_USD_MMBTU : {
            type: "Decimal128",
            require: true
        },
        proposedFreight_USD_MMBTU_NM : {
            type: "Decimal128",
            require: true
        },
        proposedFreight_USD_KG_NM : {
            type: "Decimal128",
            require: true
        },
        proposedFreight_IDR_KG_NM : {
            type: "Decimal128",
            require: true
        },
        revenue : {
            type: "Decimal128",
            require: true
        },
        netRevenue : {
            type: "Decimal128",
            require: true
        },
        ratioRevenue : {
            type: "Decimal128",
            require: true
        },
    },
    bunkerPriceSensitivityID: {
        type: String,
    }
});

module.exports = Transportation;