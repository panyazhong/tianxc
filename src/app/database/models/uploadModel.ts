import mongoose from '../mongodb';
import uploadSchema from '../schema/uploadSchema';

const uploadModel = mongoose.model('upload', uploadSchema);

export default uploadModel;
