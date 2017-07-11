import ArticleController from './articleController';

const express = require('express');
const router = express.Router();
const articleController = new ArticleController();
const auth = require('../middleware/auth');
const admin = require('../middleware/admin');

router.route('/').get(auth.required ,admin.isAdmin, articleController.getAll);
//router.route('/').get(articleController.getAll);

router.route('/:id').get(auth.required, admin.isAdmin, articleController.get);
//router.route('/:id').get(articleController.get);
router.route('/:id').put(auth.required, admin.isAdmin, articleController.update);
//router.route('/:id').put(articleController.update);

module.exports = router;
