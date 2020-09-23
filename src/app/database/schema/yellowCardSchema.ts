import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const yellowCardSchema = new Schema({
  url: String,
  upload_time: Number,
  year: Number,
  uploador: {
    ref: 'user',
    type: mongoose.Types.ObjectId,
  },
});

export default yellowCardSchema;
