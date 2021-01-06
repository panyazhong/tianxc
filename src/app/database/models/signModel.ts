import mongoose from '../mongodb';
import signSchema from '../schema/signSchema';

const signModel = mongoose.model('sign', signSchema);

export default signModel;
