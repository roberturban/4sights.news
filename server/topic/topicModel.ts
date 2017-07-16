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
  categories: [
    {
      type: Schema.Types.ObjectId,
      ref: 'Category'
    }
  ],
  news_articles: [
    {
      type: Schema.Types.ObjectId,
      ref: 'Article'
    }
  ]
});

topicSchema.set('toJSON', {
  transform: function(doc, topic, options) {
    topic.news_article_count = topic.news_articles.length;
    return topic;
  }
});

const Topic = mongoose.model('Topic', topicSchema);

export default Topic;
