import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const roleSchema = new Schema({
  id: mongoose.Types.ObjectId,
  role_name: {
    type: String,
    unique: true,
  },
});

export default roleSchema;
