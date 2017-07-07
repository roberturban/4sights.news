import ArticleController from './articleController';

const express = require('express');
const router = express.Router();
const articleController = new ArticleController();
const auth = require('../middleware/auth');
const admin = require('../middleware/admin');
const user = require('../middleware/user');

router.route('/').get(admin.isAdmin, articleController.getAll);
router.route('/').post(admin.isAdmin, articleController.insert);

router.route('/:id').get(admin.isAdmin, articleController.get);
router.route('/:id').put(admin.isAdmin, articleController.update);

module.exports = router;
