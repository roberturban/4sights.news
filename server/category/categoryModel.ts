/**
 * Created by Christopher on 17.06.2017.
 */
import * as mongoose from 'mongoose';

const categorySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
});

const Category = mongoose.model('Category', categorySchema);

export default Category;

