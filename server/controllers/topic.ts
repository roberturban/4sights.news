import Topic from '../models/topic';
import BaseCtrl from './base';
import * as jwt from 'jsonwebtoken';

export default class TopicCtrl extends BaseCtrl {
  model = Topic;

  insert = (req, res) => {
    console.log(req.headers.authorization);
    console.log(typeof req.headers.authorization);
    jwt.verify(req.headers.authorization.split(" ")[1], process.env.SECRET_TOKEN, function(err, decoded) {
      if(err) {
        return res.status(401).json({
          title: 'Not Authenticated',
          error: err
        });
      }
    });

    const obj = new this.model(req.body);
    obj.save((err, item) => {
      if (err && err.code === 11000) {
        res.sendStatus(400);
      }
      if (err) {
        return console.error(err);
      }
      res.status(200).json(item);
    });
  };
}