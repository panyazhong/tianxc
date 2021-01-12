import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const behaviorSchema = new Schema({
  user: {
    ref: 'user',
    type: mongoose.Types.ObjectId,
  },
  load_time: Number,
  leave_time: Number,
  behavior: String,
  type: String,
});

export default behaviorSchema;
