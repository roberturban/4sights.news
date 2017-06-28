/**
 * Created by Christopher on 17.06.2017.
 */
import CategoryCtrl from './categoryController';

const express = require('express');
const router = express.Router();
const categoryCtrl = new CategoryCtrl();
const auth = require('../middleware/auth');
const admin = require('../middleware/admin');

router.route('/').get(categoryCtrl.getAll);
router.route('/').post(auth.required, admin.isAdmin, categoryCtrl.insert);

router.route('/:id').get(categoryCtrl.get);
router.route('/:id').put(auth.required, admin.isAdmin, categoryCtrl.update);
router.route('/:id').delete(auth.required, admin.isAdmin, categoryCtrl.delete);

router.route('/count').get(categoryCtrl.count);

module.exports = router;
