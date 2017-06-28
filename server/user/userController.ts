/**
 * Created by Christopher on 18.06.2017.
 */
import * as jwt from 'jsonwebtoken';

import User from './userModel';
import BaseController from '../baseController';

export default class UserCtrl extends BaseController {
  model = User;

  login = (req, res) => {
    console.log("Login (UserController): " + req.headers);
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

  count = (req, res) => {
    const token = req.headers.authorization.split(" ")[1]; //first part of string is "Bearer "
    const model = this.model; //cannot access model otherwise in the following callback
    console.log("count users");
    jwt.verify(token, process.env.SECRET_TOKEN, function(err, decoded) {
      if(err) {
        console.log("count users - verification failed");
        return res.status(401).json({
          title: 'Not Authenticated',
          error: err
        });
      }

      if(decoded.user.role != 'admin') {
        console.log("count users - unvalid role");
        return res.status(405).json({
          title: 'Not Allowed',
          error: {message: 'Not allowed'}
        });
      }

      console.log("count users - verification success");
      model.count((err, count) => {
        if (err) { return console.error(err); }
        res.json(count);
      });
    });
  };
}
