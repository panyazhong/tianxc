import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const signSchema = new Schema({
  sign_name: String,
  sign_url: String,
});

export default signSchema;
