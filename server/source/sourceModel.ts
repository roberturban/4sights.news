/**
 * Created by Kevin on 22.06.2017.
 */
import * as mongoose from 'mongoose';
const Schema = mongoose.Schema;

const sourceSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  logoUrl: {
    type: String,
    required: true
  },
  homepage: {
    type: String,
    required: true,
  }
});

const Source = mongoose.model('Source', sourceSchema);

export default Source;
