/**
 * Created by Christopher on 17.06.2017.
 */
import CategoryCtrl from './categoryController';

const express = require('express');
const router = express.Router();
const categoryCtrl = new CategoryCtrl();

router.route('/').get(categoryCtrl.getAll);
router.route('/').post(categoryCtrl.insert);

router.route('/:id').get(categoryCtrl.get);
router.route('/:id').put(categoryCtrl.update);
router.route('/:id').delete(categoryCtrl.delete);

router.route('/count').get(categoryCtrl.count);

module.exports = router;
