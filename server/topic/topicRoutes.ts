/**
 * Created by Christopher on 17.06.2017.
 */
import TopicController from './topicController';

const express = require('express');
const router = express.Router();
const topicCtrl = new TopicController();

router.route('/').get(topicCtrl.getAll);
router.route('/').post(topicCtrl.insert);

router.route('/:id').get(topicCtrl.get);
router.route('/:id').put(topicCtrl.update);
router.route('/:id').delete(topicCtrl.delete);

router.route('/count').get(topicCtrl.count);

module.exports = router;
