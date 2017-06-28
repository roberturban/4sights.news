import * as mongoose from 'mongoose';
const Schema = mongoose.Schema;

const topicSchema = new Schema({
  title: {
    type: String,
    required: true
  },
  timestamp: {
    type: Date,
    required: true
  },
  image: {
    type: String,
    required: true,
  },
  location: {
    type: String,
    required: true
  },
  news_article_count: {
    type: Number,
    required: true,
  },
  categories: [
    {
      type: Schema.Types.ObjectId,
      ref: 'Category'
    }
  ]
});

const Topic = mongoose.model('Topic', topicSchema);

export default Topic;
