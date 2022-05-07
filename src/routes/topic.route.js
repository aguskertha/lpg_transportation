var express = require('express');
var router = express.Router();
const { 
    createTopic, 
    getTopics, 
    getTopicByID
    
} = require('./../controllers/topic.controller');

router.post('/', createTopic);
router.get('/', getTopics);
router.get('/:topicID', getTopicByID);

module.exports = router;