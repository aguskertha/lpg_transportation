var express = require('express');
var router = express.Router();

const { 
    createTopic, 
    getTopics, 
    getTopicByID,
    renderAdminTopic,
    updateAdminTopic,
    deleteAdminTopicByID
    
} = require('./../controllers/topic.controller');

router.post('/create/', createTopic);
router.get('/admin/', renderAdminTopic);
router.post('/admin/edit', updateAdminTopic);
router.get('/admin/delete/:topicID', deleteAdminTopicByID);
router.get('/', getTopics);
router.get('/:topicID', getTopicByID);

module.exports = router;