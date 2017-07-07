import Article from './articleModel';
import BaseCtrl from '../baseController';


export default class ArticleCtrl extends BaseCtrl {
  model = Article;

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
