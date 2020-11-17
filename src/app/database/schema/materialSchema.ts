import mongoose from 'mongoose';
const Schema = mongoose.Schema;

const materialSchema = new Schema({
  path: String,
  name: String,
  upload_time: String,
  uploador: {
    ref: 'user',
    type: mongoose.Types.ObjectId,
  },
});

export default materialSchema;
