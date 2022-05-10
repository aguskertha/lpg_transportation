const router = require('express').Router();
const topicRouter = require('./topic.route');
const projectRouter = require('./project.route');
const indexRouter = require('./index.route');
const userRouter = require('./user.route');
const {ensureAuthenticated} = require('./../middleware/auth');

router.use('/', indexRouter);
router.use('/topic',ensureAuthenticated, topicRouter);
router.use('/project', ensureAuthenticated, projectRouter);
router.use('/user', userRouter);

module.exports = router;