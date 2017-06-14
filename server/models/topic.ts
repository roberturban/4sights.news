import * as mongoose from 'mongoose';

const topicSchema = new mongoose.Schema({
  title: String,
  timestamp: Date,
  image: String,
  news_article_count: Number,
  location: String,
  categories: [String]
});

const Topic = mongoose.model('Topic', topicSchema);

export default Topic;
