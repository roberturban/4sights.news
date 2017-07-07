
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
    console.log(req);
    this.model.findOne({_id: req.params.id})
      .populate('categories')
      .exec(function (err, docs) {
        if (err) { return console.error(err); }
        res.json(docs);
      });
  };
}
