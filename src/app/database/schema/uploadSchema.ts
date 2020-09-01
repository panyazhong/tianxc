import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const uploadSchema = new Schema({
  upload_user: {
    ref: 'user',
    type: mongoose.Types.ObjectId,
  },
  upload_name: String,
  upload_url: String,
  upload_time: String,
  upload_excel_titles: String,
  upload_excel_content: String,
});

export default uploadSchema;
