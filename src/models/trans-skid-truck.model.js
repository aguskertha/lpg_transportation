const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const transSkidTruckSchema = new Schema({
    ProjectID: {
        type: String,
        required: true
    },
    DistributionArea: {
        distArea: {
            type: String,
            required: true
        },
        distOrigin: {
            type: String,
            required: true
        },
        distDestination: {
            type: String,
            required: true
        },
    },
    SkidTruck: {
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
    BasisData: {
        basisDataLPGPriceUSD:{
            type: Number,
            required: true
        },
        basisDataLPGPriceRp:{
            type: Number,
            required: true
        },
        basisDataLPGPriceRpKg:{
            type: Number,
            required: true
        },
        basisDataSolarPrice:{
            type: Number,
            required: true
        },
        basisDataRentalPriceMonth:{
            type: Number,
            required: true
        },
        basisDataRentalPriceDay:{
            type: Number,
            required: true
        },
        basisDataDriverSalaryMonth:{
            type: Number,
            required: true
        },
        basisDataDriverSalaryDay:{
            type: Number,
            required: true
        },
        basisDataAssistDriverSalaryMonth:{
            type: Number,
            required: true
        },
        basisDataAssistDriverSalaryDay:{
            type: Number,
            required: true
        },
        basisDataMisEtc:{
            type: Number,
            required: true
        },
        basisDataLCTRate:{
            type: Number,
            required: true
        },
        basisDataLCTRateEtc:{
            type: Number,
            required: true
        },
        basisDataTotalCost:{
            type: Number,
            required: true
        },
        basisDataRiskFactor:{
            type: Number,
            required: true
        },
    },
    DeliveryData:{
        deliveryDataOriginLPG:{
            type: String,
            required: true
        },
        deliveryDataOriginPort:{
            type: String,
            required: true
        },
        deliveryDataDestinationPort:{
            type: String,
            required: true
        },
        deliveryDataDestinationSPBE:{
            type: String,
            required: true
        },
        deliveryDataDistanceTruckingOriginKM:{
            type: Number,
            required: true
        },
        deliveryDataDistanceTruckingOriginMile:{
            type: Number,
            required: true
        },
        deliveryDataDistanceSailFerryPortKM:{
            type: Number,
            required: true
        },
        deliveryDataDistanceSailFerryPortMile:{
            type: Number,
            required: true
        },
        deliveryDataDistanceTruckingPortSpbeKM:{
            type: Number,
            required: true
        },
        deliveryDataDistanceTruckingPortSpbeMile:{
            type: Number,
            required: true
        },
        deliveryDataTotalDistance:{
            type: Number,
            required: true
        },
        deliveryDataLPGLoadUnload:{
            type: Number,
            required: true
        },
        deliveryDataRoundTripSailling:{
            type: Number,
            required: true
        },
        deliveryDataNumberTrucking:{
            type: Number,
            required: true
        },
        deliveryDataRoundTripTrucking:{
            type: Number,
            required: true
        },
        deliveryDataTotalRoundTrip:{
            type: Number,
            required: true
        },
        deliveryDataTotalCargoDelivery:{
            type: Number,
            required: true
        },
        deliveryDataNumberTripYear:{
            type: Number,
            required: true
        },
        deliveryDataTotalCargoYearMT:{
            type: Number,
            required: true
        },
        deliveryDataTotalCargoYearKG:{
            type: Number,
            required: true
        },
        deliveryDataTotalCargoYearMMBTU:{
            type: Number,
            required: true
        },
    },
    CostComponent: {
        truckSkidCost:{
            type: Number,
            required: true
        },
        truckFuelCost:{
            type: Number,
            required: true
        },
        truckDriverCost:{
            type: Number,
            required: true
        },
        tollCost:{
            type: Number,
            required: true
        },
        MiscCostTrucking:{
            type: Number,
            required: true
        },
        ferryCost:{
            type: Number,
            required: true
        },
        cargoInsurance:{
            type: Number,
            required: true
        },
        truckLicenseSertifCost:{
            type: Number,
            required: true
        },
        maintenanceCost:{
            type: Number,
            required: true
        },
        deliveryCost:{
            type: Number,
            required: true
        },
        otherCost:{
            type: Number,
            required: true
        },
        totalCostRP:{
            type: Number,
            required: true
        },
        totalCostUSD:{
            type: Number,
            required: true
        },
    },
    RealFreightRate: {
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
    ProposedFreight: {
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
    }
}, {timestamps: true,});

const TransSkidTruck = mongoose.model('TransSkidTruck', transSkidTruckSchema);

module.exports = TransSkidTruck;