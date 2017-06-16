import * as mongoose from 'mongoose'; 
import { ITopics } from '../interfaces/ITopics';

const topicSchema = new mongoose.Schema({
  title: String,
  timestamp: Date,
  image: String,
  news_article_count: Number,
  location: String,
  categories: [String]
});

const Topic = mongoose.model('Topic', topicSchema);

/*type TopicType = ITopics & mongoose.Document;

var _model = mongoose.model <TopicType> ('Topic', _schema);*/

export default Topic;

