const router = require('express').Router();
const topicRouter = require('./topic.route');
const projectRouter = require('./project.route');

router.use('/topic', topicRouter);
router.use('/project', projectRouter);

module.exports = router;