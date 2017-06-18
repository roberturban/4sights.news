/**
 * Created by Christopher on 17.06.2017.
 */
import UserController from './userController';

const express = require('express');
const router = express.Router();
const userController = new UserController();

router.route('/').get(userController.getAll);
router.route('/').post(userController.insert);

router.route('/:id').get(userController.get);
router.route('/:id').put(userController.update);
router.route('/:id').delete(userController.delete);

router.route('/count').get(userController.count);

router.route('/login').post(userController.login);

module.exports = router;
