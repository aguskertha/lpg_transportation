const CostShipAge = require('../models/cost-ship-age');
const ObjectID = require('mongodb').ObjectId;

const initCostShipAge = async (req, res, next) => {
    try {
        const costShipAges = [
            {
                shipAge: '26-30',
                constantFactor: -12.28
            },
            {
                shipAge: '21-25',
                constantFactor: -4.42
            },
            {
                shipAge: '16-20',
                constantFactor: -3.29
            },
            {
                shipAge: '11-15',
                constantFactor: 3.29
            },
            {
                shipAge: '6-10',
                constantFactor: 4.42
            },
            {
                shipAge: '0-5',
                constantFactor: 12.28
            },
        ]
        await CostShipAge.insertMany(costShipAges)
        res.json({message: "Successfully init CostShipAges"});
    } catch (error) {
        res.render('error', {
            layout: 'layouts/main-layout',
            message: error,
            status: 400
        });
    }
}

const deleteCostShipAges = async (req, res, next) => {
    try {
        await CostShipAge.deleteMany()
        res.json({message: "Successfully delete CostShipAges"});
    } catch (error) {
        res.render('error', {
            layout: 'layouts/main-layout',
            message: error,
            status: 400
        });
    }
}

const renderAdminCostShipAge = async (req, res, next) => {
    try {
        const costShipAges = await CostShipAge.find().sort({createdAt: -1});
        res.render('CostShipAge/cost-ship-age-list', {
            layout: 'layouts/main-layout',
            costShipAges
        });
    } catch (error) {
        res.render('error', {
            layout: 'layouts/main-layout',
            message: error,
            status: 400
        });
    }
}

const createAdminCostShipAge = async (req, res, next) => {
    try {
        const {shipAge, constantFactor} = req.body
        const newCostShipAge = await CostShipAge({shipAge, constantFactor})
        await newCostShipAge.save()
        res.redirect('/cost-ship-age/admin')

    } catch (error) {
        res.render('error', {
            layout: 'layouts/main-layout',
            message: error,
            status: 400
        });
    }
}

const updateAdminCostShipAge = async (req, res, next) => {
    try {
        const {costShipAgeID, shipAge, constantFactor} = req.body
        if(costShipAgeID == ""){
            await createAdminCostShipAge(req, res, next)
            return
        }
        const costShipAge = await CostShipAge.findOne({_id: ObjectID(costShipAgeID)})
        if(!costShipAge) throw 'Type Freight not found!'
        await CostShipAge.updateOne(
            { _id: costShipAgeID},
            {
                $set: {
                    shipAge: shipAge,
                    constantFactor: constantFactor
                }
            }
        );
        res.redirect('/cost-ship-age/admin')
    } catch (error) {
        res.render('error', {
            layout: 'layouts/main-layout',
            message: error,
            status: 400
        });
    }
}

const deleteAdminCostShipAgeByID = async (req, res, next) => {
    try {
        const costShipAgeID = req.params.costShipAgeID
        const costShipAge = await CostShipAge.findOne({_id: ObjectID(costShipAgeID)})
        if(!costShipAge) throw 'CostShipAge not found!'
        await costShipAge.deleteOne({_id: ObjectID(costShipAgeID)})
        res.redirect('/cost-ship-age/admin')
    } catch (error) {
        res.render('error', {
            layout: 'layouts/main-layout',
            message: error,
            status: 400
        });
    }
}

module.exports = {
    renderAdminCostShipAge,
    updateAdminCostShipAge,
    deleteAdminCostShipAgeByID,
    initCostShipAge,
    deleteCostShipAges
}