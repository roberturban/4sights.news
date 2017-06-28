/**
 * Created by Christopher on 18.06.2017.
 */
import Topic from './topicModel';
import BaseCtrl from '../baseController';

export default class TopicCtrl extends BaseCtrl {
  model = Topic;

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
    this.model.findOne({_id: req.params.id})
      .populate('categories')
      .exec(function (err, docs) {
        if (err) { return console.error(err); }
        res.json(docs);
      });
  };
}
