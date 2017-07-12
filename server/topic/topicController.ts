
import Topic from './topicModel';
import BaseCtrl from '../baseController';
const param = require('../middleware/param');

// models must be required at least once during request lifecycle
require('../source/sourceModel');
require('../article/articleModel');

export default class TopicCtrl extends BaseCtrl {
  model = Topic;

  // Get all
  getAll = (req, res) => {
    let query = this.model.find();

    if (req.query.user_id) {
      query = query.where('categories').in(req.query.user_id.categories)
    }

    query.populate('categories')
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
      .populate({
        path: 'news_articles',
        populate: [{
          path: 'source'
        }]
      })
      .exec(function (err, docs) {
        if (err) { return console.error(err); }
        res.json(docs);
      });
  };
}
