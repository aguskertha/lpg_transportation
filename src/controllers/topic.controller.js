const Topic = require('./../models/topic.model');
const Project = require('./../models/project.model');
const ObjectID = require('mongodb').ObjectId;

const createTopic = async (req, res, next) => {
    try{
        const {name, slug} = req.body;
        const topic = new Topic({name, slug});
        await topic.save();
        res.redirect('/topic');
    }
    catch(error){
        res.render('error', {
            message: e
        });
    }
}

const getTopics = async (req, res, next) => {
    try {
        const topics = await Topic.find();
        res.render('Topic/topic', {
            layout: 'layouts/main-layout',
            topics
        })
        
    } catch (error) {
        res.render('error', {
            layout: 'layouts/main-layout',
            message: error,
            status: 400
        });
    }
}

const getTopicByID = async (req, res, next) => {
    try {
        const topicID = req.params.topicID;
        const topic = await Topic.findOne({_id: ObjectID(topicID)});
        const projects = await Project.find({
            topicID: topicID
        });
        res.render('Project/project', {
            layout: 'layouts/main-layout',
            projects,
            topicID,
            topic
        });
    } catch (error) {
        res.render('error', {
            layout: 'layouts/main-layout',
            message: error,
            status: 400
        });
    }
}
module.exports = {
    createTopic,
    getTopics,
    getTopicByID
}