import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const userSchema = new Schema({
  id: mongoose.Types.ObjectId,
  username: String,
  password: String,
  role: {
    ref: 'role',
    type: mongoose.Types.ObjectId,
  },
});

export default userSchema;
