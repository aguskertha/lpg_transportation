const TypeVoyage = require('./../models/type_voyage.model');
const ObjectID = require('mongodb').ObjectId;

const renderAdminTypeVoyage = async (req, res, next) => {
    try {
        const typeVoyages = await TypeVoyage.find().sort({createdAt: -1});
        res.render('TypeVoyage/type-voyage-list', {
            layout: 'layouts/main-layout',
            typeVoyages
        });
    } catch (error) {
        res.render('error', {
            layout: 'layouts/main-layout',
            message: error,
            status: 400
        });
    }
}


const createAdminTypeVoyage = async (req, res, next) => {
    try {
        const {name, slug} = req.body
        const newTypeVoyage = await TypeVoyage({name, slug})
        await newTypeVoyage.save()
        res.redirect('/type-voyage/admin')

    } catch (error) {
        res.render('error', {
            layout: 'layouts/main-layout',
            message: error,
            status: 400
        });
    }
}

const updateAdminTypeVoyage = async (req, res, next) => {
    try {
        const {typeVoyageID, name, slug} = req.body
        if(typeVoyageID == ""){
            await createAdminTypeVoyage(req, res, next);
            return
        }
        const typeVoyage = await TypeVoyage.findOne({_id: ObjectID(typeVoyageID)})
        if(!typeVoyage) throw 'Type Voyage not found!'
        await TypeVoyage.updateOne(
            { _id: typeVoyageID},
            {
                $set: {
                    name: name,
                    slug: slug
                }
            }
        );
        res.redirect('/type-voyage/admin')
    } catch (error) {
        res.render('error', {
            layout: 'layouts/main-layout',
            message: error,
            status: 400
        });
    }
}


const deleteAdminTypeVoyageByID = async (req, res, next) => {
    try {
        const typeVoyageID = req.params.typeVoyageID
        const typeVoyage = await TypeVoyage.findOne({_id: ObjectID(typeVoyageID)})
        if(!typeVoyage) throw 'TypeVoyage not found!'
        await typeVoyage.deleteOne({_id: ObjectID(typeVoyageID)})
        res.redirect('/type-voyage/admin')
    } catch (error) {
        res.render('error', {
            layout: 'layouts/main-layout',
            message: error,
            status: 400
        });
    }
}

module.exports = {
    renderAdminTypeVoyage,
    updateAdminTypeVoyage,
    deleteAdminTypeVoyageByID
}