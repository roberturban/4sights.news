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


/*
 The following code should only illustrate the refactored logic of checking if a user is logged in
 and has the role `admin`
 It was not yet applied to the core logic since it would overwrite all of Kevins work until now
 */
const auth = require('../middleware/auth');
const admin = require('../middleware/admin');

router.route('/refactored-from-chris').post(auth.required, admin.isAdmin, topicCtrl.getAll);

module.exports = router;
