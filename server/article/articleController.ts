import Article from './articleModel';
import BaseCtrl from '../baseController';


export default class ArticleCtrl extends BaseCtrl {
  model = Article;

  getAll = (req, res) => {
    let query = this.model.find();

    query//.exists('topic', false)
      //.where('topic').eq(null)
      .populate('source')
      .exec(function (err, docs) {
        if (err) { return console.error(err); }
        res.json(docs);
      });
  }

  // Get by id
  get = (req, res) => {
    this.model.findOne({_id: req.params.id})
      .populate('source')
      .exec(function (err, docs) {
        if (err) { return console.error(err); }
        res.json(docs);
      });
  };
}
