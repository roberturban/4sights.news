/**
 * Created by Christopher on 17.06.2017.
 */
import UserCtrl from '../controllers/user';

const express = require('express');
const router = express.Router();
const User = require('../models/user');
const userCtrl = new UserCtrl();

router.route('/').get(userCtrl.getAll);
router.route('/').post(userCtrl.insert);

router.route('/:id').get(userCtrl.get);
router.route('/:id').put(userCtrl.update);
router.route('/:id').delete(userCtrl.delete);

router.route('/count').get(userCtrl.count);

router.route('/login').post(userCtrl.login);

module.exports = router;
