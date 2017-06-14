import * as express from 'express';

import UserCtrl from './controllers/user';
import TopicCtrl from './controllers/topic';
import User from './models/user';
import Topic from './models/topic'

export default function setRoutes(app) {

  const router = express.Router();

  const userCtrl = new UserCtrl();
  const topicCtrl = new TopicCtrl();


  // Topics
  router.route('/topics').get(topicCtrl.getAll);
  router.route('/topics/count').get(topicCtrl.count);
  router.route('/topic').post(topicCtrl.insert);
  router.route('/topic/:id').get(topicCtrl.get);
  router.route('/topic/:id').put(topicCtrl.update);
  router.route('/topic/:id').delete(topicCtrl.delete);


  // Users
  router.route('/login').post(userCtrl.login);
  router.route('/users').get(userCtrl.getAll);
  router.route('/users/count').get(userCtrl.count);
  router.route('/user').post(userCtrl.insert);
  router.route('/user/:id').get(userCtrl.get);
  router.route('/user/:id').put(userCtrl.update);
  router.route('/user/:id').delete(userCtrl.delete);

  // Apply the routes to our application with the prefix /api
  app.use('/api', router);

}
