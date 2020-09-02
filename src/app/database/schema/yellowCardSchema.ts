import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const yellowCardSchema = new Schema({
  user: {
    ref: 'user',
    type: String,
    unique: true,
  },
  yellowCard: Number,
});

export default yellowCardSchema;
