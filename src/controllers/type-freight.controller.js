const TypeFreight = require('../models/type_freight.model');
const ObjectID = require('mongodb').ObjectId;

const renderAdminTypeFreight = async (req, res, next) => {
    try {
        const typeFreights = await TypeFreight.find().sort({createdAt: -1});
        res.render('TypeFreight/type-freight-list', {
            layout: 'layouts/main-layout',
            typeFreights
        });
    } catch (error) {
        res.render('error', {
            layout: 'layouts/main-layout',
            message: error,
            status: 400
        });
    }
}

const createAdminTypeFreight = async (req, res, next) => {
    try {
        const {name, slug} = req.body
        const newTypeFreight = await TypeFreight({name, slug})
        await newTypeFreight.save()
        res.redirect('/type-freight/admin')

    } catch (error) {
        res.render('error', {
            layout: 'layouts/main-layout',
            message: error,
            status: 400
        });
    }
}

const updateAdminTypeFreight = async (req, res, next) => {
    try {
        const {typeFreightID, name, slug} = req.body
        if(typeFreightID == ""){
            await createAdminTypeFreight(req, res, next)
            return
        }
        const typeFreight = await TypeFreight.findOne({_id: ObjectID(typeFreightID)})
        if(!typeFreight) throw 'Type Freight not found!'
        await TypeFreight.updateOne(
            { _id: typeFreightID},
            {
                $set: {
                    name: name,
                    slug: slug
                }
            }
        );
        res.redirect('/type-freight/admin')
    } catch (error) {
        res.render('error', {
            layout: 'layouts/main-layout',
            message: error,
            status: 400
        });
    }
}

const deleteAdminTypeFreightByID = async (req, res, next) => {
    try {
        const typeFreightID = req.params.typeFreightID
        const typeFreight = await TypeFreight.findOne({_id: ObjectID(typeFreightID)})
        if(!typeFreight) throw 'TypeFreight not found!'
        await typeFreight.deleteOne({_id: ObjectID(typeFreightID)})
        res.redirect('/type-freight/admin')
    } catch (error) {
        res.render('error', {
            layout: 'layouts/main-layout',
            message: error,
            status: 400
        });
    }
}

module.exports = {
    renderAdminTypeFreight,
    updateAdminTypeFreight,
    deleteAdminTypeFreightByID
}