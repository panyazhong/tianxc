import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const wageSchema = new Schema(
  {
    channelCode: {
      ref: 'user',
      type: String,
    },
    wage: Number,
    wageMonth: String,
  },
  { timestamps: { createdAt: 'created', updatedAt: 'updated' } }
);

export default wageSchema;
