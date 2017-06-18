import * as dotenv from 'dotenv';
import * as jwt from 'jsonwebtoken';

import User from '../models/user';
import BaseCtrl from './base';

export default class UserCtrl extends BaseCtrl {
  model = User;

  login = (req, res) => {
    console.log("Login (UserCtrl): " + req.headers);
    this.model.findOne({ email: req.body.email }, (err, user) => {
      if (!user) { return res.sendStatus(403); }
      user.comparePassword(req.body.password, (error, isMatch) => {
        if (!isMatch) { return res.sendStatus(403); }
        const token = jwt.sign({ user: user }, process.env.SECRET_TOKEN); // , { expiresIn: 10 } seconds
        res.status(200).json({ token: token });
      });
    });
  };

  getAll = (req, res) => {
    const token = req.headers.authorization.split(" ")[1]; //first part of string is "Bearer "
    const model = this.model; //cannot access model otherwise in the following callback
    console.log("getAll users");
    jwt.verify(token, process.env.SECRET_TOKEN, function(err, decoded) {
      if(err) {
        console.log("getAll users - verification failed");
        return res.status(401).json({
          title: 'Not Authenticated',
          error: err
        });
      }

      if(decoded.user.role != 'admin') {
        console.log("getAll users - unvalid role");
        return res.status(405).json({
          title: 'Not Allowed',
          error: {message: 'Not allowed'}
        });
      }
      
      console.log("getAll users - verification success");
      this.model.find()
        // .populate('categories')
        .exec(function (err, docs) {
          if (err) { return console.error(err); }
          res.json(docs);
      });
    });
  };

  get = (req, res) => {
    const token = req.headers.authorization.split(" ")[1]; //first part of string is "Bearer "
    const model = this.model; //cannot access model otherwise in the following callback
    console.log("get user");
    jwt.verify(token, process.env.SECRET_TOKEN, function(err, decoded) {
      if(err) {
        console.log("get user - verification failed");
        return res.status(401).json({
          title: 'Not Authenticated',
          error: err
        });
      }

      if(decoded.user.role != 'admin' && decoded.user._id != req.params.id) {
        console.log("get user - unvalid role or unvalid user");
        return res.status(405).json({
          title: 'Not Allowed',
          error: {message: 'Not allowed'}
        });
      }
      
      console.log("get user - verification success");
      model.findOne({ _id: req.params.id }, (err, user) => {
        if (err) { return console.error(err); }
        res.json(user);
      });
    });
  };

  update = (req, res) => {
    const token = req.headers.authorization.split(" ")[1]; //first part of string is "Bearer "
    const model = this.model; //cannot access model otherwise in the following callback
    console.log("update user");
    jwt.verify(token, process.env.SECRET_TOKEN, function(err, decoded) {
      if(err) {
        console.log("udpate user - verification failed");
        return res.status(401).json({
          title: 'Not Authenticated',
          error: err
        });
      }

      if(decoded.user.role != 'admin' && decoded.user._id != req.params.id) {
        console.log("update user - unvalid role or unvalid user");
        return res.status(405).json({
          title: 'Not Allowed',
          error: {message: 'Not allowed'}
        });
      }
      
      console.log("update user - verification success");
      model.findOneAndUpdate({ _id: req.params.id }, req.body, (err) => {
        if (err) { return console.error(err); }
        res.sendStatus(200);
      });
    });
  };

  delete = (req, res) => {
    const token = req.headers.authorization.split(" ")[1]; //first part of string is "Bearer "
    const model = this.model; //cannot access model otherwise in the following callback
    console.log("delete user");
    jwt.verify(token, process.env.SECRET_TOKEN, function(err, decoded) {
      if(err) {
        console.log("delete user - verification failed");
        return res.status(401).json({
          title: 'Not Authenticated',
          error: err
        });
      }

      if(decoded.user.role != 'admin' && decoded.user._id != req.params.id) {
        console.log("delete user - unvalid role or unvalid user");
        return res.status(405).json({
          title: 'Not Allowed',
          error: {message: 'Not allowed'}
        });
      }
      
      console.log("delete user - verification success");
      model.findOneAndRemove({ _id: req.params.id }, (err) => {
        if (err) { return console.error(err); }
        res.sendStatus(200);
      });
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
