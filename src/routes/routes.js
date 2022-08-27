const router = require('express').Router();
const topicRouter = require('./topic.route');
const projectRouter = require('./project.route');
const indexRouter = require('./index.route');
const userRouter = require('./user.route');
const typeVoyageRouter = require('./type-voyage.route');
const typeFreightRouter = require('./type-freight.route');
const unitConversionRouter = require('./unit-conversion.route');
const {ensureAuthenticated} = require('./../middleware/auth');

router.use('/', indexRouter);
router.use('/topic', ensureAuthenticated, topicRouter);
router.use('/project', ensureAuthenticated, projectRouter);
router.use('/user', userRouter);
router.use('/type-voyage', ensureAuthenticated, typeVoyageRouter);
router.use('/type-freight', ensureAuthenticated, typeFreightRouter);
router.use('/unit-conversion', ensureAuthenticated, unitConversionRouter);

module.exports = router;