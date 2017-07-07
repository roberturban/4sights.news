/**
 * Created by Christopher on 17.06.2017.
 */
import TopicController from './topicController';

const express = require('express');
const router = express.Router();
const topicCtrl = new TopicController();
const auth = require('../middleware/auth');
const admin = require('../middleware/admin');
const param = require('../middleware/param');

router.route('/').get(auth.optional, param.user_id, topicCtrl.getAll);
router.route('/').post(auth.required, admin.isAdmin, topicCtrl.insert);

router.route('/:id').get(auth.optional, topicCtrl.get);
router.route('/:id').put(auth.required, admin.isAdmin, topicCtrl.update);
router.route('/:id').delete(auth.required, admin.isAdmin, topicCtrl.delete);

module.exports = router;
