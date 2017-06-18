import Topic from '../models/topic';
import BaseCtrl from './base';
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
      
      model.findById(req.params.id, function(err, topic) {
        console.log("Update topic - find topic");
        if (err) {
          console.log("Update topic - find topic problem");
          return res.status(500).json({
              title: 'An error occurred',
              error: err
          });
        }
        if (!topic) {
          console.log("Update topic - no topic found");
          return res.status(500).json({
              title: 'Topic not found!',
              error: {message: 'Topic not found'}
          });
        }

        console.log("Update topic - save topic");
        var newtopic = req.body;
        topic.title = newtopic.title;
        topic.timestamp = newtopic.timestamp;
        topic.image = newtopic.image;
        topic.news_article_count = newtopic.news_article_count;
        topic.location = newtopic.location;
        topic.categories = newtopic.categories;
        console.log("Update topic - topic: " + JSON.stringify(topic));
        topic.save(function (err, result) {
            if (err) {
              console.log("Update topic - save topic error");
              return res.status(500).json({
                  title: 'An error occurred',
                  error: err
              });
            }
            console.log("Update topic - success");
            res.status(200).json({
                message: 'Updated topic',
                obj: result
            });
        });
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
      
      model.findById(req.params.id, function(err, topic) {
        console.log("Delete topic - find topic");
        if (err) {
          console.log("Update topic - find topic problem");
          return res.status(500).json({
              title: 'An error occurred',
              error: err
          });
        }
        if (!topic) {
          console.log("Delete topic - no topic found");
          return res.status(500).json({
              title: 'Topic not found!',
              error: {message: 'Topic not found'}
          });
        }

        console.log("Delete topic - delete topic");
        topic.remove(function (err, result) {
            if (err) {
              console.log("Delete topic - delete topic error");
              return res.status(500).json({
                  title: 'An error occurred',
                  error: err
              });
            }
            console.log("Delete topic - success");
            res.status(200).json({
                message: 'Topic deleted',
                obj: result
            });
        });
      });
    });
  };
}