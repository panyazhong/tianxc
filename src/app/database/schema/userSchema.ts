import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const userSchema = new Schema(
  {
    id: mongoose.Types.ObjectId,
    district: String,
    net: String,
    account: {
      type: String,
      unique: true,
    },
    username: {
      type: String,
      unique: true,
    },
    telephone: String,
    password: String,
    role: {
      ref: 'role',
      type: mongoose.Types.ObjectId,
    },
  },
  { timestamps: { createdAt: 'created', updatedAt: 'updated' } }
);

export default userSchema;
