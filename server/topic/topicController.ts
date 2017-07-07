
import Topic from './topicModel';
import BaseCtrl from '../baseController';
import * as jwt from 'jsonwebtoken';

export default class TopicCtrl extends BaseCtrl {
  model = Topic;

  insert = (req, res) => {
    const token = req.headers.authorization.split(" ")[1]; //first part of string is "Bearer "
    const model = this.model; //cannot access model otherwise in the following callback
    jwt.verify(token, process.env.SECRET_TOKEN, function(err, decoded) {
      if(err) {
        return res.status(401).json({
          title: 'Not Authenticated',
          error: err
        });
      }

      if(decoded.user.role != 'admin') {
        return res.status(405).json({
          title: 'Not Allowed',
          error: {message: 'Not allowed'}
        });
      }

      const obj = new model(req.body);
      obj.save((err, item) => {
        if (err && err.code === 11000) {
          res.sendStatus(400);
        }
        if (err) {
          return console.error(err);
        }
        res.status(200).json(item);
      });
    });
  };

  // Get all
  getAll = (req, res) => {
    this.model.find()
      .populate('categories')
      .exec(function (err, docs) {
        if (err) { return console.error(err); }
        res.json(docs);
      });
  };

  // Get by id
  get = (req, res) => {
    console.log(req);
    this.model.findOne({_id: req.params.id})
      .populate('categories')
      .exec(function (err, docs) {
        if (err) { return console.error(err); }
        res.json(docs);
      });
  };

  update = (req, res) => {
    const token = req.headers.authorization.split(" ")[1]; //first part of string is "Bearer "
    const model = this.model; //cannot access model otherwise in the following callback
    console.log("Update topic");
    jwt.verify(token, process.env.SECRET_TOKEN, function(err, decoded) {
      if(err) {
        console.log("Update topic - verification failed");
        return res.status(401).json({
          title: 'Not Authenticated',
          error: err
        });
      }

      if(decoded.user.role != 'admin') {
        console.log("Update topic - unvalid role");
        return res.status(405).json({
          title: 'Not Allowed',
          error: {message: 'Not allowed'}
        });
      }

      model.findOneAndUpdate({ _id: req.params.id }, req.body, (err) => {
        if (err) { return console.error(err); }
        res.sendStatus(200);
      });
    });
  };

  delete = (req, res) => {
    const token = req.headers.authorization.split(" ")[1]; //first part of string is "Bearer "
    const model = this.model; //cannot access model otherwise in the following callback
    console.log("Delete topic");
    jwt.verify(token, process.env.SECRET_TOKEN, function(err, decoded) {
      if(err) {
        console.log("Delete topic - verification failed");
        return res.status(401).json({
          title: 'Not Authenticated',
          error: err
        });
      }

      if(decoded.user.role != 'admin') {
        console.log("Delete topic - unvalid role");
        return res.status(405).json({
          title: 'Not Allowed',
          error: {message: 'Not allowed'}
        });
      }

      model.findOneAndRemove({ _id: req.params.id }, (err) => {
        if (err) { return console.error(err); }
        res.sendStatus(200);
      });
    });
  };
}
