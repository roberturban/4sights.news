import SourceController from './sourceController';

const express = require('express');
const router = express.Router();
const sourceController = new SourceController();
const admin = require('../middleware/admin');

router.route('/').get(sourceController.getAll);
router.route('/').post(admin.isAdmin, sourceController.insert);

router.route('/:id').get(admin.isAdmin, sourceController.get);
router.route('/:id').put(admin.isAdmin, sourceController.update);
router.route('/:id').delete(admin.isAdmin, sourceController.delete);

module.exports = router;
