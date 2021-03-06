/**
 * Created by Christopher on 18.06.2017.
 */
import * as jwt from 'jsonwebtoken';

import User from './userModel';
import BaseController from '../baseController';

export default class UserCtrl extends BaseController {
  model = User;

  login = (req, res) => {
    this.model.findOne({email: req.body.email})
      .populate('categories')
      .exec(function (err, user) {
        if (!user) {
          return res.sendStatus(403);
        }
        user.comparePassword(req.body.password, (error, isMatch) => {
          if (!isMatch) {
            return res.sendStatus(403);
          }
          const token = jwt.sign({user: user}, process.env.SECRET_TOKEN); // , { expiresIn: 10 } seconds
          res.status(200).json({token: token});
        });
      });
  };

  getAll = (req, res) => {
      this.model.find()
        .populate('categories')
        .exec(function (err, docs) {
          if (err) { return console.error(err); }
          res.json(docs);
      });
  };

  get = (req, res) => {
    this.model.findOne({_id: req.params.id})
      .populate('categories')
      .exec(function (err, docs) {
        if (err) { return console.error(err); }
        res.json(docs);
      });
  };

  // Insert
  insert = (req, res) => {
    const obj = new this.model(req.body);
    obj.save((err, savedUser) => {
      // 11000 is the code for duplicate key error
      if (err && err.code === 11000) {
        res.sendStatus(400);
      }
      if (err) {
        return console.error(err);
      }
      savedUser.populate('categories', function (populatedErr, populatedUser) {
        populatedUser = populatedUser.toJSON();
        populatedUser.token = jwt.sign({user: populatedUser}, process.env.SECRET_TOKEN);
        res.status(200).json(populatedUser);
      });
    });
  };

  // // Update by id
  update = (req, res) => {
    if (req.payload.user.role !== 'admin') {
      delete req.body.role;
    }

    this.model.findOneAndUpdate({_id: req.params.id}, req.body, {new: true})
      .populate('categories')
      .exec(function (err, user) {
        user = user.toJSON();
        user.token = jwt.sign({user: user}, process.env.SECRET_TOKEN);
        res.status(200).json(user);
      });
  };
}
