import * as bodyParser from 'body-parser';
import * as dotenv from 'dotenv';
import * as express from 'express';
import * as morgan from 'morgan';
import * as mongoose from 'mongoose';
import * as path from 'path';

const userRoutes = require('./user/userRoutes');
const topicRoutes = require('./topic/topicRoutes');
const categoryRoutes = require('./category/categoryRoutes');
//const articleRoutes = require('./article/articleRoutes');

const app = express();
dotenv.load({ path: '.env' });
app.set('port', (process.env.PORT || 3000));

app.use('/', express.static(path.join(__dirname, '../public')));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use(morgan('dev'));
mongoose.connect(process.env.MONGODB_URI);
const db = mongoose.connection;
(<any>mongoose).Promise = global.Promise;

db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', () => {
  console.log('Connected to MongoDB');

  app.use('/api/users', userRoutes);
  app.use('/api/topics', topicRoutes);
  app.use('/api/categories', categoryRoutes);
  //app.use('/api/articles', articleRoutes);
  app.get('/*', function(req, res) {
    res.sendFile(path.join(__dirname, '../public/index.html'));
  });

  app.listen(app.get('port'), () => {
    console.log('4sights.news listening on port ' + app.get('port'));
  });

});

export { app };
