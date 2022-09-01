const ObjectID = require('mongodb').ObjectId;
const UnitConversion = require('./../models/unit_conversion.model');

const renderAdminUnitConversion = async (req, res, next) =>{
    try {
        const unitConversions = await UnitConversion.find().sort({created: -1})
        if(unitConversions.length <= 0) throw 'Unit Conversion not found!'
        res.render('UnitConversion/unit-conversion-list', {
            layout: 'layouts/main-layout',
            unitConversions
        });
    } catch (error) {
        res.render('error', {
            layout: 'layouts/main-layout',
            message: error,
            status: 400
        });
    }
}

const updateAdminUnitConversion = async (req, res, next) => {
    try {
        console.log(req.body)
        const {param, unitConversionID, value} = req.body
        const unitConversion = await UnitConversion.findOne({_id: ObjectID(unitConversionID)})
        if(!unitConversion) throw 'Unit Conversion not found!'
        switch (param) {
            case "KGtoLitre":
                await UnitConversion.updateOne({ _id: unitConversionID},{$set: {KGtoLitre: value}});
                break;
            case "CBMtoLitre":
                await UnitConversion.updateOne({ _id: unitConversionID},{$set: {CBMtoLitre: value}});
                break;
            case "KGtoMMBTU":
                await UnitConversion.updateOne({ _id: unitConversionID},{$set: {KGtoMMBTU: value}});
                break;
            case "CBMtoMT":
                await UnitConversion.updateOne({ _id: unitConversionID},{$set: {CBMtoMT: value}});
                break;
            case "USDtoIDR":
                await UnitConversion.updateOne({ _id: unitConversionID},{$set: {USDtoIDR: value}});
                break
            case "MTtoKG":
                await UnitConversion.updateOne({ _id: unitConversionID},{$set: {MTtoKG: value}});
                break
            case "KMtoMILE":
                await UnitConversion.updateOne({ _id: unitConversionID},{$set: {KMtoMILE: value}});
                break
            case "KMtoNauticalMILE":
                await UnitConversion.updateOne({ _id: unitConversionID},{$set: {KMtoNauticalMILE: value}});
                break;
        
            default:
                break;
        }
        res.redirect('/unit-conversion/admin')

    } catch (error) {
        res.render('error', {
            layout: 'layouts/main-layout',
            message: error,
            status: 400
        });
    }
}

const initUnitConversion = async (req, res, next) => {
    try {
        const unitConversion = {
            KGtoLitre: 1.777,
            CBMtoLitre: 0.001,
            KGtoMMBTU: 0.046452,
            CBMtoMT: 0.56274620146314,
            USDtoIDR: 14500,
            MTtoKG: 1000,
            KMtoMILE: 0.6214,
            KMtoNauticalMILE: 0.5399,
        }
        const newUnitConversion = new UnitConversion(unitConversion)
        await newUnitConversion.save()
        res.json({message: "Unit Conversion Created"})
    } catch (error) {
        res.status(400).json({message: error.toString()})
    }
}
const deleteUnitConversions = async (req, res, next) => {
    try {
        await UnitConversion.deleteMany()
        res.json({message: "Unit Conversion Deleted!"})
    } catch (error) {
        res.status(400).json({message: error.toString()})
    }
}

module.exports = {
    renderAdminUnitConversion,
    updateAdminUnitConversion,
    initUnitConversion,
    deleteUnitConversions
}