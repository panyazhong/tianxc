import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const userSchema = new Schema(
  {
    id: mongoose.Types.ObjectId,
    username: {
      type: String,
      unique: true,
    },
    realname: {
      type: String,
      unique: true,
    },
    password: String,
    role: {
      ref: 'role',
      type: mongoose.Types.ObjectId,
    },
  },
  { timestamps: { createdAt: 'created', updatedAt: 'updated' } }
);

export default userSchema;
