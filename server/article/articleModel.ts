/**
 * Created by Kevin on 22.06.2017.
 */
import * as mongoose from 'mongoose';
const Schema = mongoose.Schema;

const articleSchema = new Schema({
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: false
  },
  image: {
    type: String,
    required: false,
  },
  url: {
    type: String,
    required: true
  },
  author: {
    type: String,
    required: false,
  },
  published: {
    type: Date,
    required: true
  },
  source: {
    type: Schema.Types.ObjectId,
    ref: 'Source',
    required: false
  },
});

const Article = mongoose.model('Article', articleSchema);

export default Article;
